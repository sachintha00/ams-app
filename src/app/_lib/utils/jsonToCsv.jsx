export const jsonToCsv = (obj) => {
  const items = obj.Items || [];
  const keys = Object.keys(items[0] || {});

  const header = keys.join(',');
  const rows = items.map(item => keys.map(key => `"${item[key] || ''}"`).join(','));

  return [header, ...rows].join('\n');
};