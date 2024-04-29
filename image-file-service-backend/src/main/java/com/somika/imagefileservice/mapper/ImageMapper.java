package com.somika.imagefileservice.mapper;

import com.somika.imagefileservice.domain.Image;
import com.somika.imagefileservice.dto.ImageDto;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    ImageDto imageToImageDto(Image image);

    default List<ImageDto> imagesToImageDTOs(List<Image> images) {
        return images.stream()
                .map(this::imageToImageDto)
                .collect(Collectors.toList());
    }
}

