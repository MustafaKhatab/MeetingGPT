import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import Register from "./features/user/Register";
import Public from "./components/Public";
import VideoRoom from "./features/videoCall/VideoRoom";
import RoomCreate from "./features/Room/RoomCreate";
import RequireAuth from "./features/auth/RequireAuth";
import CheckAuthRoom from "./features/auth/CheckAuthRoom";
import Guest from "./features/Room/Guest";
import Transcription from "./features/videoCall/Transcription";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />}/>
        <Route path="transcription" element={<Transcription/>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="roomCreate" element={<RoomCreate />} />
      </Route>
      <Route path="guest" element={<Guest />} />
      <Route element={<CheckAuthRoom />}>
      <Route path="room/:ROOM_ID" element={<VideoRoom />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
