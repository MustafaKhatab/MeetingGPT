import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import theme from "../theme";
import Tooltip from "@mui/material/Tooltip";
import PulseLoader from "react-spinners/PulseLoader";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setUsernameError("");
  }, [username]);

  useEffect(() => {
    setPasswordError("");
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username !== "" && password !== "") {
      try {
        const loginData = { userName: username, password: password };
        localStorage.setItem("username", username);
        console.log("trying log in", loginData);
        const { id, token, expiresIn } = await login(loginData).unwrap();
        dispatch(setCredentials({ id, token, expiresIn }));

        setUsername("");
        setPassword("");
        navigate("/roomCreate");
      } catch (err) {
        if (!err.status) {
          console.log(err);
          setUsernameError("No Server Response");
        } else if (err.data.message === "User Not Found") {
          setUsernameError("Wrong username");
        } else if(err.data.message === "Incorrect Password"){
          setPasswordError("Wrong password");
        }
      }
    } else if (username === "") {
      setUsernameError("Please enter a username");
    } else {
      setPasswordError("Please enter a password");
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
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
            <h2>Log in to your account</h2>
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
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            variant="outlined"
            onChange={handlePwdInput}
            value={password}
            error={passwordError !== ""}
            helperText={passwordError}
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={showPassword ? "Hide password" : "Show password"}
                  placement="right"
                >
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
          <button className="form__submit-button" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </ThemeProvider>
  );

  return content;
};

export default Login;
