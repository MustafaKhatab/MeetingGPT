import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import socketClient from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import VideoGrid from "./VideoGrid";
import VideoFooter from "./VideoFooter";
import Transcription from "./Transcription";
import { useSendTranscriptMutation } from "./videoRoomApiSlice";
import Logout from "../auth/Logout";
import { useSendLogoutMutation } from "../auth/authApiSlice";

function VideoRoom() {
  const { ROOM_ID } = useParams();
  const [myVideo, setMyVideo] = useState(null);
  const [peers, setPeers] = useState({});
  const socketRef = useRef();
  const myPeerRef = useRef(); // Declare myPeer using useRef
  const [ownId, setOwnId] = useState("");
  const [videoShow, setVideoShow] = useState(true);
  const dbId = localStorage.getItem("id") || localStorage.getItem("guestId");
  const username = localStorage.getItem("username");
  const [dataConnections, setDataConnections] = useState({});
  const navigate = useNavigate();
  const [sendTranscript] = useSendTranscriptMutation();
  const [ownTranscript, setOwnTranscript] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(true);
  const [sendLogout, { isLoading: isLoggingOut }] = useSendLogoutMutation();
  const [error, setError] = useState(null);

  const handleLogout = () => {
    sendLogout();
    navigate("/");
  };

  const toggleAudio = () => {
    if (myVideo) {
      const audioTrack = myVideo.getAudioTracks()[0];
      if (audioTrack) {
        setAudioPlaying((prevAudioPlaying) => !prevAudioPlaying);
        audioTrack.enabled = !audioPlaying;
      }
    }
  };

  const toggleVideo = () => {
    if (myVideo) {
      setVideoShow((prevVideoShow) => !prevVideoShow);
      myVideo.getVideoTracks()[0].enabled = !videoShow;
    }
  };

  const handleTranscriptSubmit = async () => {
    const res = await sendTranscript({ transcription: ownTranscript, ROOM_ID });
    console.log(res, "response");
    navigate("/login");
  };

  useEffect(() => {
    const init = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: { echoCancellation: true },
        });
        setMyVideo(stream);

        const socket = socketClient("https://zoomgptbackend.onrender.com");

        socketRef.current = socket;

        const myPeer = new Peer();

        myPeerRef.current = myPeer; // Assign myPeer to myPeerRef

        myPeer.on("open", (id) => {
          setOwnId(id);
          socket.emit("join-room", ROOM_ID, id, dbId);
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setError("Error accessing media devices. Please allow the browser access to the camera and microphone")

      }
    };

    init();
  }, []);

  useEffect(() => {
    if (ownId) {
      socketRef.current.on("user-connected", (user) => {
        console.log("connecting to the new userthrough user-connected", user);

        connectToNewUser(user, myVideo, ownId);
      });

      socketRef.current.on("user-disconnected", (userId) => {
        setPeers((prevPeers) => {
          // Create a copy of the previous peers object
          const updatedPeers = { ...prevPeers };

          // Close the peer connection and remove the user from the updated peers object
          if (updatedPeers[userId]) {
            updatedPeers[userId].peer.close();
            delete updatedPeers[userId];
          }

          return updatedPeers; // Return the updated peers object
        });
      });

      socketRef.current.on("users", (users) => {
        users.forEach((user) => {
          console.log("connecting to the new userthrough users", user);

          connectToNewUser(user, myVideo, ownId);
        });
      });
    }
  }, [ownId]);

  useEffect(() => {
    console.log("peers object", peers);
  }, [peers]);

  const connectToNewUser = (user, stream, ownId) => {
    const userPeerId = user.userPeerId;

    if (userPeerId === ownId) {
      return; // Skip connecting to the local pee
    }

    const dataConnection = myPeerRef.current.connect(userPeerId); // Connect to the remote user

    setDataConnections((prevDataConnections) => ({
      ...prevDataConnections,
      [userPeerId]: dataConnection,
    }));

    const call = myPeerRef.current.call(userPeerId, stream, {
      metadata: username,
    });
    call.on("stream", (remoteStream) => {
      console.log("caller stream");
      const newRemoteStream = new MediaStream(remoteStream);

      const newPeerWithStream = {
        peer: dataConnection,
        stream: newRemoteStream,
        username: user.userDbId.userName,
      };
      setPeers((prevPeers) => ({
        ...prevPeers,
        [userPeerId]: newPeerWithStream,
      }));
    });
    myPeerRef.current.on("call", (incomingCall) => {
      console.log("answer oncall", incomingCall);
      incomingCall.answer(stream);
      incomingCall.on("stream", (remoteStream) => {
        console.log("answer onstream", remoteStream);
        const newRemoteStream = new MediaStream(remoteStream);

        const newPeerWithStream = {
          peer: incomingCall.peer,
          stream: newRemoteStream,
          username: incomingCall.metadata,
        };

        console.log(newPeerWithStream, "new peer with stream");

        setPeers((prevPeers) => ({
          ...prevPeers,
          [incomingCall.peer]: {
            ...prevPeers[incomingCall.peer],
            ...newPeerWithStream,
          },
        }));
      });
    });
  };

  return (
    <div className="video-room-container">
      <header className="video-room-header">
        <div className="Logout">
          <Logout handleLogout={handleLogout} isLoggingOut={isLoggingOut} />
        </div>
        Video Room
      </header>
      {error && <div className="error-message">{error}</div>}
      <div className="video-room-content">
        <div className="video-grid-container">
          <VideoGrid myVideo={myVideo} peers={peers} />
        </div>
        <div className="transcription-container">
          <Transcription
            dataConnections={dataConnections}
            peer={myPeerRef}
            ROOM_ID={ROOM_ID}
            ownTranscript={ownTranscript}
            setOwnTranscript={setOwnTranscript}
            audioPlaying={audioPlaying}
          />
        </div>
      </div>
      <VideoFooter
        videoShow={videoShow}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        audioPlaying={audioPlaying}
        handleTranscriptSubmit={handleTranscriptSubmit}
      />{" "}
    </div>
  );
}

export default VideoRoom;
