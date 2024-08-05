
import { useGetprofileimageMutation } from '@/app/_lib/redux/features/filehandle/filehandle_api';
import React, { useState, useEffect } from 'react';

const ProfileImage = ({ image, name, size }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [getprofileimage] = useGetprofileimageMutation();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch the image as a Blob
        const response = await getprofileimage({ imagename: image }).unwrap();
        
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
  }, [image, getprofileimage]);

  return (
    <>
      {imageUrl ? (
        <img className={`${size} rounded-full shadow-lg`} src={imageUrl} alt={name} />
      ) : (
        <img className={`${size} rounded-full shadow-lg`} src="/avater.png" alt={name}  />
      )}
    </>
  );
};

export default ProfileImage;