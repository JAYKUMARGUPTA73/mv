import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Dropdown } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import ProfilePage from "./ProfileSection";

function Navcomp({ userId, profileUrl, role }) {
  const [uid, setUid] = useState(userId);
  const [isLoggedInCookie, setIsLoggedInCookie] = useState(false);

  useEffect(() => {
    const checkCookies = () => {
      const cookies = document.cookie;
      // console.log(cookies);

      // Example: Check for a cookie named "Login"
      if (!cookies.includes("Login")) {
        // Cookie not present, handle accordingly (prevent fetching user profile)
        console.error("Cookies are not present");
        setIsLoggedInCookie(false);
        return;
      } else {
        setIsLoggedInCookie(true);
        // console.log("Cookies found");
      }

      // Assuming 'userId' is a prop passed to the component
      if (userId) {
        setUid(userId);
      }
    };

    // Call the function to check cookies when userId changes
    checkCookies();
  }, [userId]);

  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          MovieVerse
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              {role === "admin" ? "AdminDashboard" : "Home"}
            </Nav.Link>
            {role === "admin" ? (
              <Nav.Link as={Link} to="/addmovies">
                Addmovies
              </Nav.Link>
            ) : (
              ""
            )}
            <Nav.Link as={Link} to="/movies">
              Movies
            </Nav.Link>
            {role === "admin" ? (
              <Nav.Link as={Link} to="/adminfeedback">
                Feedback
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/userfeedback">
                Feedback
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/aboutus">
              About_us
            </Nav.Link>
          </Nav>
          <Nav>
            {!isLoggedInCookie && (
              <>
                <Nav.Link as={Link} to="/signin">
                  Signin
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {isLoggedInCookie && profileUrl && uid &&(
              <Dropdown align="end" className="profile-dropdown">
                <Dropdown.Toggle variant="link" id="profile-dropdown-toggle">
                  <img
                    src={profileUrl}
                    alt="Profile"
                    className="profile-icon"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/${uid}`}
                    className="profile-link"
                  >
                    <ProfilePage userId={userId} />
                  </Dropdown.Item>
                  {/* Add more Dropdown.Items for additional options if needed */}
                </Dropdown.Menu>
              </Dropdown>
            )}
            {/* {isLoggedInCookie && (
              <Nav.Link as={Link} to="/logout">
                Logout
              </Nav.Link>
            )} */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navcomp;
