package org.final_project.community_zone.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRecord {
    private Long id;
    private Long uid;
    private String sessionType;
    private String sessionId;
    private String record;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
