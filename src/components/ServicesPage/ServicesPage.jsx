import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { serviceItems } from '../../constants/services';

const SimpleCard = (props) => {
  return (
    <Row>
      <Col className="my-3">
        <Card
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            maxHeight: '200px',
          }}
        >
          <Card.Img
            variant={props.imagePosition || 'top'}
            style={{
              order:
                props.imagePosition === 'top' || props.imagePosition === 'left'
                  ? '0'
                  : '1',
            }}
            src={'images/main_logo.jpg'}
          />
          <Card.Body>
            <Card.Title>{props.card.title}</Card.Title>
            <Card.Text>{props.card.description}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
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
        ></SimpleCard>
      ))}
    </div>
  );
};
