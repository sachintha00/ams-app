import { jsonToCsv } from '@/app/_lib/utils/jsonToCsv';
import { jsonToPdf } from '@/app/_lib/utils/jsonToPdf';
import React from 'react';
import { FaFilePdf } from "react-icons/fa6";

const DownloadButtons = ({ data }) => {
  const handleDownload = async () => {
    // CSV download
    // const csvData = jsonToCsv(data);
    // const csvBlob = new Blob([csvData], { type: 'text/csv' });
    // const csvUrl = URL.createObjectURL(csvBlob);
    // const csvLink = document.createElement('a');
    // csvLink.href = csvUrl;
    // csvLink.download = 'data.csv';
    // csvLink.click();

    // PDF download
    const pdfDoc = await jsonToPdf(data);
    pdfDoc.save('requisitions_data.pdf');
  };

  return (
    <button onClick={handleDownload} className="p-2 bg-blue-500 text-white rounded">
      <FaFilePdf className='text-white'/>
    </button>
  );
};

export default DownloadButtons;