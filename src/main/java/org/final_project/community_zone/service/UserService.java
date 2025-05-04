package org.final_project.community_zone.service;

import org.final_project.community_zone.dto.LoginRequest;
import org.final_project.community_zone.dto.RegisterRequest;
import org.final_project.community_zone.entity.Token;
import org.final_project.community_zone.entity.User;
import org.final_project.community_zone.mapper.TokenMapper;
import org.final_project.community_zone.mapper.UserMapper;
import org.final_project.community_zone.vo.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private TokenMapper tokenMapper;

    public BaseResponse register(RegisterRequest registerRequest) {
        // check duplicate
        Integer cnt = userMapper.checkCntByUsername(registerRequest.getUsername());
        if (cnt > 0) {
            return new BaseResponse(false, "Duplicate user name.");
        }
        // register
        userMapper.register(registerRequest);
        return new BaseResponse(true, "User registered successfully.");
    }

    public BaseResponse update(RegisterRequest registerRequest) {
        // update
        userMapper.update(registerRequest);
        return new BaseResponse(true, "User info update successfully.");
    }

    public Token login(LoginRequest loginRequest) {
        Long uid = userMapper.checkLoginAndGetUID(loginRequest);
        if (uid == null) {
            return null;
        }

        String tokenStr = UUID.randomUUID().toString().replace("-", "");
        Token token = new Token(uid, tokenStr);
        tokenMapper.insertOrUpdateToken(token);

        return new Token(uid, tokenStr);
    }

    public User getInfo(Long uid){
        User info = userMapper.getUserByUid(uid);
        return info;
    }



}
