# Library-Robotics

This repo contains the high level code for user experience and interaction

> **Notes:** header with the * (asterisk symbol) means that section is still in progress

## System description

![system diagram](img/system_diagram.png)

This repo focuses on the high level programming which mainly used for user/actor experience and interaction. Some of the feature which the robots has are as follows,

- Listening
- Vision
- User Information center

![alt text](img/high_level_diagram.png)

### Listening (*)

This feature has to be able to "wake up the robot"/command spotting, find the source of the sound, and then transcribe the audio.

Thus the target in this section are:

- Keyword spotting (low energy voice detection)
  - To be discused:
  - [edge device KWS by ARM](https://github.com/ARM-software/ML-KWS-for-MCU)
  - [Edge impulse KWS](https://docs.edgeimpulse.com/datasets/audio/keyword-spotting)
  - [Edge impulse Jetson](https://docs.edgeimpulse.com/hardware/boards/nvidia-jetson)
  - [Edge impulse on python](https://docs.edgeimpulse.com/tools/libraries/sdks/inference/linux/python)
- TDOA/sound source localization
- Speech to text (STT)
  - [indonesian-whisperer](https://github.com/cahya-wirawan/indonesian-whisperer)
  - [Open AI Whisper](https://github.com/openai/whisper)

### Vision (*)

This feature has to be able to find the presence of the user/actor and detect actor gesture.

Thus the target in this section are:

- Pose estimation using wireframe
- User/actor depth estimation

### User information center (*)

This feature has to be able to give information about the book,find/recomend the user about a book, retain information about the user, and have a fun experience.

Thus the target in this section are:

- LLM for book recomendation and give information about book
- user database
- Book Database
- Good UI
  - [Kiosk mode chrome/chromium (like many used in other industry for simple UI)](https://dietpi.com/forum/t/navigate-chromium-kiosk-to-new-url-from-command-line/20690)

## System Integration (*)

This system uses the ROS2 environment to comunicate between node and thread optimization.

### Installation (*)

To make installtion over many robot easier, a bash file for jetson has been made. To install this program, run the following code in the terminal:

```bash
bash ./install_app.sh
```

### Run the program (*)


To rerun the program upon startup or failure, a bash file also has been made. To restart the code, run the following code in the terminal:

```bash
bash ./start_app.sh
```