import React from 'react';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadImage from './components/UploadImage';
import ImageGallery from './components/ImageGallery';

function App() {
  return (
    <ChakraProvider>
      <Container maxW="xl" centerContent>
        <Router>
          <Routes>
            <Route path="/upload" element={<UploadImage />} />
            <Route path="/" element={<ImageGallery />} />
          </Routes>
        </Router>
      </Container>
    </ChakraProvider>
  );
}

export default App;
