import React from "react";
import "./auth.scss";
import { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../Apollo/mutations/user";
import Spinner from "../../Components/Spinner";

const Register = (props) => {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState(null);

  const onChangeHandler = (e) => {
    setVariables({
      ...variables,
      [e.target.name]: e.target.value,
    });
  };
  const { email, username, password, confirmPassword } = variables;

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, res) {
      if (res.data.register.ok === false) {
        setErrors(res.data.register.errors[0]);
        setShowAlert(true);
      }
      if (res.data.register.ok === true) {
        setErrors(null);
        setShowAlert(false);
        props.history.push("login");
      }
    },
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <Container className="auth-wrapper justify-content-center">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            {showAlert && errors !== null && (
              <Alert
                style={{ width: "100%" }}
                variant="danger"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                <p className="mb-0 mt-0">{errors.message}</p>
              </Alert>
            )}
            <h1 className="text-center">Register</h1>
          </div>
          <Form onSubmit={onSubmitHandler} style={{ width: "100%" }}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                value={email}
                onChange={onChangeHandler}
                type="email"
                className={
                  errors && errors.path === "Email" ? "is-invalid" : ""
                }
              />
            </Form.Group>

            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                value={username}
                type="text"
                onChange={onChangeHandler}
                className={
                  errors && errors.path === "Username" ? "is-invalid" : ""
                }
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                value={password}
                type="password"
                onChange={onChangeHandler}
                className={
                  errors && errors.path === "Password" ? "is-invalid" : ""
                }
              />
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                value={confirmPassword}
                type="password"
                onChange={onChangeHandler}
                className={
                  errors && errors.path === "ConfirmPassword"
                    ? "is-invalid"
                    : ""
                }
              />
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
                  register
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
};

export default Register;
