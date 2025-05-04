package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.entity.GroupMember;

@Mapper
public interface GroupMemberMapper {
    public int cntByUnique(GroupMember groupMember);

    void insert(GroupMember groupMember);
}
