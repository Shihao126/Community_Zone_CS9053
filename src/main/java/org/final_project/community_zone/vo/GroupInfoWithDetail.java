package org.final_project.community_zone.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GroupInfoWithDetail {
    private Long id;
    private String name;
    private String description;
    private Long createrId;
    private String createrName;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
