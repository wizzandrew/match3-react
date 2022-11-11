import React, { useState } from 'react'
import { Nav, NavItem, Navbar, NavbarToggler, Collapse, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom'

export default function HeaderComponent() {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);  

  return (
    <div>
        <Navbar expand="md">
            <NavbarToggler onClick={toggle}/>
            <Collapse isOpen={isOpen} navbar>
                <Nav className='me-auto' navbar>
                    <NavItem>
                        <NavLink className="nav-link" to="/play">Play</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="nav-link" to="/scores">Scores</NavLink>
                    </NavItem>
                </Nav>
                <Nav className='ms-auto' navbar>
                    <NavItem>
                        <NavLink className="nav-link" to="/myprofile">My Profile</NavLink>
                    </NavItem>
                    <NavItem>
                        <Button outline>Log in</Button>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    </div>
  )
}
