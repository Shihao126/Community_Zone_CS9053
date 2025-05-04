package org.final_project.community_zone.controller;

import org.final_project.community_zone.dto.BlogRequest;
import org.final_project.community_zone.entity.Blog;
import org.final_project.community_zone.entity.Comment;
import org.final_project.community_zone.service.BlogService;
import org.final_project.community_zone.service.CommentService;
import org.final_project.community_zone.vo.BaseList;
import org.final_project.community_zone.vo.BaseResponse;
import org.final_project.community_zone.vo.BlogWithDetail;
import org.final_project.community_zone.vo.CommentWithDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blog")
public class BlogController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private BlogService blogService;

    @PostMapping("/submit")
    public BaseResponse submit(@RequestHeader("uid") Long uid,
                               @RequestBody Blog blog) {
        try {
            blog.setUid(uid);
            Long id = blogService.submit(blog);
            return new BaseResponse(true, "", id);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/edit")
    public BaseResponse edit(@RequestHeader("uid") Long uid,
                             @RequestBody Blog blog) {
        try {
            blog.setUid(uid);
            return blogService.update(blog);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/delete/{blog_id}")
    public BaseResponse delete(@RequestHeader("uid") Long uid,
                               @PathVariable("blog_id") Long blogId) {
        try {
            return blogService.delete(blogId, uid);
        }catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/get/{id}")
    public BaseResponse<BlogWithDetail> getById(@PathVariable Long id) {
        try {
            BlogWithDetail detail = blogService.getById(id);
            if (detail == null) {
                return new BaseResponse<>(false, "No such blog");
            } else {
                return new BaseResponse<>(true, "", detail);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/get_with_parameter")
    public BaseResponse<BaseList<BlogWithDetail>> getByParameter(@RequestHeader("uid") Long uid,
                                                                 @RequestBody BlogRequest request) {
        try {
            request.setUid(uid);
            List<BlogWithDetail> blogs = blogService.getByParameter(request);
            return new BaseResponse<>(true, "", new BaseList<>(blogs));
        }catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse(false, e.getMessage());
        }
    }

    @PostMapping("/comment/submit")
    public BaseResponse commentSubmit(@RequestHeader("uid") Long uid,
                                      @RequestBody Comment comment) {
        try {
            comment.setUid(uid);

            Long commentId = commentService.submitComment(comment);

            return new BaseResponse<Long>(true, "", commentId);
        } catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse<>(false, e.getMessage());
        }

    }

    @PostMapping("/comment/get/{blog_id}")
    public BaseResponse<BaseList<CommentWithDetail>> commentGet(@PathVariable("blog_id") Long blogId) {
        try {
            List<CommentWithDetail> comments = commentService.getByBlogId(blogId);
            return new BaseResponse<>(true, "", new BaseList<>(comments));
        } catch (Exception e) {
            return new BaseResponse<>(false, e.getMessage());
        }
    }
}
