package com.somika.imagefileservice.repository;

import com.somika.imagefileservice.domain.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByDominantColorIgnoreCase(String dominantColor);

}
