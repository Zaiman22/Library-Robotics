FROM ros:humble-ros-base

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    sudo \
    python3-colcon-common-extensions \
    python3-dev \
    python3-pip \
    python3-pybind11 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt

# Fixed container user (DO NOT map host user)
ARG UNAME=ros
ARG UID=1000
ARG GID=1000

RUN groupadd -g ${GID} ${UNAME} && \
    useradd -m -u ${UID} -g ${GID} -s /bin/bash ${UNAME} && \
    echo "${UNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER ${UNAME}
WORKDIR /home/${UNAME}

SHELL ["/bin/bash", "-c"]

RUN echo "source /opt/ros/$ROS_DISTRO/setup.bash" >> ~/.bashrc && \
    mkdir -p /home/${UNAME}/ws/src

WORKDIR /home/${UNAME}/ws

ENTRYPOINT []
CMD ["bash", "-c", "sleep infinity"]
