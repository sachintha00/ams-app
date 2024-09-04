
import { useGetthumbnailimageMutation } from '@/app/_lib/redux/features/filehandle/filehandle_api';
import React, { useState, useEffect } from 'react';

const ThumbnailImage = ({ image, name }) => {
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
        <img className="rounded" src={imageUrl} alt={name} />
      ) : (
        <img className="rounded" src="/laptopavater.png" alt="Default Avatar" />
      )}
    </>
  );
};

export default ThumbnailImage;