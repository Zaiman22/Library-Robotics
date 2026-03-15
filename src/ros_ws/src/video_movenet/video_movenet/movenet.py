import tensorflow as tf
import numpy as np
import cv2
import time

import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, PointCloud2
from person_of_interest_msgs.msg import PersonOfInterestPosition, PersonOfInterestState
from rclpy.qos import qos_profile_sensor_data
from cv_bridge import CvBridge
import struct
import math


EDGES = {
    (0,1),(0,2),(1,3),(2,4),(0,5),(0,6),(5,7),(7,9),
    (6,8),(8,10),(5,6),(5,11),(6,12),(11,12),
    (11,13),(13,15),(12,14),(14,16)
}


class MoveNetNode(Node):

    def __init__(self):
        super().__init__('movenet_node')

        self.bridge = CvBridge()
        self.prev_time = time.time()
        self.latest_frame = None

        # load TFLite model
        model_path = "/home/ros/ws/src/ros_ws/src/video_movenet/video_movenet/4.tflite"

        self.interpreter = tf.lite.Interpreter(model_path=model_path)
        self.interpreter.allocate_tensors()

        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

        self.frame_count = 0
        self.avg_frame = 0

        # subscribe to camera
        self.sub_image = self.create_subscription(
            Image,
            "camera/color/image_raw",
            self.image_callback,
            qos_profile_sensor_data
        )

        # subscribe to depth camera
        self.sub_depth = self.create_subscription(
            PointCloud2,
            "/camera/depth_registered/points",
            self.depth_callback,
            qos_profile_sensor_data
        )

        # create publisher for POI existancce and postion

        self.pub_POI_existance = self.create_publisher(
            PersonOfInterestState,
            "POI/existance",
            10)

        self.pub_POI_position = self.create_publisher(
            PersonOfInterestPosition,
            "POI/position",
            10)

        self.POI_state = False


        self.depth_msgs = []


        self.declare_parameter("show_rgb_camera", True)
        self.show_rgb_camera = self.get_parameter("show_rgb_camera").value

        self.declare_parameter("log_joint", False)
        self.log_joint = self.get_parameter("log_joint").value
        
        self.get_logger().info("MoveNet node started")


    def depth_callback(self,msg):
        self.depth_msgs = msg
    
    def image_callback(self, msg):

        # ROS → OpenCV
        self.latest_frame = self.bridge.imgmsg_to_cv2(msg, desired_encoding="bgr8")


    def draw_keypoints(self, frame, keypoints, cloud_msg, threshold):

        h, w, _ = frame.shape
        shaped = np.squeeze(keypoints * [h, w, 1])

        joints = []

        for kp in shaped:
            ky, kx, conf = kp

            if conf > threshold:

                px = int(kx)
                py = int(ky)

                # --- get depth from pointcloud ---
                index = py * cloud_msg.row_step + px * cloud_msg.point_step
                data = cloud_msg.data[index:index+12]

                if len(data) < 12:
                    return None, None, None

                X, Y, Z = struct.unpack('fff', data)

                if not math.isfinite(Z):
                    Z = None

                if self.show_rgb_camera:
                    cv2.circle(frame, (px, py), 4, (0,255,0), -1)

                joints.append((px, py, conf, X, Y, Z))

        return joints


    def draw_connections(self, frame, keypoints, edges, threshold):
        y, x, _ = frame.shape
        shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))

        for edge in edges:
            p1, p2 = edge

            y1, x1, c1 = shaped[p1]
            y2, x2, c2 = shaped[p2]

            if (c1 > threshold) and (c2 > threshold):
                cv2.line(frame,(int(x1),int(y1)),(int(x2),int(y2)),(0,0,255),2)


    def get_average_joint_position(self, array):
        z = [j[5] for j in array if j[5] is not None and not np.isnan(j[5])]
        x = [j[3] for j in array if j[3] is not None and not np.isnan(j[3])]
        if len(z) == 0:
            return None, None
        return np.mean(z), np.mean(x)

    def process_frame(self, frame):
        POI_state_msg = PersonOfInterestState()
        POI_pos_msg = PersonOfInterestPosition()
        img = cv2.resize(frame, (256,256))
        img = np.expand_dims(img, axis=0).astype(np.uint8)
        # inference
        self.interpreter.set_tensor(
            self.input_details[0]['index'],
            np.array(img)
        )

        self.interpreter.invoke()

        keypoints_with_scores = self.interpreter.get_tensor(
            self.output_details[0]['index']
        )

        

        curr = time.time()
        fps = 1/(curr-self.prev_time)
        self.prev_time = curr

        if(self.frame_count == 30):
            self.avg_frame = self.avg_frame+fps
            self.avg_frame = self.avg_frame/30
            self.get_logger().info(f"fps: {self.avg_frame}")
            self.frame_count =0
            self.avg_frame = 0
        else:
            self.frame_count = self.frame_count +1
            self.avg_frame = self.avg_frame+fps

        joints = self.draw_keypoints(frame, keypoints_with_scores, self.depth_msgs, 0.6)
        if(self.show_rgb_camera):
            # draw skeleton
            self.draw_connections(frame, keypoints_with_scores, EDGES, 0.6)
            
            #add fps counter
            cv2.putText(frame,f"FPS:{fps:.1f}",(20,40),
                        cv2.FONT_HERSHEY_SIMPLEX,1,(255,255,0),2)
            #show image
            cv2.imshow("MoveNet", frame)
            cv2.waitKey(10)

        pz,px = self.get_average_joint_position(joints)

        
        if(self.POI_state):
            if pz is None or pz > 1.3:
                self.POI_state = False
                POI_state_msg.exsistance = False
                self.pub_POI_existance.publish(POI_state_msg)
        else:
            if(pz is not None and pz <=1.3):
                self.POI_state = True
                POI_state_msg.exsistance = True
                self.pub_POI_existance.publish(POI_state_msg)

        if(px):
            POI_pos_msg.pos_x = px
            POI_pos_msg.pos_z = pz
            self.pub_POI_position.publish(POI_pos_msg)
            # if pz > 1.3:
                # self.get_logger().info("to far")
            if (self.log_joint):
                print(f"px: {px}\npz: {pz}")
                
            



def main(args=None):

    rclpy.init(args=args)

    node = MoveNetNode()

    while rclpy.ok():
        rclpy.spin_once(node)

        if node.latest_frame is None:
            continue

        frame = node.latest_frame.copy()
        node.process_frame(frame)

    node.destroy_node()
    rclpy.shutdown()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()