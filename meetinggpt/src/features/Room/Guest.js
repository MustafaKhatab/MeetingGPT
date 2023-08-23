import React, { useState, useEffect } from 'react'
import { useNavigate,Link,useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField'
import theme from '../theme';
import PulseLoader from 'react-spinners/PulseLoader'
import { useGuestLoginMutation } from "./roomApiSlice";

const GuestComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ROOM_ID = new URLSearchParams(location.search).get("roomId");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [guestLogin, { isLoading }] = useGuestLoginMutation();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    setUsernameError("");
  }, [username]);

  useEffect(() => {
    setEmailError("");
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username !== "" && email !== "") {
      try {
        const loginData = { userName: username, email: email };
        const { message } = await guestLogin(loginData).unwrap();
        localStorage.setItem("guestId",message._id)
        localStorage.setItem("username",username)
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem("expiresIn",expirationDate)


        setUsername("");
        setEmail("");
        navigate(`/room/${ROOM_ID}`);
      } catch (err) {
        if (!err.status) {
          console.log(err);
          setUsernameError("No Server Response");
        } else if (err.status === 401) {
          if (err.data.message === "No user") {
            setUsernameError("Wrong username");
          } else {
            setEmailError("Wrong email");
          }
        }
      }
    } else if (username === "") {
      setUsernameError("Please enter a username");
    } else {
      setEmailError("Please enter an email");
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);

  const loaderContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  if (isLoading)
    return (
      <div className="loader-container" style={loaderContainerStyle}>
        <PulseLoader
          className="custom-loader"
          size={25}
          margin={25}
          color={"#FFF"}
        />
      </div>
    );

  const content = (
    <ThemeProvider theme={theme}>
      <div className="login">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__title-row">
            <h1>Welcome, Guest!</h1>
            <p>Please enter your name and email to continue as a guest:</p>
          </div>
          <TextField
            className="form__input"
            label="Username"
            type="text"
            id="username"
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            variant="outlined"
            error={usernameError !== ""}
            helperText={usernameError}
            InputLabelProps={{
              style: { color: "white" },
            }}
          />

          <TextField
            className="form__input"
            label="Email"
            type="text"
            id="email"
            value={email}
            onChange={handleEmailInput}
            autoComplete="off"
            variant="outlined"
            error={emailError !== ""}
            helperText={emailError}
            InputLabelProps={{
              style: { color: "white" },
            }}
          />
          <button className="form__submit-button" type="submit">
            continue as a guest
          </button>
        </form>
        <p>
          If you already have an account, <Link to="/login">login here</Link>.
        </p>
      </div>
    </ThemeProvider>
  );

  return content;
};

export default GuestComponent;
