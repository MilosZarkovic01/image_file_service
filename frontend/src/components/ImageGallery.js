import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Flex, Image, useToast } from '@chakra-ui/react';
import { FaTrash, FaDownload, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ImageGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const toast = useToast();

  const getAllImages = async () => {
    try {
      if (!searchQuery) {
        const response = await fetch('http://localhost:8080/images');
        const data = await response.json();
        console.log(data);
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);


  const handleSearch = async () => {
    const allowedColors = ['red', 'blue', 'green', 'yellow'];

    if (searchQuery.trim() === '') {
      getAllImages();
      return;
    }

    if (!searchQuery || !allowedColors.includes(searchQuery.toLowerCase())) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid color: red, blue, green, yellow.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/images/search?color=${searchQuery}`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
        toast({
          title: 'Search Result',
          description: `Images with dominant color ${searchQuery} retrieved successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Error fetching images.');
        toast({
          title: 'Error',
          description: 'Error fetching images.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Error',
        description: 'Error fetching images.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:8080/images/${imageId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({
          title: 'Image deleted!',
          description: 'Image deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        getAllImages();
      } else {
        toast({
          title: 'Error',
          description: 'Error deleting image.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error deleting image.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Error deleting image:', error);
    }
  };

  const handleDownloadImage = async (imageId, imageName) => {
    try {
      const response = await fetch(`http://localhost:8080/images/${imageId}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  

  const handleSearchHexValue = (hexValue) => {
    const encodedHexValue = encodeURIComponent(hexValue);
    const searchUrl = `https://www.google.com/search?q=${encodedHexValue}`;
    window.open(searchUrl, '_blank');
  };


  return (
    <Flex direction="column" alignItems="center" bg="gray.50" minH="100vh" width="1000px">
      <Box maxW="1200px" width="100%" padding="4" mt="4" boxShadow="md" borderRadius="md">
        <Flex justifyContent="space-between" alignItems="center" mb="4">
          <Heading as="h1" size="xl">
            My Gallery
          </Heading>
          <Link to="/upload">
            <Button colorScheme="green" leftIcon={<FaPlus />} size="sm">
              Add Image
            </Button>
          </Link>
        </Flex>
        <Flex alignItems="center" mb="4">
          <Input
            placeholder="Enter search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            flex="1"
            mr="2"
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>
        <Flex justifyContent="center" flexWrap="wrap">
          {images.map((image) => (
            <Box key={image.id} width="300px" height="300px" mr="4" mb="4" borderRadius="md" overflow="hidden" boxShadow="md">
              <a href={image.imageUrl} target="_blank" rel="noopener noreferrer">
                <Image src={image.imageUrl} alt={image.title} objectFit="cover" width="100%" height="85%" />
              </a>
              <Flex justifyContent="space-between" alignItems="center" p="2">
                <Heading as="h1" size="md" textAlign="center">
                  {image.title}
                </Heading>
                <Button colorScheme="red" size="sm" onClick={() => handleDeleteImage(image.id)} ml="10">
                  <FaTrash />
                </Button>
                <Button colorScheme="blue" size="sm" onClick={() => handleDownloadImage(image.id, image.title)} mr="2">
                  <FaDownload />
                </Button>
                <Button colorScheme="purple" size="sm" onClick={() => handleSearchHexValue(image.hexValue)}>
                  <FaSearch />
                </Button>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default ImageGallery;
