import React, { useContext } from "react";
import "./auth.scss";
import { useState } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { LOGIN_USER } from "../../Apollo/mutations/user";
import {
  AiFillEyeInvisible,
  AiFillEye,
} from "react-icons/ai";
import { AuthDispatchContext } from "../../context/authentication/authContext";
import Spinner from "../../Components/Spinner";

const Login = () => {
  const authDispatchContext = useContext(
    AuthDispatchContext
  );
  const { loginDispatch } = authDispatchContext;

  const [variables, setVariables] = useState({
    email: "",
    password: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const onChangeHandler = (e) => {
    setVariables({
      ...variables,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const { email, password } = variables;

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, res) {
      if (res.data.login.ok === false) {
        setErrors(res.data.login.errors[0]);
        setShowAlert(true);
      }
      if (res.data.login.ok === true) {
        setErrors(null);
        setShowAlert(false);
        loginDispatch(res);
        window.location.href = "/";
      }
    },
    onError: (err) => {
      setErrors(err);
      setShowAlert(true);
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };

  return (
    <Container className="auth-wrapper justify-content-center">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            {showAlert && errors !== null && (
              <Alert
                style={{ width: "100%", maxWidth: "35rem" }}
                variant="danger"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                <p className="mb-0 mt-0">
                  {errors.message}
                </p>
              </Alert>
            )}
            <h1 className="text-center">Login</h1>
          </div>
          <Form
            onSubmit={onSubmitHandler}
            style={{ width: "100%" }}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={email}
                onChange={onChangeHandler}
                type="email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  className="bg-white border-right-0"
                  name="password"
                  value={password}
                  type={passwordShown ? "text" : "password"}
                  onChange={onChangeHandler}
                />
                <InputGroup.Prepend>
                  <InputGroup.Text className="bg-white border-left-0 rounded-right">
                    {" "}
                    {passwordShown ? (
                      <AiFillEyeInvisible
                        onClick={togglePasswordVisiblity}
                      />
                    ) : (
                      <AiFillEye
                        onClick={togglePasswordVisiblity}
                      />
                    )}
                  </InputGroup.Text>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>

            <div
              style={{
                width: "100%",
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
                paddingTop: "1rem",
                paddingBottom: "1rem",
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <Button
                  block
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  login
                </Button>
              )}
            </div>
          </Form>
          <div>
            <p>Don't have an accout</p>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
