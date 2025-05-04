package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.dto.LoginRequest;
import org.final_project.community_zone.dto.RegisterRequest;
import org.final_project.community_zone.entity.User;

@Mapper
public interface UserMapper {
    Long checkLoginAndGetUID(LoginRequest loginRequest);
    Integer checkCntByUsername(String username);
    void register(RegisterRequest registerRequest);
    void update(RegisterRequest registerRequest);
    User getUserByUid(Long uid);
}
