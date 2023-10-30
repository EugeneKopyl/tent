import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

export const ErrorPage = () => {
  return (
    <div>
      <h1>Ошибка:</h1>
      <p>Запрашиваемой страницы не найдено</p>
      <Nav.Link as={Link} to="/">
        --- Вернуться домой ---
      </Nav.Link>
    </div>
  );
};
