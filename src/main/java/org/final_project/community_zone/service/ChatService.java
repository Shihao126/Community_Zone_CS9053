package org.final_project.community_zone.service;

import org.final_project.community_zone.dto.ChatRecordRangeRequest;
import org.final_project.community_zone.entity.ChatRecord;
import org.final_project.community_zone.entity.GroupInfo;
import org.final_project.community_zone.entity.GroupMember;
import org.final_project.community_zone.entity.User;
import org.final_project.community_zone.mapper.CharRecordMapper;
import org.final_project.community_zone.mapper.GroupInfoMapper;
import org.final_project.community_zone.mapper.GroupMemberMapper;
import org.final_project.community_zone.mapper.UserMapper;
import org.final_project.community_zone.vo.BaseResponse;
import org.final_project.community_zone.vo.ChatRecordWithDetail;
import org.final_project.community_zone.vo.GroupInfoWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {
    @Autowired
    private CharRecordMapper charRecordMapper;

    @Autowired
    private GroupInfoMapper groupInfoMapper;

    @Autowired
    private GroupMemberMapper groupMemberMapper;
    @Autowired
    private UserMapper userMapper;

    public void insert(ChatRecord record) {
        charRecordMapper.insert(record);
    }

    public List<ChatRecordWithDetail> get(ChatRecordRangeRequest request) {
        return charRecordMapper.get(request);
    }

    public void createGroup(GroupInfo info) {
        groupInfoMapper.insert(info);
        GroupMember groupMember = new GroupMember(info.getId(), info.getCreaterId(), 1);
        groupMemberMapper.insert(groupMember);

    }

    public BaseResponse enterGroup(GroupMember info) {
        info.setIsactive(1);
        int cnt = groupMemberMapper.cntByUnique(info);
        if (cnt == 0) {
            groupMemberMapper.insert(info);
            return new BaseResponse(true, "Enter the group successful");
        } else {
            return new BaseResponse(false, "Already in the group");
        }
    }

    public BaseResponse<GroupInfoWithDetail> groupDetail(Long groupId) {
        GroupInfoWithDetail detail = groupInfoMapper.selectById(groupId);
        if (detail != null) {
            User user = userMapper.getUserByUid(detail.getCreaterId());
            detail.setCreaterName(user.getUsername());
            return new BaseResponse<>(true, "", detail);
        }
        return new BaseResponse(false, "Group not found");
    }

    public List<GroupInfoWithDetail> listGroup(Long uid) {
        return groupInfoMapper.selectByUid(uid);
    }
}
