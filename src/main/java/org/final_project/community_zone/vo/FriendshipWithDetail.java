package org.final_project.community_zone.vo;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class FriendshipWithDetail {
    private Long uid;
    private Long uid2;
    private String username;
    private String username2;
    private Integer hasImage;
    private Long imageId;
    private Integer hasImage2;
    private Long imageId2;
    private String gender;
    private String birthday;
    private String education;
    private String nationality;

    private Integer isactive;
    private Timestamp createTime;
    private Timestamp updateTime;

    public String getSessionId() {
        return Math.min(uid, uid2) + "_" + Math.max(uid, uid2);
    }

}
