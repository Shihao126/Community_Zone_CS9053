package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.dto.BlogRequest;
import org.final_project.community_zone.entity.Blog;
import org.final_project.community_zone.vo.BlogWithDetail;

import java.util.List;

@Mapper
public interface BlogMapper {
    int insert(Blog blog);

    BlogWithDetail selectById(Long id);

    void updateById(Blog blog);
    void deleteById(Long id);

    List<BlogWithDetail> selectByParameter(BlogRequest request);
}
