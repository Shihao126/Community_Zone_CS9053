package org.final_project.community_zone.entity;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class FriendshipApplication {
    private Long uid;
    private Long uid2;
    private String detail;
    private String status;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
