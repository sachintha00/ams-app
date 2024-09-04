import { useGetthumbnailimageMutation } from '@/app/_lib/redux/features/filehandle/filehandle_api';
import React, { useState, useEffect } from 'react';

const ThumbnailImageOnViewPage = ({ image, name, onClick, selectedImage }) => {
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
        <img className={`w-24 h-auto cursor-pointer rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 ${selectedImage === image ? 'ring-4 ring-blue-400' : 'ring-1 ring-gray-300'}`} src={imageUrl} alt={name} onClick={() => onClick(image)}/>
      ) : (
        <img className="w-24 h-auto cursor-pointer rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 ring-1 ring-gray-300" src="/laptopavater.png" alt="Default Avatar" />
      )}
    </>
  );
};

export default ThumbnailImageOnViewPage;