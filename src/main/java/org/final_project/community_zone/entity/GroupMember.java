package org.final_project.community_zone.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GroupMember {
    private Long groupId;
    private Long uid;
    private Integer isactive;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public String getSessionId() {
        return "Group_" + groupId;
    }

    public GroupMember() {
    }

    public GroupMember(Long groupId, Long uid, Integer isactive) {
        this.groupId = groupId;
        this.uid = uid;
        this.isactive = isactive;
    }
}
