import React, { useRef, useEffect } from "react";

function Video({ stream, muted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video">
      <video className="video-element" playsInline autoPlay muted={muted} ref={videoRef} />
    </div>
  );
}

export default Video;
