import React from 'react';
import './header.styles.css';
const Header = ({ region }) => {
  return (
    <div className='headerWrapper'>
      <h1 className='headerWrapper__header'>
        Today, we're going to find out which species are critically endangered in:{' '}
        <span className='headerWrapper__header--span'>{region.name}</span>
      </h1>
    </div>
  );
};

export default Header;
