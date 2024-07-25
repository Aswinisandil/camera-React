// src/App.js

import React from 'react';
import CameraComponent from './CameraComponent';
import './App.css';

const App = () => {
  const handleConfirm = (imageData) => {
    console.log('Image confirmed:', imageData);
  };

  return (
    <div className="App">
      <h1>Bluevoir Camera Component</h1>
      <CameraComponent onConfirm={handleConfirm} />
    </div>
  );
};

export default App;

