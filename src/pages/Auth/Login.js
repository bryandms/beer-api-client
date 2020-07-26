import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import Alert from "../../components/Alert/Alert";
import Errors from "../../components/Errors/Errors";

const Login = (props) => {
  const { setUserId, setToken, setIsAuth, setAutoLogout } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  const emailValidation = register({
    required: "The email field is required",
    validate: (value) => isEmail(value) || "Enter a valid email",
  });
  const passwordValidation = register({
    required: "The password field is required",
    minLength: {
      value: 6,
      message: "The password must be at least 6 characters.",
    },
  });
  const isEmail = (value) =>
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
      value
    );

  const onSubmit = ({ email, password }) => {
    setLoading(true);
    setError(null);
    fetch("https://beer-rest-api.herokuapp.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201)
          throw new Error("These credentials do not match our records.");

        return res.json();
      })
      .then((res) => {
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );

        setIsAuth(true);
        setToken(res.token);
        setUserId(res.userId);
        setLoading(false);
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        localStorage.setItem("expiryDate", expiryDate.toISOString());

        setAutoLogout(remainingMilliseconds);
        return props.history.push("/beers");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="container h-100">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-10 col-sm-8 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <img
                src="/logo192.png"
                height="100"
                className="rounded mx-auto d-block"
                alt="beer-api logo"
              />

              <Alert message={error} type="danger" />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    className={`form-control ${errors.email && "is-invalid"}`}
                    id="email"
                    name="email"
                    ref={emailValidation}
                  />
                  {errors.email && <Errors message={errors.email.message} />}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password && "is-invalid"
                    }`}
                    id="password"
                    name="password"
                    ref={passwordValidation}
                  />
                  {errors.password && (
                    <Errors message={errors.password.message} />
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Loading" : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="mt-5 text-black-50 text-center">
            You do not have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => ({
  userId: state.userId,
  token: state.token,
  isAuth: state.isAuth,
});

const mapDispatch = (dispatch) => ({
  setUserId: dispatch.userId.setUserId,
  setToken: dispatch.token.setToken,
  setIsAuth: dispatch.isAuth.setIsAuth,
});

export default connect(mapState, mapDispatch)(Login);
