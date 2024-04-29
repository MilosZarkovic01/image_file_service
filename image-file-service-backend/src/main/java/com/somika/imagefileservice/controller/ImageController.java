package com.somika.imagefileservice.controller;

import com.somika.imagefileservice.dto.ImageDto;
import com.somika.imagefileservice.service.impl.ImageServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    private final ImageServiceImpl imageService;

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file,
                              @RequestParam("title") String title) {
        return imageService.uploadImage(file, title);
    }

    @GetMapping
    public List<ImageDto> getAllImages() {
        return imageService.getAllImages();
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
    }

    @GetMapping("/search")
    public List<ImageDto> searchImagesByColor(@RequestParam String color) {
        return imageService.searchImagesByColor(color);
    }
}
