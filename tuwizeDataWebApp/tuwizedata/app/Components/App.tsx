'use client'
import React from 'react';

interface DownloadButtonProps {
  downloadUrl: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ downloadUrl }) => {
  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'TuwizeData.apk'; // Specify the desired filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownloadClick} >
      Download TuwizeData App
    </button>
  );
};

const App: React.FC = () => {
  const downloadUrl = 'https://github.com/Sun3350/TuwizeData/raw/main/TuwizeData.apk'; 

  return (
    <div className='container'>
      <div className='div-container'>
      <h1>Welcome to TuwizeData</h1>
      <p>For a Better use and a great experience with a smooth transaction Kindly Download The TuwizeData App Only for andriod User</p>
      </div>
      
      <DownloadButton downloadUrl={downloadUrl} />
    </div>
  );
};

export default App;
