package org.final_project.community_zone.controller;

import org.final_project.community_zone.entity.Image;
import org.final_project.community_zone.service.ImageService;
import org.final_project.community_zone.vo.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/image")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public BaseResponse upload(@RequestParam("file") MultipartFile file){
        try{
            Long id = imageService.upload(file);
            return new BaseResponse<Long>(true, "", id);
        }catch (Exception e){
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]>  download(@PathVariable("id") Long id){
        Image image = imageService.getImageById(id);
        System.out.println(image);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFileName() + "\"")
                .body(image.getImageData());
    }


}
