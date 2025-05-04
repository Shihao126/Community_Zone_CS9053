package org.final_project.community_zone.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Blog {
    private Long id;
    private String title;
    private String content;
    private Long uid;
    private Integer hasImage;
    private Long imageId;
    private String permission; // PRIVATE, FRIEND, PUBLIC

    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
