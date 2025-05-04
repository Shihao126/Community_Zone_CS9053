package org.final_project.community_zone.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.final_project.community_zone.entity.Token;

@Mapper
public interface TokenMapper {
    void insertOrUpdateToken(Token token);
    Token gainTokenDetail(Token token);
    void deleteToken(Token token);
}
