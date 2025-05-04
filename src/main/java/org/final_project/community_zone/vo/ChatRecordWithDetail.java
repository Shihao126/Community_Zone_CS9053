package org.final_project.community_zone.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatRecordWithDetail {
    private Long id;
    private Long uid;
    private String username;
    private String sessionType;
    private String sessionId;
    private String record;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
