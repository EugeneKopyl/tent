import React from 'react';
import './ServicesPage.scss';
import { serviceItems } from '../../constants/services';

const SimpleCard = ({ card: { image, title, description }, imagePosition }) => {
  return (
    <article className={`card-container text-center ${imagePosition}`}>
      <figure className="card-image">
        <img
          src={image || 'images/main_logo.jpg'}
          alt={title}
          width="100%"
          height="auto"
        />
        {/*<figcaption>{title}</figcaption>*/}
      </figure>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
};

export const ServicesPage = () => {
  return (
    <main className="container my-3 pt-4">
      <h1>Наши услуги</h1>
      <section>
        {serviceItems.map((card, index) => (
          <SimpleCard
            imagePosition={index % 2 === 0 ? 'left' : 'right'}
            card={card}
            key={card.id || index}
          />
        ))}
      </section>
    </main>
  );
};
