import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerInformation, setRegisterInformation] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/homepage");
      }
    });
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).then(() => {
        navigate("/homepage");
      }).catch((err) => alert(err.message));
  };

  const handleToggleRegisterLogin = () => {
    setIsRegistering(!isRegistering);
  } 

  const handleRegister = () => {
    if (registerInformation.email !== registerInformation.confirmEmail) {
      alert("Please confirm that email are the same");
      return;
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      alert("Please confirm that password are the same");
      return;
    }
    createUserWithEmailAndPassword(
      auth,
      registerInformation.email,
      registerInformation.password
    )
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => alert(err.message));
  };

  return (
      <div className="form">
        {isRegistering ? (
         <>
         <div className="register-form">
           <input
             type="email"
             placeholder="Email"
             value={registerInformation.email}
             onChange={(e) =>
               setRegisterInformation({
                 ...registerInformation,
                 email: e.target.value
               })
             }
           />
           <input
             type="email"
             placeholder="Confirm Email"
             value={registerInformation.confirmEmail}
             onChange={(e) =>
               setRegisterInformation({
                 ...registerInformation,
                 confirmEmail: e.target.value
               })
             }
           />
           <input
             type="password"
             placeholder="Password"
             value={registerInformation.password}
             onChange={(e) =>
               setRegisterInformation({
                 ...registerInformation,
                 password: e.target.value
               })
             }
           />
           <input
             type="password"
             placeholder="Confirm Password"
             value={registerInformation.confirmPassword}
             onChange={(e) =>
               setRegisterInformation({
                 ...registerInformation,
                 confirmPassword: e.target.value
               })
             }
           />
           <button onClick={handleRegister}>create</button>
           <p className="message">Already registered? <button className="btn-link" onClick={handleToggleRegisterLogin}>Sign In</button></p>
         </div>
         </>
        ) : (
          <>
          <div className="login-form">
            <input type="email" placeholder="Email" onChange={handleEmailChange} value={email} />
            <input
              type="password"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Password"
            />
            <button onClick={handleSignIn}>
              login
            </button>
            <p className="message">Not registered? <button className="btn-link" onClick={handleToggleRegisterLogin}>Create an account</button></p>
          </div>
          </>
        )}
      </div>
  );
}
