package pt.tiago.blog.Dtos;

import java.util.List;

public record AdminUserViewDTO (
    Long id,
    Long personId,
    String username,
    String name,
    String email,
    String role,
    List<PostResponseDTO> posts,
    List<CommentResponseDTO> comments
    ){}
