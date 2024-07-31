import logo from './logo.svg';
import './App.css';
import Webcam from 'react-webcam';
import React, { useState, useRef, useCallback, useEffect } from 'react';

const App = () => {
  const handleConfirm = (imageSrc) => {
    console.log('Confirmed image:', imageSrc);
    // Do something with the image
  };

  return (
    <BluevoirCamera 
      onConfirm={handleConfirm}
      overlayOptions={{ display: true, color: 'rgba(0,0,0,0.5)' }}
    />
  );
};

export default App;


const BluevoirCamera = ({ onConfirm, overlayOptions = { display: true, color: 'rgba(0,0,0,0.5)' } }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      alert('Image is copied successfully to clipboard');
      // Assuming you're using this in a Pega environment
      // pega.api.ui.actions.setValue('pyWorkPage.pyTempText', capturedImage, false);
      if (onConfirm) {
        onConfirm(capturedImage);
      }
    }
  };

  const handleUserMediaError = useCallback(() => {
    setCameraError(true);
  }, []);

  useEffect(() => {
    return () => {
      if (webcamRef.current && webcamRef.current.stream) {
        const tracks = webcamRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  if (cameraError) {
    return (
      <div id="bluevoir-permission-denied-container">
        <p>Camera access denied.</p>
        <p>To enable camera access, please go to your browser settings and allow camera access for this site.</p>
      </div>
    );
  }

  return (
    <div id="bluevoir-parent-camera-container">
      {!capturedImage ? (
        <div id="bluevoir-camera-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            onUserMediaError={handleUserMediaError}
          />
          {overlayOptions.display && (
            <div 
              id="bluevoir-video-box" />
          )}
          <div id="bluevoir-capture-container">
            <button id="bluevoir-capture-btn" onClick={capture}></button>
            <span>Capture</span>
          </div>
        </div>
      ) : (
        <div id="bluevoir-captured-image-container">
          <img id="bluevoir-captured-image" src={capturedImage} alt="Captured" />
          <div id="bluevoir-retake-container">
            <button id="bluevoir-retake-btn" onClick={retake}></button>
            <span>Retake</span>
          </div>
          <div id="bluevoir-confirm-container">
            <button id="bluevoir-confirm-btn" onClick={handleConfirm}></button>
            <span>Confirm</span>
          </div>
        </div>
      )}
    </div>
  );
};
