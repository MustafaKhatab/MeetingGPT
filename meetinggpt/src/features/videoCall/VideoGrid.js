import React from "react";
import Video from "./Video";

function VideoGrid({ myVideo, peers }) {
  const numberOfPeers = Object.keys(peers).length;
  const totalUsers = numberOfPeers + 1;

  let gridTemplateColumns;
  let gridTemplateRows;

  if (totalUsers === 1) {
    gridTemplateColumns = "1fr";
    gridTemplateRows = "1fr";
  } else if (totalUsers === 2) {
    gridTemplateColumns = "1fr 1fr";
    gridTemplateRows = "1fr";
  } else if (totalUsers === 3) {
    gridTemplateColumns = "1fr 1fr";
    gridTemplateRows = "1fr 1fr";
  } else {
    gridTemplateColumns = "1fr 1fr";
    gridTemplateRows = "1fr 1fr";
  }

  return (
    <main className="video-grid" style={{ gridTemplateColumns, gridTemplateRows }}>
      {myVideo && (
        <div className="video-container main-video">
          <p>Your Video</p>
          <Video stream={myVideo} muted={true}/>
        </div>
      )}

      {Object.entries(peers).map(([userId, peer], index) => (
        <div key={userId} className={`video-container video-${index + 2}`}>
          <p>{peer.username}</p>
          <Video stream={peer.stream} peer={peer.peer}  muted={false} />
        </div>
      ))}
    </main>
  );
}

export default VideoGrid;
