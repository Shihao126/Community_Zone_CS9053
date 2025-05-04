package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.dto.FriendshipRequest;
import org.final_project.community_zone.entity.Friendship;
import org.final_project.community_zone.vo.FriendshipWithDetail;

import java.util.List;

@Mapper
public interface FriendshipMapper {
    void update(Friendship friendship);

    Integer countByUidAndUid2(FriendshipRequest friendshipRequest);

    List<FriendshipWithDetail> selectByUid(Long uid);
}
