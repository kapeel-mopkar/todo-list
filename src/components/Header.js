import { useState, useEffect} from "react";
import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";
export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          console.log(JSON.stringify(user));
          if (user) {
            setLoggedIn(true);
            setUsername(user.email);
          } else {
            setLoggedIn(false);
            setUsername("");
          }
        });
      }, []);
      const handleSignOut = () => {
        signOut(auth)
          .then(() => {
            setLoggedIn(false);
            setUsername("");
          })
          .catch((err) => {
            alert(err.message);
          });
      };
    
    return (
        <div className="fixed-header">
            <div className="app-header"><span className="app-header-text">TO-DO Service</span>
            {loggedIn &&  <span className="user-info-header">Hello, {username}<button onClick={handleSignOut}>signout</button></span>
            }
           </div>
        </div>
        );
}
