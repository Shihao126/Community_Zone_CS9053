package org.final_project.community_zone.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogWithDetail {
    private Long id;
    private String title;
    private String content;
    private Long uid;
    private String username;
    private Integer hasImage;
    private Long imageId;
    private String permission; // PRIVATE, FRIEND, PUBLIC
    private Integer userHasImage;
    private Long userImageId;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
