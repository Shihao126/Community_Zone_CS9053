package org.final_project.community_zone.controller;

import org.final_project.community_zone.dto.LoginRequest;
import org.final_project.community_zone.dto.RegisterRequest;
import org.final_project.community_zone.entity.Token;
import org.final_project.community_zone.entity.User;
import org.final_project.community_zone.mapper.TokenMapper;
import org.final_project.community_zone.service.UserService;
import org.final_project.community_zone.vo.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private TokenMapper tokenMapper;

    // Register
    @PostMapping("/register")
    public BaseResponse register(@RequestBody RegisterRequest registerRequest) {
        try {
            return userService.register(registerRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Update user information
    @PostMapping("/info/update")
    public BaseResponse update(@RequestHeader("uid") Long uid,
                               @RequestBody RegisterRequest registerRequest) {
        try {
            registerRequest.setUid(uid);
            return userService.update(registerRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Get user information
    @PostMapping("/info/get")
    public BaseResponse<User> getInfo(@RequestHeader("uid") Long uid) {
        try {

            User info = userService.getInfo(uid);
            return new BaseResponse<>(true, "Get user info success", info);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }


    // Get user information
    @PostMapping("/info/other/{uid}")
    public BaseResponse<User> getOthersInfo(@PathVariable("uid") Long uid) {
        try {

            User info = userService.getInfo(uid);
            info.setPassword(null);
            return new BaseResponse<>(true, "Get user info success", info);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Login and gain the token
    @PostMapping("/login")
    public BaseResponse<Token> login(@RequestBody LoginRequest loginRequest) {
        try {
            Token token = userService.login(loginRequest);
            if (token == null) {
                return new BaseResponse<>(false, "Login failed!");
            } else {
                return new BaseResponse<>(true, "Login successful!", token);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, e.getMessage());
        }
    }

    // Logout
    @PostMapping("/logout")
    public BaseResponse logout(@RequestHeader("uid") Long uid,
                               @RequestHeader("token") String token) {
        try {
            tokenMapper.deleteToken(new Token(uid, token));
            return new BaseResponse(true, "Logout success");
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }

    }

}
