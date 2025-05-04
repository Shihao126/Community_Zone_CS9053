package org.final_project.community_zone.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GroupInfo {
    private Long id;
    private String name;
    private String description;
    private Long createrId;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
