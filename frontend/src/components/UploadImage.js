import React, { useState } from 'react';
import { Box, Heading, Input, Button, Stack, Flex, useToast } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';

const UploadImage = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const toast = useToast();

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('title', title);

      const response = await axios.post('http://localhost:8080/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      toast({
        title: 'Image uploaded!',
        description: `Image uploaded successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while uploading the image.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <Box padding="4" boxShadow="lg" rounded="lg" bg="white" width="400px">
      <Flex justifyContent="space-between" alignItems="center" mb="4">
        <Heading as="h1" size="xl">
          Upload Image
        </Heading>
        <Link to="/">
          <Button colorScheme="blue" variant="ghost">
            <FaHome />
          </Button>
        </Link>
      </Flex>
      <Stack spacing="4" mb="4">
        <Input type="file" onChange={handleImageChange} accept="image/*" />
        <Input
          type="text"
          placeholder="Enter the title..."
          value={title}
          onChange={handleTitleChange}
        />
        <Button colorScheme="blue" onClick={handleImageUpload}>Upload</Button>
      </Stack>
    </Box>
  );
};

export default UploadImage;
