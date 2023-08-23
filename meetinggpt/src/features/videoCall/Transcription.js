import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSendTranscriptMutation } from "./videoRoomApiSlice";

const Transcription = ({
  dataConnections,
  peer,
  ROOM_ID,
  ownTranscript,
  setOwnTranscript,
  audioPlaying,
}) => {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [fullTranscript, setFullTranscript] = useState([]);

  const [sendTranscript] = useSendTranscriptMutation();

  const username = localStorage.getItem("username");

  const sendTranscriptData = (data) => {
    Object.values(dataConnections).forEach((connection) => {
      connection.send(data);
    });
  };

  const receiveTranscriptData = (data) => {
    const receivedTranscript = data;
    setFullTranscript((prevTranscript) => [
      ...prevTranscript,
      receivedTranscript,
    ]);
  };

  useEffect(() => {
    if (peer.current) {
      peer.current.on("connection", function (conn) {
        conn.on("data", (data) => {
          receiveTranscriptData(data);
        });
      });
    }
  }, [peer.current]);

  useEffect(() => {
    if (!listening) {
      if (transcript.trim() !== "") {
        console.log("not empty");

        const timestamp = new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const newSentence = {
          date: timestamp,
          sentence: username + " : " + transcript,
        };

        const updatedTranscript = [...fullTranscript, newSentence];
        if (audioPlaying) {
          setFullTranscript(updatedTranscript);
          setOwnTranscript((prevOwnTranscript) => [
            ...prevOwnTranscript,
            newSentence,
          ]);

          sendTranscriptData(newSentence);
        }
      }
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-IN",
      });
    }
  }, [listening, transcript]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await sendTranscript({ transcript: ownTranscript, ROOM_ID });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [fullTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <>
        <div>
          Transcription on this browser is not supported use Chrome for the best
          experience
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <br />
        <div className="main-content">
          {fullTranscript.map(({ date, sentence }, index) => (
            <p key={index}>{`${date}: ${sentence}`}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default Transcription;
