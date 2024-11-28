import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Box, CircularProgress, Dialog } from '@mui/material';
import ImageUploader from './ImageUploader';

function App() {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [showUploader, setShowUploader] = useState(true);

  const handleUpload = async (files) => {
    const fileArray = Array.from(files);
    setImages(fileArray);
    setPreviewUrls(fileArray.map((file) => URL.createObjectURL(file)));
    setShowUploader(false);
  };

  const handleGenerateImages = async () => {
    setLoading(true);

    // Simulate a 200-second delay
    await new Promise((resolve) => setTimeout(resolve, 200000));

    setLoading(false);
    setDownloadDialog(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/results.zip';
    link.download = 'results.zip';
    link.click();
  };

  return (
    <Container>
      <header
        style={{
          position: 'fixed',
          top: 10,
          left: 0,
          width: '100%',
          padding: '10px 20px',
          backgroundColor: '#fff',
          zIndex: 1000,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Translated Cartoon Generator
        </Typography>
      </header>

      <Box mt={10} pt={4}>
        {showUploader ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
            <ImageUploader onUpload={handleUpload} />
          </Box>
        ) : (
          <Box display="flex" mt={4} mb={4} flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
            <Typography variant="h5" gutterBottom>
              Image Preview
            </Typography>
            <Grid container spacing={2} style={{ maxWidth: '80%' }}>
              {previewUrls.map((url, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <img src={url} alt={`Preview ${index + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
              ))}
            </Grid>

            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateImages}
                disabled={loading || !images.length}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate'}
              </Button>
            </Box>
          </Box>
        )}

        <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)}>
          <Container style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Images generated successfully!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              style={{ marginTop: '20px' }}
            >
              Download Images
            </Button>
          </Container>
        </Dialog>
      </Box>
    </Container>
  );
}

export default App;