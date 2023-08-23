import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { selectCurrentToken, setCredentials } from './authSlice';
import { useSelector, useDispatch } from 'react-redux';

const CheckAuthRoom = () => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedId = localStorage.getItem('id');
    const expiresIn = localStorage.getItem('expiresIn');
   

    if (storedToken) {
      dispatch(setCredentials({id:storedId,token:storedToken,expiresIn:expiresIn}));
    }
  }, [dispatch]);


  const expirationTime = new Date(localStorage.getItem('expiresIn'));
  const currentTime = new Date();
  const isExpired=currentTime>expirationTime;

  const hasToken = token || localStorage.getItem('token')|| localStorage.getItem('guestId');
  const isAuthenticated =hasToken && !isExpired;
  const roomId = location.pathname.split('/room/')[1]; // Extract the room ID from the current URL

  const content = isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/guest?roomId=${roomId}`} // Pass the room ID as a query parameter in the redirect URL
      state={{ from: location }}
      replace
    />
  );

  return content;
};

export default CheckAuthRoom;
