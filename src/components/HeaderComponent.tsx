import React, { useState } from "react";
import {
  Nav,
  NavItem,
  Navbar,
  NavbarToggler,
  Collapse,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { URL } from "../shared/utils";

export default function HeaderComponent() {
  //nav properties
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  //login modal properties
  const [loginModal, setLoginModal] = useState(false);
  const toggleLoginModal = () => setLoginModal(!loginModal);

  //create account properties
  const [createAccountModal, setCreateAccountModal] = useState(false);
  const [createUser, setCreateUser] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const toggleCreateAccountModal = () =>
    setCreateAccountModal(!createAccountModal);
  const toggleCreateAccount = () => {
    toggleLoginModal();
    toggleCreateAccountModal();
  };
  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(URL + "users", {
      method: "POST",
      body: JSON.stringify({
        username: createUser,
        password: createPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => {
        if (res.ok) return res;
        else {
          let err = new Error("Error " + res.status + ":" + res.statusText);
          throw err;
        }
      })
      .then((res) => res.json())
      .then((data) => alert("Success\n" + data))
      .catch((err) => {
        alert("Error" + err.message);
      });

    //close create account modal
    toggleCreateAccountModal();
  };

  return (
    <div>
      <Navbar expand="md">
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink className="nav-link" to="/play">
                Play
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/scores">
                Scores
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NavLink className="nav-link" to="/myprofile">
                My Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <Button outline onClick={toggleLoginModal}>
                Log in
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

      <Modal isOpen={loginModal} toggle={toggleLoginModal}>
        <ModalHeader toggle={toggleLoginModal}>Login</ModalHeader>
        <ModalBody>
          <form>
            <FormGroup>
              <Label for="_username">Username</Label>
              <Input id="_username" name="username" type="text" />
            </FormGroup>
            <FormGroup>
              <Label for="_password">Password</Label>
              <Input id="_password" name="password" type="password" />
            </FormGroup>
            <div className="d-flex justify-content-center">
              <Button
                className="me-1"
                color="primary"
                type="submit"
                onSubmit={(e) => e.preventDefault()}
              >
                Login
              </Button>
              <Button onClick={toggleCreateAccount}>Create Account</Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <Modal isOpen={createAccountModal} toggle={toggleCreateAccountModal}>
        <ModalHeader toggle={toggleCreateAccountModal}>
          Create Account
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleCreateSubmit}>
            <FormGroup>
              <Label for="__username">Username</Label>
              <Input
                id="__username"
                name="newUsername"
                type="text"
                value={createUser}
                onChange={(e) => setCreateUser(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="__password">Password</Label>
              <Input
                id="__password"
                name="newPassword"
                type="password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
              />
            </FormGroup>
            <Button
              className="d-flex my-0 mx-auto"
              color="primary"
              type="submit"
            >
              Create Account
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
