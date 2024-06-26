import React from "react";
import StudentNavbar from "./StudentNavbar";
import "./styles/About.css";
import "./styles/StudentDashboard.css";
import { Container, Row, Col, Card } from "react-bootstrap";

const Content = () => {
  return (
    <Container className="issues-section">
      <Row>
        <Col>
          <Card className="about-card">
            <Card.Body>
              <Card.Title>About Us</Card.Title>
              <Card.Text>
                Welcome to our Student Dashboard! This website is designed to
                make it easier for students to identify the causes of the issues
                they are facing and find solutions quickly and efficiently.
              </Card.Text>
              <Card.Text>
                Our goal is to provide a platform where students can:
                <ul>
                  <li>Identify and understand their problems clearly.</li>
                  <li>Receive tailored solutions and advice.</li>
                  <li>
                    Improve their academic and personal life by addressing
                    issues effectively.
                  </li>
                </ul>
              </Card.Text>
              <Card.Text>
                We hope that our tool helps you in your journey towards success.
                Happy learning!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const About = () => {
  return (
    <div className="main">
      <StudentNavbar activeLink="About" />
      <Content />
    </div>
  );
};

export default About;
