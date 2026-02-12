package pt.tiago.blog.Dtos;

import java.util.List;

public record PostResponseDTO(
        Long id,
        String title,
        String content,
        String createdAt,
        String updatedAt,
        String username,
        String status,
        String imageUrl,
        List<CategoryResponseDTO> categories,
        List<CommentResponseDTO> comments
)
{ }

