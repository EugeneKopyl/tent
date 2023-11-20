import React from 'react';
import './HomePage.scss';
import RandomImageGallery from '../RandomImageGallery/RandomImageGallery';

export const HomePage = () => {
  return (
    <div className="home-page">
      <header className="home-banner"></header>

      <div className="container py-4">
        <h1>Добро пожаловать в нашу компанию!</h1>
        <p>
          Мы специализируемся на ремонте и производстве тентов и каркасов для
          автомобилей и прицепов.
        </p>

        <div className="content-wrapper">
          <main className="main-content">
            <p>
              Наши услуги включают создание и ремонт тентов для автомобилей и
              прицепов, работу с каркасами и сдвижными крышами, а также продажу
              запчастей и ремонт ворот для прицепов.
            </p>
          </main>
          <div className="sidebar">
            <RandomImageGallery />
          </div>
        </div>
      </div>
    </div>
  );
};
