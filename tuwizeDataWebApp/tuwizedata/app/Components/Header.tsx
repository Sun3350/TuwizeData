import Image from 'next/image';
import TuwizeData from '../../public/TuwizeData.png'
import React from 'react'
const Header = () => {
  return (
    <div className="header-container">
     <Image src={TuwizeData} alt='' className='image' />
      <h5>Buy Data</h5>
    </div>
  );
};

export default Header;
