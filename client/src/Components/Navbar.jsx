import React, { useContext } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Image,
  FormControl,
  Form,
  Button,
} from "react-bootstrap";
import { AuthDispatchContext } from "../context/authentication/authContext";

const AppNavbar = () => {
  const authDispatchContext = useContext(
    AuthDispatchContext
  );
  const { logoutDispatch } = authDispatchContext;

  const logoutHandler = () => {
    logoutDispatch();
    window.location.href = "/login";
  };

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="/">ChatApp</Navbar.Brand>
      <Nav className="mr-auto">
      </Nav>
      <Form className="mr-3" inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      </Form>

    </Navbar>
  );
};

export default AppNavbar;
