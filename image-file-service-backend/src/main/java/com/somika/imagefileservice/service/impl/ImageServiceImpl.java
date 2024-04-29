package com.somika.imagefileservice.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.somika.imagefileservice.config.AwsS3Config;
import com.somika.imagefileservice.domain.Image;
import com.somika.imagefileservice.dto.ImageDto;
import com.somika.imagefileservice.mapper.ImageMapper;
import com.somika.imagefileservice.repository.ImageRepository;
import com.somika.imagefileservice.service.DominantColorExtractor;
import com.somika.imagefileservice.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final AmazonS3 amazonS3;
    private final ImageRepository imageRepository;
    private final AwsS3Config awsS3Config;
    private final ImageMapper imageMapper;
    private final DominantColorExtractor dominantColorExtractor;

    @Override
    public String uploadImage(MultipartFile file, String title) {
        try {
            String key = "images/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());

            PutObjectRequest objectRequest = new PutObjectRequest(awsS3Config.getS3().getBucketName(), key, file.getInputStream(), metadata);

            amazonS3.putObject(objectRequest);

            BufferedImage bufferedImage = ImageIO.read(file.getInputStream());

            String hexColor = dominantColorExtractor.determineHexColorValue(bufferedImage);
            DominantColorExtractor.DominantColor dominantColor = dominantColorExtractor.determineDominantColor(bufferedImage);

            Image image = Image.builder()
                    .title(title)
                    .awsKey(key)
                    .imageUrl(getImageUrl(key))
                    .hexValue(hexColor)
                    .dominantColor(dominantColor.name())
                    .build();

            imageRepository.save(image);

            return key;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error.");
        }
    }

    @Override
    public List<ImageDto> getAllImages() {
        return imageMapper.imagesToImageDTOs(imageRepository.findAll());
    }

    @Override
    public void deleteImage(Long id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        amazonS3.deleteObject(new DeleteObjectRequest(awsS3Config.getS3().getBucketName(), image.getAwsKey()));

        imageRepository.delete(image);
    }

    @Override
    public List<ImageDto> searchImagesByColor(String color) {
        return imageMapper.imagesToImageDTOs(imageRepository.findByDominantColorIgnoreCase(color));
    }

    private String getImageUrl(String key) {
        return "https://" + awsS3Config.getS3().getBucketName() + ".s3.amazonaws.com/" + key;
    }
}
