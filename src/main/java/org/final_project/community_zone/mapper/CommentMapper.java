package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.entity.Comment;
import org.final_project.community_zone.vo.CommentWithDetail;

import java.util.List;

@Mapper
public interface CommentMapper {
    void insert(Comment comment);

    List<CommentWithDetail> selectByBlogId(Long blogId);
}
