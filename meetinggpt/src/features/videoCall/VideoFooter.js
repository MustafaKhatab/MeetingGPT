import React from "react";

function VideoFooter({
  videoShow,
  toggleVideo,
  toggleAudio,
  audioPlaying,
  handleTranscriptSubmit,
}) {
  return (
    <footer className="video-room-footer">
      <button onClick={toggleVideo}>
        {videoShow ? "Turn Off Video" : "Turn On Video"}
      </button>
    
      <button onClick={toggleAudio}>
        {audioPlaying ? "Mute Audio" : "Unmute Audio"}
      </button>
      <button onClick={handleTranscriptSubmit} className="leave-call">Leave Call</button>
    </footer>
  );
}

export default VideoFooter;
