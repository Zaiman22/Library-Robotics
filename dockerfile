# Base image: ROS 2 Humble (Ubuntu 22.04)
FROM ros:humble-ros-base

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install Python and pip (usually already present, but safe)
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-colcon-common-extensions \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy requirements.txt
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Source ROS 2 automatically
SHELL ["/bin/bash", "-c"]
RUN echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc

# Default command
CMD ["bash"]