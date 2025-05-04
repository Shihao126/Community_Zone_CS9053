package org.final_project.community_zone.service;

import org.final_project.community_zone.dto.FriendshipJudgeRequest;
import org.final_project.community_zone.dto.FriendshipRequest;
import org.final_project.community_zone.entity.Friendship;
import org.final_project.community_zone.entity.FriendshipApplication;
import org.final_project.community_zone.entity.User;
import org.final_project.community_zone.mapper.FriendshipApplicationMapper;
import org.final_project.community_zone.mapper.FriendshipMapper;
import org.final_project.community_zone.vo.BaseResponse;
import org.final_project.community_zone.vo.FriendshipRequestWithDetail;
import org.final_project.community_zone.vo.FriendshipWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class FriendshipService {


    @Autowired
    private FriendshipApplicationMapper friendshipApplicationMapper;

    @Autowired
    private FriendshipMapper friendshipMapper;

    @Autowired
    private UserService userService;

    public BaseResponse request(FriendshipRequest friendshipRequest) {
        // Check whether they are already friends
        Integer cnt1 = friendshipMapper.countByUidAndUid2(friendshipRequest);
        if (cnt1 > 0) {
            return new BaseResponse(false, "You are already friend");
        }

        // Check whether person has already sent the application without being denied.
        Integer cnt2 = friendshipApplicationMapper.countByUidAndUid2(friendshipRequest);
        if (cnt2 > 0) {
            return new BaseResponse(false, "You have already sent the application");
        }

        // Check whether person2 exists
        User info = userService.getInfo(friendshipRequest.getUid2());
        if (info == null) {
            return new BaseResponse(false, "User2 not found");
        }
        // Insert into the friendship application table.
        friendshipRequest.setCreateTime(new Timestamp(System.currentTimeMillis()));
        friendshipRequest.setStatus("WAITING");
        friendshipRequest.setIsactive(1);
        friendshipApplicationMapper.update(friendshipRequest);
        return new BaseResponse(true, "Successfully sent the application");

    }

    public List<FriendshipRequestWithDetail> requestList(Long uid) {
        return friendshipApplicationMapper.selectByUid(uid);
    }

    public BaseResponse judge(FriendshipJudgeRequest request) {
        // update friendship
        if ("ACCEPTED".equals(request.getStatus())) {
            Friendship friendship = new Friendship(request.getUid(), request.getUid2(), 1);
            Friendship reverse = new Friendship(request.getUid2(), request.getUid(), 1);

            friendshipMapper.update(friendship);
            friendshipMapper.update(reverse);
        }
        // update application
        friendshipApplicationMapper.judge(request);
        return new BaseResponse(true, "Successfully judged");
    }

    public List<FriendshipWithDetail> friendshipLists(Long uid) {
        return friendshipMapper.selectByUid(uid);
    }

    public BaseResponse delete(FriendshipRequest request) {
        Integer count = friendshipMapper.countByUidAndUid2(request);
        if (count == 0) {
            return new BaseResponse(false, "You are not friend");
        }
        Friendship friendship = new Friendship(request.getUid(), request.getUid2(), 0);
        Friendship reverse = new Friendship(request.getUid2(), request.getUid(), 0);
        friendshipMapper.update(friendship);
        friendshipMapper.update(reverse);
        return new BaseResponse(true, "Successfully deleted");
    }

    public List<FriendshipRequestWithDetail> applicationList(Long uid) {
        return friendshipApplicationMapper.selectByUid2(uid);
    }
}
