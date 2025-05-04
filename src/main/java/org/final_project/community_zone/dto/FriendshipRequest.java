package org.final_project.community_zone.dto;

import lombok.Data;
import org.final_project.community_zone.mapper.FriendshipApplicationMapper;
import org.final_project.community_zone.vo.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;

@Data
public class FriendshipRequest {
    private Long uid;
    private Long uid2;
    private String detail;
    private String status; // WAITING, REFUSED, ACCEPTED
    private Timestamp createTime;
    private Integer isactive;
}
