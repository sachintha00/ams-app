import { useGetthumbnailimageMutation } from '@/app/_lib/redux/features/filehandle/filehandle_api';
import React, { useState, useEffect } from 'react';

const ThumbnailMainImageOnViewPage = ({ image, name, isTransitioning }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [getthumbnailimage] = useGetthumbnailimageMutation();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch the image as a Blob
        const response = await getthumbnailimage({ imagename: image }).unwrap();
        
        // Convert the Blob to an object URL
        const url = URL.createObjectURL(response);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    if (image) {
      fetchImage();
    }
  }, [image, getthumbnailimage]);

  return (
    <>
      {imageUrl ? (
        <img 
        className={`h-[100%] w-[100%] mx-auto rounded-lg shadow-lg border border-gray-200 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        src={imageUrl} alt={name}/>
      ) : (
        <img className="h-[100%] w-[100%] mx-auto rounded-lg shadow-lg border border-gray-200 transition-opacity duration-300 ease-in-out" src="/laptopavater.png" alt="Default Avatar" />
      )}
    </>
  );
};

export default ThumbnailMainImageOnViewPage;