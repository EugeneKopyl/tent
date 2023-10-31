import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar fixed="top" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={'main_logo.jpg'}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Main logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Главная
            </Nav.Link>
            <Nav.Link as={Link} to="/services">
              Услуги
            </Nav.Link>
            <Nav.Link as={Link} to="/parts">
              Запчасти
            </Nav.Link>
            <Nav.Link as={Link} to="/works">
              Наши работы
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              О нас
            </Nav.Link>
            <Nav.Link as={Link} to="/contacts">
              Контакты
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
