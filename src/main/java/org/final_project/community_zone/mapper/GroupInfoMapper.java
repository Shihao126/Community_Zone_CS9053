package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.entity.GroupInfo;
import org.final_project.community_zone.vo.GroupInfoWithDetail;

import java.util.List;

@Mapper
public interface GroupInfoMapper {
    Long insert(GroupInfo info);

    GroupInfoWithDetail selectById(Long id);

    List<GroupInfoWithDetail> selectByUid(Long uid);
}
