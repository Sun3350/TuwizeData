'use client'
import React from 'react';

const DownloadButton = ({ downloadUrl }) => {
  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'TuwizeData.apk'; // Specify the desired filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownloadClick}>
      Download TuwizeData App
    </button>
  );
};

const App = () => {
  const downloadUrl = 'https://expo.dev/artifacts/eas/tNP9AycPCUuCWb4VjiMRvZ.apk'; // Replace with your app's actual download URL

  return (
    <div className='container'>
      <h1>Welcome to TuwizeData</h1>
      <DownloadButton downloadUrl={downloadUrl} />
    </div>
  );
};

export default App;
