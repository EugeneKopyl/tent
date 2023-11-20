import React, { useState, useEffect } from 'react';
import { galleryItems } from '../../constants/works';

const RandomImageGallery = () => {
  const [currentImage, setCurrentImage] = useState(galleryItems[0].image);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * galleryItems.length);
    setCurrentImage(galleryItems[randomIndex].image);
  };

  useEffect(() => {
    const intervalId = setInterval(getRandomImage, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <img
      src={currentImage}
      alt="Галерея работ"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

export default RandomImageGallery;
