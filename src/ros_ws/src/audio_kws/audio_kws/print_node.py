import rclpy
from rclpy.node import Node

class PrintNode(Node):
    def __init__(self):
        super().__init__('print_node')
        self.get_logger().info("Hello from ROS 2 Python node!")

def main(args=None):
    rclpy.init(args=args)
    node = PrintNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
