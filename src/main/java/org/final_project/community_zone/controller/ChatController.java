package org.final_project.community_zone.controller;

import org.final_project.community_zone.dto.ChatRecordRangeRequest;
import org.final_project.community_zone.dto.FriendshipRequest;
import org.final_project.community_zone.entity.ChatRecord;
import org.final_project.community_zone.entity.GroupInfo;
import org.final_project.community_zone.entity.GroupMember;
import org.final_project.community_zone.service.ChatService;
import org.final_project.community_zone.vo.BaseList;
import org.final_project.community_zone.vo.BaseResponse;
import org.final_project.community_zone.vo.ChatRecordWithDetail;
import org.final_project.community_zone.vo.GroupInfoWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/record/submit")
    private BaseResponse submit(@RequestHeader("uid") Long uid,
                                @RequestBody ChatRecord record) {
        try {
            record.setUid(uid);
            chatService.insert(record);
            return new BaseResponse(true, "Insert successful");
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/record/get")
    private BaseResponse<BaseList<ChatRecordWithDetail>> get(@RequestBody ChatRecordRangeRequest request) {
        try {
            List<ChatRecordWithDetail> details = chatService.get(request);
            return new BaseResponse<>(true, "", new BaseList<>(details));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Create a new chat group with name and description.
    @PostMapping("/group/create")
    private BaseResponse createGroup(@RequestHeader("uid") Long uid,
                                     @RequestBody GroupInfo info) {
        try {
            info.setCreaterId(uid);
            chatService.createGroup(info);
            return new BaseResponse(true, "Create successful");
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    // Join a chat group.
    @PostMapping("/group/join")
    private BaseResponse joinGroup(@RequestHeader("uid") Long uid,
                                   @RequestBody GroupMember info) {
        try {
            info.setUid(uid);
            return chatService.enterGroup(info);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/group/detail/{groupId}")
    private BaseResponse<GroupInfoWithDetail> groupDetail(@PathVariable Long groupId) {
        try {
            return chatService.groupDetail(groupId);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/group/list")
    private BaseResponse<BaseList<GroupInfoWithDetail>> listGroup(@RequestHeader("uid") Long uid) {
        try {
            List<GroupInfoWithDetail> details = chatService.listGroup(uid);
            return new BaseResponse<>(true, "", new BaseList<>(details));
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

}
