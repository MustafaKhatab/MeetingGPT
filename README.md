# MeetingGPT
MERN website for creating Video Rooms with live transcription using Peer to Peer connection to livestream the video and audio and websockets for connecting the users.

Features

* Instantly create a new room or join a new one 
*  Video call with multiple people in real-time 
*    Mute audio/video 
*   Turn the camera on or off
*    Free Live transcription
*    Authentication support JWT tokens to prevent unknown users 
*    Simple and intuitive UI 
  *   Get a summary of the transcription sent to mail

Tech Stack used

  *  ReactJS - materailUI
* Redux
 *   Express
   *  MongoDB
   * SocketIO
    * Peerjs
   * and others

Requirements
To be able to run this app locally :

* you need to have Nodejs installed
 *   you need to have node package manager , npm or yarn
  *  you need to add these environment variables DATABASE_URI=Mongo db database URI, JWT_SECRET,EMAIL_FROM= email to use for sending the summary and EMAIL_PASS= password for that email, API_KEY=Open AI api key, JWT_COOKIE_EXPIRES_IN
    
 
