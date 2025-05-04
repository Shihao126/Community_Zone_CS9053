package org.final_project.community_zone.entity;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class Friendship {
    private int id;
    private Long uid;
    private Long uid2;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public Friendship(Long uid, Long uid2, Integer isactive) {
        this.uid = uid;
        this.uid2 = uid2;
        this.isactive = isactive;
    }
}
