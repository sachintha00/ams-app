import { useGetprofileimageMutation } from '@/app/_lib/redux/features/filehandle/filehandle_api';
import React, { useState, useEffect } from 'react';

const UserProfileImage = ({ user }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [getprofileimage] = useGetprofileimageMutation(); 
  const imagename = user.profie_image;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await getprofileimage(imagename).unwrap();
        const blob = new Blob([response]);
        const url = URL.createObjectURL(blob);
        console.log(url);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    if (imagename) {
      fetchImage();
    }
  }, [imagename, getprofileimage]);

  return (
    <>
        {user.profie_image ? (
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={imageUrl}
            alt={`${user.name} profile`}
          />
        ) : (
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="/avater.png"
            alt="Bonnie image"
          />
        )}
    </>
  );
};

export default UserProfileImage;