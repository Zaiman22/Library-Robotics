import rclpy
from rclpy.node import Node
from rclpy.qos import qos_profile_sensor_data
from audio_common_msgs.msg import AudioStamped
from audio_kws_msgs.msg import KWSStamped
from audio_tdoa_msgs.msg import TDOAStamped
from edge_impulse_linux.audio import AudioImpulseRunner 
import numpy as np
import os


# TDOA library
from scipy import signal
from scipy.io import wavfile
import numpy as np

class KWS(Node):
    def __init__(self):
        super().__init__('KWS_classifier')
        
        # Audio subscription
        self.subscription = self.create_subscription(
            AudioStamped,
            'audio',
            self.listener_callback,
            qos_profile_sensor_data
        )

        # KWS prediction node
        model = "/home/ros/ws/src/ros_ws/src/audio_kws/audio_kws/KWS_7_02_2026.eim"


        print(model)
        self.runner = AudioImpulseRunner(model)
        model_info = self.runner.init()
        self.labels = model_info['model_parameters']['labels']
        self.buffer_size = 16000 #default value
        self.timer_ = self.create_timer(0.01, self.KWS_classify) # 2: Adjust timing

        # publisher for KWS prediction
        self.publisher_ = self.create_publisher(
            KWSStamped,
            "KWS_prediction",
            10)

        # publisher for TDOA 
        self.Vsound = 343.0 # m/s
        self.Dmic = 12.065 / 100  # meters



        self.publisher_TDOA_ = self.create_publisher(
            TDOAStamped,
            "sound_source_prediction",
            10)

        self.get_logger().info("Edge Impulse node opened.")
        self.audio_chunk = np.array([], dtype=np.int16)
        self.left_chunk = np.array([], dtype=np.int16)
        self.right_chunk = np.array([], dtype=np.int16)

        self.sample_length = 1 # in second
        self.rate = 48000




    def listener_callback(self, msg):
        # Metadata
        channels = msg.audio.info.channels
        self.rate = msg.audio.info.rate
        self.buffer_size = self.rate *self.sample_length
        chunk = msg.audio.info.chunk

        # Audio data (example: int16)
        samples = np.array(msg.audio.audio_data.int16_data, dtype=np.int16)

        # Split stereo
        if channels == 2:
            left = samples[0::2]
            right = samples[1::2]
            audio = ((left.astype(np.int32) + right.astype(np.int32)) // 2).astype(np.int16)

        else:
            audio = samples
        
        

        self.audio_chunk = np.concatenate([self.audio_chunk, audio])
        self.left_chunk = np.concatenate([self.left_chunk, left])
        self.right_chunk = np.concatenate([self.right_chunk, right])
        # keep last N samples only
        if len(self.audio_chunk) >= self.buffer_size:
            self.audio_chunk = self.audio_chunk[-self.buffer_size:]
            self.left_chunk = self.audio_chunk[-self.buffer_size:]
            self.right_chunk = self.audio_chunk[-self.buffer_size:]

        #debug purpose
        # print(audio)
        # print(rate)
    

    def butter_bandpass(self,lowcut, highcut, fs, order=5):
        nyq = 0.5 * fs
        low = lowcut / nyq
        high = highcut / nyq
        b, a = signal.butter(order, [low, high], btype='band')
        return b, a

    def butter_bandpass_filter(self,data, lowcut, highcut, fs, order=5):
        b, a = self.butter_bandpass(lowcut, highcut, fs, order=order)
        y = signal.lfilter(b, a, data)
        return y

    def get_degree(self,s1,s2):
        s1 = self.butter_bandpass_filter(s1,20,7000,self.rate)
        s2 = self.butter_bandpass_filter(s2,20,7000,self.rate)
        corr = signal.correlate(s2, s1, mode="full", method="auto")
        zero_lag = len(s1) - 1
        lag = zero_lag - np.argmax(corr) 
        delay = lag / self.rate
        # Distance difference
        d = delay * self.Vsound
        ratio = d /self.Dmic
        # self.get_logger().info(f"ratio: {ratio}")
        theta = np.arccos(ratio) * 180 / np.pi
        self.get_logger().info(f"theta: {theta}")
        return theta


    def KWS_classify(self):
        if(len(self.audio_chunk) >= self.buffer_size):
            prediction = KWSStamped()
            degree = TDOAStamped()
            res = self.runner.classify(self.audio_chunk)
            confidence = res['result']['classification']
            score = max(confidence.values())
            label = max(confidence, key=confidence.get)
            # score = confidence[label]
            # print(label)
            # print(score)
            # print(confidence)
            if (score < 0.60):
                label = 'unknown'
            
            if(label != 'unkwon' and label !='noise'):
                degree.degree = self.get_degree(self.left_chunk,self.right_chunk)
                # self.get_logger().info(f"KWS result → label: '{label}', confidence: {score:.2f}")
            prediction.prediction.confidence = score
            prediction.prediction.label = label
            print(prediction)
            self.publisher_.publish(prediction)
            self.publisher_TDOA_.publish(degree)

def main(args=None):
    rclpy.init(args=args)
    node = KWS()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
