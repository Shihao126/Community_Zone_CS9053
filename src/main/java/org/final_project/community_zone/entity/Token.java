package org.final_project.community_zone.entity;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class Token {
    private Long uid;
    private String token;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public Token(Long uid, String token, Integer isactive, LocalDateTime createTime, LocalDateTime updateTime) {
        this.uid = uid;
        this.token = token;
        this.isactive = isactive;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }

    public Token(Long uid, String token) {
        this.uid = uid;
        this.token = token;
    }
}
