import React, { useState } from 'react'
import { Nav, NavItem, NavLink, Navbar, NavbarToggler, Collapse, Button } from 'reactstrap'

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
                        <NavLink href='/play'>Play</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href='/scores'>Scores</NavLink>
                    </NavItem>
                </Nav>
                <Nav className='ms-auto' navbar>
                    <NavItem>
                        <NavLink href='/myprofile'>My Profile</NavLink>
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
