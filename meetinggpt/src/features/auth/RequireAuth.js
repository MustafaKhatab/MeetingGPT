import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { selectCurrentToken, setCredentials } from './authSlice';
import { useSelector, useDispatch } from 'react-redux';

const RequireAuth = () => {
  const location = useLocation();
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedId = localStorage.getItem('id');
    const expiresIn = localStorage.getItem('expiresIn');

    if (storedToken) {
      dispatch(setCredentials({id:storedId,token:storedToken,expiresIn:expiresIn}));
      console.log(storedToken,"stored token")
    }
  }, [dispatch]);


  const expirationTime = new Date(localStorage.getItem('expiresIn'));
  const currentTime = new Date();
  const isExpired=currentTime>expirationTime;

  const hasToken = token || localStorage.getItem('token');
  if(!token){
    dispatch(setCredentials({id:localStorage.getItem('id'),token: localStorage.getItem('token'),expiresIn:localStorage.getItem('expiresIn')}));
  }
  const isAuthenticated =hasToken && !isExpired;
  
  const content = isAuthenticated? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
};

export default RequireAuth;
