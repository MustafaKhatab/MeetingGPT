import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetRoomQuery } from './roomApiSlice';
import Logout from '../auth/Logout';
import { useSendLogoutMutation } from "../auth/authApiSlice";

const RoomCreate = () => {
  const navigate = useNavigate();
  const { data: roomData ,isError} = useGetRoomQuery();
  const ROOM_ID = roomData?.data;
  const [sendLogout, { isLoading: isLoggingOut }] = useSendLogoutMutation();

  const handleLogout = () => {
    sendLogout();
    navigate("/");
  };

  const handleCreateRoom = () => {
    if (ROOM_ID) {
      navigate(`/room/${ROOM_ID}`);
    }
  };

  return (
    <div className='Room-Create'>
      <div className='Logout'>
      <Logout handleLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </div>
      {isError && <p className="error-message">Error: The server is not responding.</p>}
      <h1>Click here to create a Video Room</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default RoomCreate;
