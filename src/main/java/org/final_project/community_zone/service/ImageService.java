package org.final_project.community_zone.service;

import org.final_project.community_zone.entity.Image;
import org.final_project.community_zone.mapper.ImageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {

    @Autowired
    ImageMapper imageMapper;

    public Long upload(MultipartFile file) throws IOException {
        Image image = new Image(file.getOriginalFilename(), file.getContentType(), file.getBytes());
        imageMapper.upload(image);
        return image.getId();
    }

    public Image getImageById(Long id) {
        return imageMapper.get(id);
    }
}
