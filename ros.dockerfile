FROM ros:humble-ros-base

ENV DEBIAN_FRONTEND=noninteractive

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    pulseaudio \
    pulseaudio-utils \
    libasound2-plugins \
    python3-colcon-common-extensions \
    python3-dev \
    python3-pip \
    python3-pybind11 \
    alsa-utils \
    portaudio19-dev \
    libgl1 \
    curl \
    iproute2 \
    sudo \
    ros-humble-rosbridge-suite \
    ros-humble-ament-cmake-clang-format \
    && rm -rf /var/lib/apt/lists/*

# react dependencies
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs


# Create user
ARG UNAME=ros
ARG UID=1000
ARG GID=1000

RUN groupadd -g ${GID} ros && \
    useradd -m -u ${UID} -g ${GID} -s /bin/bash ros && \
    echo "ros ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${UNAME}
WORKDIR /home/${UNAME}

# Fix PATH for pip user installs
ENV PATH="/home/${UNAME}/.local/bin:$PATH"

# Python deps
COPY ros_requirements.txt /tmp/requirements.txt

RUN pip3 install --user --upgrade pip wheel && \
    pip3 install --user "setuptools<80" && \
    pip3 install --user --no-cache-dir -r /tmp/requirements.txt && \
    pip3 install --user edge_impulse_linux

# ROS workspace
SHELL ["/bin/bash", "-c"]
RUN echo "source /opt/ros/$ROS_DISTRO/setup.bash" >> ~/.bashrc && \
    mkdir -p /home/${UNAME}/ws/src

WORKDIR /home/${UNAME}/ws

CMD ["bash"]
