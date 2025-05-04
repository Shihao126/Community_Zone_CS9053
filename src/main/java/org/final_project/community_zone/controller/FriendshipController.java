package org.final_project.community_zone.controller;

import org.final_project.community_zone.dto.FriendshipJudgeRequest;
import org.final_project.community_zone.dto.FriendshipRequest;
import org.final_project.community_zone.entity.FriendshipApplication;
import org.final_project.community_zone.service.FriendshipService;
import org.final_project.community_zone.vo.BaseList;
import org.final_project.community_zone.vo.BaseResponse;
import org.final_project.community_zone.vo.FriendshipRequestWithDetail;
import org.final_project.community_zone.vo.FriendshipWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend")
public class FriendshipController {


    @Autowired
    private FriendshipService friendshipService;

    // Request
    @PostMapping("/request")
    public BaseResponse request(@RequestHeader("uid") Long uid,
                                @RequestBody FriendshipRequest friendshipRequest) {
        try {
            friendshipRequest.setUid(uid);
            return friendshipService.request(friendshipRequest);

        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Request list
    @PostMapping("/request/list")
    public BaseResponse<BaseList<FriendshipRequestWithDetail>> requestList(@RequestHeader("uid") Long uid) {
        try {
            List<FriendshipRequestWithDetail> list = friendshipService.requestList(uid);
            return new BaseResponse<>(true, "", new BaseList<>(list));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Waiting list
    @PostMapping("/application/list")
    public BaseResponse<BaseList<FriendshipRequestWithDetail>> applicationList(@RequestHeader("uid") Long uid) {
        try {
            List<FriendshipRequestWithDetail> list = friendshipService.applicationList(uid);
            return new BaseResponse<>(true, "", new BaseList<>(list));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Judge
    @PostMapping("/judge")
    public BaseResponse judge(@RequestHeader("uid") Long uid,
                              @RequestBody FriendshipJudgeRequest request) {
        try {
            if (request.getUid2() != uid) {
                return new BaseResponse(false, "Illegal uid2");
            }
            return friendshipService.judge(request);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Friendship list
    @PostMapping("/friendship/list")
    public BaseResponse<BaseList<FriendshipWithDetail>> friendshipList(@RequestHeader("uid") Long uid) {
        try {
            List<FriendshipWithDetail> friendships = friendshipService.friendshipLists(uid);
            return new BaseResponse<>(true, "", new BaseList<>(friendships));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Delete
    @PostMapping("friendship/delete")
    public BaseResponse friendshipDelete(@RequestHeader("uid") Long uid,
                                         @RequestBody FriendshipRequest request) {
        try {
            request.setUid(uid);
            return friendshipService.delete(request);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }

    }

}
