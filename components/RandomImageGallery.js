import { useEffect, useState } from 'react';
import { galleryItems } from '@/constants/works';
import Image from 'next/image';

export default function RandomImageGallery() {
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
        <Image
            src={currentImage}
            alt="Галерея работ"
            width={300}
            height={300}
            style={{ maxWidth: '100%', height: 'auto' }}
        />
    );
}
