package org.final_project.community_zone.dto;

import lombok.Data;

@Data
public class ChatRecordRangeRequest {
    private String sessionType;
    private String sessionId;
    private String startTime;
    private String endTime;

}
