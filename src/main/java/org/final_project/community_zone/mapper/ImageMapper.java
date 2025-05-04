package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.entity.Image;

@Mapper
public interface ImageMapper {
    void upload(Image image);

    Image get(Long id);
}
