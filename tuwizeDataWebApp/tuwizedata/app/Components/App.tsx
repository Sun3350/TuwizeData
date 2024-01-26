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
    <button onClick={handleDownloadClick}>
      Download TuwizeData App
    </button>
  );
};

const App: React.FC = () => {
  const downloadUrl = 'https://github.com/Sun3350/TuwizeData/raw/1e785a3120461e89410c39384bd3886658326705/TuwizeData.apk'; // Replace with your app's actual download URL

  return (
    <div className='container'>
      <h1>Welcome to TuwizeData</h1>
      <DownloadButton downloadUrl={downloadUrl} />
    </div>
  );
};

export default App;
