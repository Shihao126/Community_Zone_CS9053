package org.final_project.community_zone.dto;

import lombok.Data;

@Data
public class FriendshipJudgeRequest {
    private Long uid;
    private Long uid2;
    private String status;

    public FriendshipJudgeRequest() {
    }

    public FriendshipJudgeRequest(Long uid, Long uid2, String status) {
        this.uid = uid;
        this.uid2 = uid2;
        this.status = status;
    }
}
