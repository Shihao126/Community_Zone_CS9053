package org.final_project.community_zone.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private Long uid;
    private String username;
    private String password;
    private String gender;
    private String birthday;
    private String education;
    private String nationality;
    private Integer hasImage;
    private Long imageId;

}
