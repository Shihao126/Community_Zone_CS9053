package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.dto.FriendshipJudgeRequest;
import org.final_project.community_zone.dto.FriendshipRequest;
import org.final_project.community_zone.entity.FriendshipApplication;
import org.final_project.community_zone.vo.FriendshipRequestWithDetail;

import java.util.List;

@Mapper
public interface FriendshipApplicationMapper {
    Integer countByUidAndUid2(FriendshipRequest friendshipRequest);
    void update(FriendshipRequest friendshipRequest);
    List<FriendshipRequestWithDetail> selectByUid(Long uid);

    void judge(FriendshipJudgeRequest request);

    List<FriendshipRequestWithDetail> selectByUid2(Long uid2);
}
