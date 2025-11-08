import React from 'react';

const MyProducts = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#4CAF50', fontSize: '2.5rem' }}>✅ SUCCESS! ✅</h1>
      <h2>My Products Page is Working!</h2>
      <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
        This is the My Products page.
      </p>
    </div>
  );
};

export default MyProducts;
