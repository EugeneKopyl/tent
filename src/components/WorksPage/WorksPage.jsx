import './WorksPage.scss';
import React, { useState, useEffect } from 'react';
import { galleryItems } from '../../constants/works';

export const WorksPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fade, setFade] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (item, index) => {
    setSelectedImage(item);
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
        setSelectedImage(galleryItems[updatedIndex]);
      }, 250);
      setCurrentIndex(updatedIndex);
      setFade(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < galleryItems.length - 1) {
      const updatedIndex = currentIndex + 1;
      setTimeout(() => {
        setSelectedImage(galleryItems[updatedIndex]);
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
  const isLastImage = currentIndex === galleryItems.length - 1;

  return (
    <section className="gallery container pt-4">
      <div className="row">
        {galleryItems.map((item, index) => (
          <div key={index} className="col-md-4 col-lg-3 my-3">
            <article className="gallery-item-container">
              <figure>
                <img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid gallery-image"
                  onClick={() => handleClick(item, index)}
                />
                {/*<figcaption>{item.title}</figcaption>*/}
              </figure>
            </article>
          </div>
        ))}
      </div>

      {selectedImage && (
        <aside className="overlay">
          <div className="image-container">
            <figure>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className={`img-fluid ${fade ? 'fade-out' : ''}`}
              />
              {/*<figcaption>{selectedImage.title}</figcaption>*/}
            </figure>
            {!isFirstImage && (
              <button
                className="gallery-button prev-button"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            {!isLastImage && (
              <button
                className="gallery-button next-button"
                onClick={handleNext}
                aria-label="Next image"
              >
                ›
              </button>
            )}
            <button
              className="close-button"
              onClick={handleClose}
              aria-label="Close image view"
            >
              ×
            </button>
          </div>
        </aside>
      )}
    </section>
  );
};
