import './WorksPage.scss';
import React, { useState, useEffect } from 'react';

export const WorksPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fade, setFade] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    'images/gallery/1.jpg',
    'images/gallery/2.jpg',
    'images/gallery/3.jpg',
    'images/gallery/4.jpg',
    'images/gallery/5.jpg',
    'images/gallery/6.jpg',
    'images/gallery/7.jpg',
  ];

  const handleClick = (image, index) => {
    console.log(image);
    setSelectedImage(image);
    setCurrentIndex(index);
    setFade(true);
    setTimeout(() => {
      setFade(false);
    }, 250);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const updatedIndex = currentIndex - 1;
      setTimeout(() => {
        setSelectedImage(images[updatedIndex]);
      }, 250);
      setCurrentIndex(updatedIndex);
      setFade(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      const updatedIndex = currentIndex + 1;
      setTimeout(() => {
        setSelectedImage(images[updatedIndex]);
      }, 250);
      setCurrentIndex(updatedIndex);
      setFade(true);
    }
  };

  useEffect(() => {
    if (fade) {
      const timer = setTimeout(() => {
        setFade(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [fade]);

  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === images.length - 1;

  return (
    <div className="gallery container">
      <div className="row">
        {images.map((image, index) => (
          <div key={index} className="col-md-4 col-lg-3 my-3">
            <div className='gallery-item-container'>
              <img
                src={image}
                alt="img"
                className="img-fluid"
                onClick={() => handleClick(image, index)}
                style={{ objectFit: 'cover', aspectRatio: '1/1' }}
              ></img>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="overlay">
          <div className="image-container">
            <img
              src={selectedImage}
              alt="img"
              className={`img-fluid ${fade ? 'fade-out' : ''}`}
            ></img>
            {!isFirstImage && (
              <button
                className="btn btn-secondary prev-button"
                onClick={handlePrev}
              >
                {'<'}
              </button>
            )}
            {!isLastImage && (
              <button
                className="btn btn-secondary next-button"
                onClick={handleNext}
              >
                {'>'}
              </button>
            )}
            <button
              className="btn btn-secondary close-button"
              onClick={handleClose}
            >
              {'X'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
