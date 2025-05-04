package org.final_project.community_zone.vo;

import lombok.Data;

@Data
public class BaseResponse<T> {
    private Boolean success;
    private String message;
    private T detail;

    public BaseResponse() {
    }

    public BaseResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public BaseResponse(Boolean success, String message, T detail) {
        this.success = success;
        this.message = message;
        this.detail = detail;
    }
}
