import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, TextField, Box, Divider, CircularProgress, Dialog } from '@mui/material';
import ImageUploader from './ImageUploader';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = "https://70.26.177.149:40907";  // 기본 API URL 설정

function App() {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [translatedText, setTranslatedText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [showUploader, setShowUploader] = useState(true);
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const initializeSession = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    return newSessionId;
  };

  const handleUpload = async (files) => {
    const currentSessionId = initializeSession();
    
    const fileArray = Array.from(files);
    setImages(fileArray);
    setPreviewUrls(fileArray.map((file) => URL.createObjectURL(file)));
    setLoading(true);

    try {
      await Promise.allSettled(
        fileArray.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image);

          await axios.post(`${API_BASE_URL}/upload/${userId}/${currentSessionId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        })
      );
      setLoading(false);
      setShowUploader(false);
    } catch (error) {
      console.error('Error uploading images:', error.response ? error.response.data : error.message);
      alert('Image upload failed. Please try again.');
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/process/${userId}/${sessionId}`);
      setTranslatedText(response.data.translations);
    } catch (error) {
      console.error('Error translating images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImages = async () => {
    setGenerationLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/generate-images/${userId}/${sessionId}`, {
        translations: translatedText,
      });
      setDownloadDialog(true);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleDownload = () => {
    window.location.href = `${API_BASE_URL}/download/${userId}/${sessionId}`;
  };

  const handleTranslationChange = (index, value) => {
    const updatedText = [...translatedText];
    updatedText[index] = value;
    setTranslatedText(updatedText);
  };

  return (
    <Container>
      {}
      <header style={{
        position: 'fixed',
        top: 10,
        left: 0,
        width: '100%',
        padding: '10px 20px',
        backgroundColor: '#fff',
        zIndex: 1000,
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h4" gutterBottom>
          Translated Cartoon Generater
        </Typography>
      </header>

      {/* 제목 아래에 컨텐츠 배치 */}
      <Box mt={10} pt={4}>
        {showUploader ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
            {loading ? (
              <CircularProgress />
            ) : (
              <ImageUploader onUpload={handleUpload} />
            )}
          </Box>
        ) : (
          <Box display="flex" mt={4} mb={4} minHeight="80vh" position="relative">
            <Box flex={1} pr={2} overflow="auto">
              <Typography variant="h5" gutterBottom>
                Image Preview
              </Typography>
              <Grid container spacing={2}>
                {previewUrls.map((url, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <img src={url} alt={`Preview ${index + 1}`} style={{ width: '100%', borderRadius: '8px' }} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider orientation="vertical" flexItem style={{ margin: '20px 0', position: 'relative' }} />

            <Box flex={1} pl={2} overflow="auto">
              <Typography variant="h5" gutterBottom>
                Translate & Generate
              </Typography>
              {translatedText.length > 0 && (
                <div>
                  {translatedText.map((text, index) => (
                    <TextField
                      key={index}
                      label={`Page ${index + 1} Translation`}
                      multiline
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={text}
                      onChange={(e) => handleTranslationChange(index, e.target.value)}
                    />
                  ))}
                </div>
              )}
            </Box>

            <Box position="fixed" bottom={20} right={20} display="flex" gap="16px">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleTranslate}
                disabled={loading || !images.length}
              >
                {loading ? <CircularProgress size={24} /> : 'Translate'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateImages}
                disabled={generationLoading || !translatedText.length}
              >
                {generationLoading ? <CircularProgress size={24} /> : 'Generate Images'}
              </Button>
            </Box>

            <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)}>
              <Container style={{ padding: '20px', textAlign: 'center' }}> {/* Center-align text */}
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
        )}
      </Box>
    </Container>
  );
}

export default App;