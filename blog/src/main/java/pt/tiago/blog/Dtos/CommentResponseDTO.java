package pt.tiago.blog.Dtos;

import java.util.List;

public record CommentResponseDTO(
        Long id,
        String comment,
        String createdAt,
        String updatedAt,
        String author,
        Long authorId,
        Long postId,
        String postStatus
) { }
