import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setIsLoading] = useState(false);

  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    // Optional: Add validation
    let url = " ";
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCL4yDwp5GiPNEgN3qZzWGinqbl4Gu0q1s";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCL4yDwp5GiPNEgN3qZzWGinqbl4Gu0q1s";
    }

    setIsLoading(true);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          response.json().then((error) => {
            let errorMessage = "Authentication failed";
            errorMessage = error?.error?.message;
            alert(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace("/");
        console.log(data);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={passwordRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          {!loading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {loading && <p>Sending Request</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
