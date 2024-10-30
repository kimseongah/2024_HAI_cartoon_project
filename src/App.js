import React, { useState } from 'react';
import { Container, Typography, Button, Grid, TextField, Box, Divider, CircularProgress, Dialog } from '@mui/material';
import ImageUploader from './ImageUploader';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [translatedText, setTranslatedText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [showUploader, setShowUploader] = useState(true);

  const handleUpload = (files) => {
    const fileArray = Array.from(files);
    setImages(fileArray);
    setPreviewUrls(fileArray.map((file) => URL.createObjectURL(file)));
    setShowUploader(false); // 이미지 선택 후 다음 화면으로 넘어감
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append('images', image));
      const response = await axios.post('/api/translate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setTranslatedText(response.data.translations); // 서버에서 번역된 결과 가져오기
    } catch (error) {
      console.error('Error translating images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImages = async () => {
    setGenerationLoading(true);
    try {
      const response = await axios.post('/api/generate-images', { translations: translatedText });
      setDownloadDialog(true); // 이미지 생성 완료 후 다운로드 팝업 표시
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleTranslationChange = (index, value) => {
    const updatedText = [...translatedText];
    updatedText[index] = value;
    setTranslatedText(updatedText);
  };

  return (
    <Container>
      {showUploader ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <Typography variant="h4" gutterBottom>
            Image Processing Application
          </Typography>
          <ImageUploader onUpload={handleUpload} />
        </Box>
      ) : (
        <Box display="flex" mt={4} mb={4} minHeight="80vh" position="relative">
          {/* 이미지 미리보기 영역 */}
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

          {/* 중앙 구분선 */}
          <Divider orientation="vertical" flexItem style={{ margin: '20px 0', position: 'relative' }} />

          {/* 번역 및 이미지 생성 영역 */}
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

          {/* 번역 및 생성 버튼 - 화면 오른쪽 아래 고정 */}
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

          {/* 다운로드 팝업 */}
          <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)}>
            <Container style={{ padding: '20px' }}>
              <Typography variant="h6">Images generated successfully!</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDownloadDialog(false)}
                style={{ marginTop: '20px' }}
              >
                Download Images
              </Button>
            </Container>
          </Dialog>
        </Box>
      )}
    </Container>
  );
}

export default App;