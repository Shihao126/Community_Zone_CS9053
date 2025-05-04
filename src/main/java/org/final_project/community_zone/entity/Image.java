package org.final_project.community_zone.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Image {
    private Long id;
    private String fileName;
    private String contentType;
    private byte[] imageData;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public Image() {
    }

    public Image(String fileName, String contentType, byte[] imageData) {
        this.fileName = fileName;
        this.contentType = contentType;
        this.imageData = imageData;
    }
}
