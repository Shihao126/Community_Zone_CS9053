package org.final_project.community_zone.service;

import org.final_project.community_zone.dto.BlogRequest;
import org.final_project.community_zone.entity.Blog;
import org.final_project.community_zone.mapper.BlogMapper;
import org.final_project.community_zone.vo.BaseResponse;
import org.final_project.community_zone.vo.BlogWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogService {
    @Autowired
    private BlogMapper blogMapper;

    public Long submit(Blog blog) {
        blogMapper.insert(blog);
        return blog.getId();
    }

    public BlogWithDetail getById(Long id) {
        return blogMapper.selectById(id);
    }

    public BaseResponse update(Blog blog) {
        BlogWithDetail oldValue = blogMapper.selectById(blog.getId());
        if (blog.getHasImage() == null) {
            blog.setHasImage(0);
        }
        if (oldValue.getUid() != blog.getUid()) {
            return new BaseResponse(false, "Illegal user");
        }
        blogMapper.updateById(blog);
        return new BaseResponse(true, "Success");
    }

    public BaseResponse delete(Long id, Long uid) {
        BlogWithDetail blogWithDetail = blogMapper.selectById(id);
        if (blogWithDetail.getUid() != uid) {
            return new BaseResponse(false, "Illegal user");
        }
        blogMapper.deleteById(id);
        return new BaseResponse(true, "Success");
    }

    public List<BlogWithDetail> getByParameter(BlogRequest request) {
        if (request.getStartTime() == null) {
            request.setStartTime("1970-01-01");
        }
        if (request.getEndTime() == null) {
            request.setEndTime("9999-12-31");
        }
        return blogMapper.selectByParameter(request);
    }
}
