import React from 'react';
import { Col, Row, Card } from 'react-bootstrap';

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
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export const ServicesPage = () => {
  return (
    <div className="container">
      <SimpleCard imagePosition="left"></SimpleCard>
      <SimpleCard imagePosition="right"></SimpleCard>
    </div>
  );
};
