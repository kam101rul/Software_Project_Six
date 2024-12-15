// filepath: /d:/Development/projects/dragon-news/dragon-client/src/Pages/Shared/Header/Header.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Image, Container } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../../contexts/AuthProvider/AuthProvider";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const handleDownload = async () => {
    try {
      const response = await fetch("http://localhost:5000/download", {
        method: "GET",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf"; // Name the downloaded file
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up URL object
      } else {
        console.error("Failed to download file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="header">
      <Container>
        <Navbar.Brand as={Link} to="/" className="header-title">
          Daily News
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">
            International
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            Geography
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            National
          </Nav.Link>
          <Nav.Link as={Link} to="/">
            Subcription
          </Nav.Link>
        </Nav>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {user?.uid ? (
              <>
                <Nav.Item className="d-flex align-items-center">
                  <span className="text-white mr-2">{user?.displayName}</span>
                  <Button variant="light" onClick={() => logOut()}>
                    Log Out
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="/profile">
              {user?.photoURL ? (
                <Image
                  style={{ height: "30px" }}
                  roundedCircle
                  src={user?.photoURL}
                />
              ) : (
                <FaUser className="text-white" />
              )}
            </Nav.Link>
            <Button variant="outline-light" onClick={handleDownload}>
              Download
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
