import React from 'react';
import './ServicesPage.scss';
import { serviceItems } from '../../constants/services';

const SimpleCard = (props) => {
  return (
    <div className={`card-container ${props.imagePosition}`}>
      <div className="card-image">
        <img
          src={props.card.image || 'images/main_logo.jpg'}
          alt={props.card.title}
        />
      </div>
      <div className="card-content">
        <h4>{props.card.title}</h4>
        <p>{props.card.description}</p>
      </div>
    </div>
  );
};

export const ServicesPage = () => {
  return (
    <div className="container my-3">
      {serviceItems.map((card, index) => (
        <SimpleCard
          imagePosition={index % 2 === 0 ? 'left' : 'right'}
          card={card}
          key={index}
        />
      ))}
    </div>
  );
};
