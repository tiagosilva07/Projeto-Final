package pt.tiago.blog.Dtos;

import java.util.List;

public record UserResponseDTO (
        Long id,
        Long personId,
        String username,
        String name,
        String email,
        List<PostResponseDTO> posts,
        List<CommentResponseDTO> comments
)
{ }
