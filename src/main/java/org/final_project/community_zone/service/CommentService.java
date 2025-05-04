package org.final_project.community_zone.service;

import org.final_project.community_zone.entity.Comment;
import org.final_project.community_zone.mapper.CommentMapper;
import org.final_project.community_zone.vo.CommentWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentMapper commentMapper;

    public Long submitComment(Comment comment) {
        commentMapper.insert(comment);
        return comment.getId();
    }

    public List<CommentWithDetail> getByBlogId(Long blogId) {
        return commentMapper.selectByBlogId(blogId);
    }
}
