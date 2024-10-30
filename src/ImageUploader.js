import React from 'react';
import { Button, Typography } from '@mui/material';

function ImageUploader({ onUpload }) {
  const handleFileChange = (event) => {
    onUpload(event.target.files);
  };

  return (
    <>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Choose Images to Start
      </Typography>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="upload-button"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <label htmlFor="upload-button">
        <Button variant="contained" color="primary" component="span" style={{ padding: '12px 24px', fontSize: '1.2rem' }}>
          Choose Files
        </Button>
      </label>
    </>
  );
}

export default ImageUploader;