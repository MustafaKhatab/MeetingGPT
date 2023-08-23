// Logout.js
import React from 'react';

const Logout = ({ handleLogout, isLoggingOut }) => {

  return (
    <button
      className="logout-button"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      Logout
    </button>
  );
};

export default Logout;
