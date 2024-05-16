import { FaStar } from "react-icons/fa";

export const jsonToPdf = async (obj) => {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();
  let currentY = 10; // Initial vertical position
  const lineHeight = 10; // Line height
  const pageHeight = doc.internal.pageSize.height;

  const addText = (key, value, level = 0) => {
    const indent = '  '.repeat(level);
    const icon = '\u2022'; // Bullet point icon

    const addLine = (text) => {
      if (currentY + lineHeight > pageHeight - 10) { // Check if we need a new page
        doc.addPage();
        currentY = 10;
      }
      doc.text(text, 10, currentY);
      currentY += lineHeight;
    };

    if (Array.isArray(value)) {
      addLine(`${indent}${icon} ${key}:`);
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          addLine(`${indent}  - Item ${index + 1}:`);
          Object.entries(item).forEach(([k, v]) => {
            addText(k, v, level + 1);
          });
        } else {
          addLine(`${indent}  - ${item}`);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      addLine(`${indent}${icon} ${key}:`);
      Object.entries(value).forEach(([k, v]) => {
        addText(k, v, level + 1);
      });
    } else {
      addLine(`${indent}${icon} ${key}: ${value}`);
    }
  };

  Object.entries(obj).forEach(([key, value]) => {
    addText(key, value);
  });

  return doc;
};