package pt.tiago.blog.mappers;

import pt.tiago.blog.Dtos.*;
import pt.tiago.blog.models.Category;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.PostStatus;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CategoryRepository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PostMapper {

    public static Post toDomain(PostRequestDTO dto, User author, Set<Category> categories) {
        Post post = new Post();
        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setAuthor(author);
        post.setCategories(categories);
        post.setStatus(PostStatus.valueOf(dto.status()));
        post.setImageUrl(dto.imageUrl());
        return post;
    }

    public static PostResponseDTO toDTO(Post post) {
        return new PostResponseDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt().toString(),
                post.getUpdatedAt().toString(),
                post.getAuthor().getUserName(),
                post.getStatus().name(),
                post.getImageUrl(),
                toCategoryDTOList(post.getCategories()),
                post.getComments().stream().map(CommentMapper::toDTO).collect(Collectors.toList())
        );
    }


    private static List<CategoryResponseDTO> toCategoryDTOList(Set<Category> categories) {
        return categories.stream().map(CategoryMapper::toDTO).collect(Collectors.toList());
    }
}