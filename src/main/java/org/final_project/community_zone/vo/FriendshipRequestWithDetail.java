package org.final_project.community_zone.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FriendshipRequestWithDetail {
    private Long uid;
    private Long uid2;
    private String username;
    private String username2;
    private String detail;
    private String status;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
