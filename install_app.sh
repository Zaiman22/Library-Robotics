#!/usr/bin/env bash

check_docker() {
  echo "Checking if Docker is installed..."
  if [ -x "$(command -v docker)" ]; then
    echo "Success! Docker is installed."
  else
    echo "Docker is not installed. Please follow the instructions at: https://docs.docker.com/engine/install/debian to install Docker"
    exit 1
  fi
}

create_src_folder(){
    echo "Checking src folder exist"
    if [ ! -d "src" ]; then
        echo "src does not exist."
        mkdir src
    else
        echo "src does exist."
    fi
}

choose_gpu() {
  >&2 echo "Checking if Nvidia support is enabled for Docker..."
  gpu="false"
  if dpkg -s nvidia-container-toolkit &>/dev/null; then
    >&2 echo "The Nvidia container toolkit is installed, GPU support will be enabled."
    gpu="true"
  else
    >&2 echo "the Nvidia container toolkit is not installed, GPU support will be disabled."
  fi

  echo $gpu
}


create_docker() {

    export GID=$(id -g)
    export UID=$(id -u)

    echo "Docker build has started. This may take some time..."
    if [ "$1" == "true" ]; then
      docker compose up --build -d
    else
      echo "No GPU detected please contact, maintainer or fix you gpu installation"
      exit 1
    fi

}


check_docker
gpu=$(choose_gpu)
if [ $? == 1 ]; then
  echo "Exiting script."
  exit 1
fi
create_docker $gpu