package org.final_project.community_zone.entity;

import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer uid;
    private String username;
    private String password;
    private String gender;
    private String birthday;
    private String education;
    private String nationality;
    private Integer hasImage;
    private Long imageId;

    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
