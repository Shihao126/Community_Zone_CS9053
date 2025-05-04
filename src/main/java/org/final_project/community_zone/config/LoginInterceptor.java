package org.final_project.community_zone.config;

import org.final_project.community_zone.entity.Token;
import org.final_project.community_zone.mapper.TokenMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.ZoneId;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Autowired
    private TokenMapper tokenMapper;

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        String uidStr = request.getHeader("uid");
        String token = request.getHeader("token");
        if (uidStr == null || token == null) {
            response.getWriter().write("Missing uid or token");
            return false;
        }
        Long uid;
        try {
            uid = Long.valueOf(uidStr);
        } catch (NumberFormatException e) {

            response.getWriter().write("Invalid uid format");
            return false;
        }

        Token tokenDetail = tokenMapper.gainTokenDetail(new Token(uid, token));
        if (tokenDetail == null) {
            response.getWriter().write("Token not valid or inactive");
            return false;
        }
        Long updateTime = tokenDetail.getUpdateTime().now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long currentTime = System.currentTimeMillis();

        if ((currentTime - updateTime) > 6 * 60 * 60 * 1000L) {
            response.getWriter().write("Token expired");
            return false;
        }

        request.setAttribute("uid", uid);
        request.setAttribute("token", token);
        return true;
    }


}
