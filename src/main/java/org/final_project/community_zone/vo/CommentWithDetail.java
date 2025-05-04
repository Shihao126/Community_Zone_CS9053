package org.final_project.community_zone.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentWithDetail {
    private Long id;
    private Long blogId;
    private Long uid;
    private String username;
    private String content;

    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
