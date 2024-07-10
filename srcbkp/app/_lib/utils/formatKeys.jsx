export const formatKeys = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => formatKeys(item));
  }

  if (typeof data === 'object' && data !== null) {
    const formattedData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const formattedKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
        formattedData[formattedKey] = formatKeys(data[key]);
      }
    }
    return formattedData;
  }

  return data;
};