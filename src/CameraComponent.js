import React, { useState, useRef, useEffect } from 'react';
import './CameraComponent.css';

const CameraComponent = ({ onConfirm }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const overlayColor = 'rgba(0,0,0,0.5)';

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setPermissionDenied(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const retakePicture = (e) => {
    e.preventDefault();
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (capturedImage) {
      alert('Image copied successfully to clipboard');
      if (onConfirm) {
        onConfirm(capturedImage);
      }
    }
  };

  return (
    <div id="bluevoir-parent-camera-container">
      {permissionDenied ? (
        <section id="bluevoir-permission-denied-container">
          <p>Camera access denied.</p>
          <p>To enable camera access, please go to your browser settings and allow camera access for this site.</p>
        </section>
      ) : (
        <>
          {capturedImage ? (
            <section id="bluevoir-captured-image-container" style={{ textAlign: 'center' }}>
              <img id="bluevoir-captured-image" src={capturedImage} alt="Captured" />
              <div id="bluevoir-retake-container">
                <button id="bluevoir-retake-btn" onClick={retakePicture}></button>
                <span>Retake</span>
              </div>
              <div id="bluevoir-confirm-container">
                <button id="bluevoir-confirm-btn" onClick={handleConfirm}></button>
                <span>Confirm</span>
              </div>
            </section>
          ) : (
            <section id="bluevoir-camera-container">
              <video ref={videoRef} id="bluevoir-video" autoPlay playsInline></video>
              <div id="bluevoir-video-box" style={{ boxShadow: `0 0 0 1000px ${overlayColor}` }}></div>
              <div id="bluevoir-capture-container">
                <button id="bluevoir-capture-btn" onClick={captureImage}></button>
                <span>Capture</span>
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CameraComponent;
