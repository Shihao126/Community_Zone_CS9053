package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.dto.ChatRecordRangeRequest;
import org.final_project.community_zone.entity.ChatRecord;
import org.final_project.community_zone.vo.ChatRecordWithDetail;

import java.util.List;

@Mapper
public interface CharRecordMapper {


    void insert(ChatRecord record);
    List<ChatRecordWithDetail> get(ChatRecordRangeRequest request);
}
