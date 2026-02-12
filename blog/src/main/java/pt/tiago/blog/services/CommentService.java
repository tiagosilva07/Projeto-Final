package pt.tiago.blog.services;

import pt.tiago.blog.Dtos.CommentRequestDTO;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.models.User;

import java.util.List;

public interface CommentService {
    CommentResponseDTO addComment(Long postId, CommentRequestDTO dto, User details);
    List<CommentResponseDTO> getPostComments(Long id);
    CommentResponseDTO updateComment(Long id, CommentRequestDTO dto);

    void deleteComment(Long id);
    List<CommentResponseDTO> getAllComments();
}
