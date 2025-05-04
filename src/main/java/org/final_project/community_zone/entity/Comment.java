package org.final_project.community_zone.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Long id;
    private Long blogId;
    private Long uid;
    private String content;

    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
