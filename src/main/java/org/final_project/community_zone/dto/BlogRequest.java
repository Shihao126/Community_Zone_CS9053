package org.final_project.community_zone.dto;

import lombok.Data;

@Data
public class BlogRequest {
    private Long uid;
    private Integer privateTag;
    private Integer friendTag;
    private Integer publicTag;
    private String startTime;
    private String endTime;
}
