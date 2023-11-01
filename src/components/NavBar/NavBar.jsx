import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar fixed="top" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img
            src={'images/main_logo.jpg'}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Main logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Главная
            </Nav.Link>
            <Nav.Link as={NavLink} to="/services">
              Услуги
            </Nav.Link>
            <Nav.Link as={NavLink} to="/parts">
              Запчасти
            </Nav.Link>
            <Nav.Link as={NavLink} to="/works">
              Наши работы
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              О нас
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contacts">
              Контакты
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
