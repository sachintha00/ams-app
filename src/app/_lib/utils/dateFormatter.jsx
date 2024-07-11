export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
  });

  if (dateString.includes('T') || dateString.includes(' ')) {
      const formattedTime = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
      });
      return `${formattedDate} ${formattedTime}`;
  }

  return formattedDate;
};