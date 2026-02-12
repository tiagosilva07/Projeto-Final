package pt.tiago.blog.mappers;

import pt.tiago.blog.Dtos.CommentRequestDTO;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.models.Comment;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.User;

public class CommentMapper {

    public static Comment toDomain (CommentRequestDTO commentRequestDTO, User user, Post post) {
        Comment comment = new Comment();
        comment.setContent(commentRequestDTO.content());
        comment.setPost(post);
        comment.setAuthor(user);
        return comment;
    }

    public static CommentResponseDTO toDTO(Comment comment){
        return new CommentResponseDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt().toString(),
                comment.getUpdatedAt().toString(),
                comment.getAuthor().getUserName(),
                comment.getAuthor().getId(),
                comment.getPost().getId(),
                comment.getPost().getStatus().toString()
                );
    }

}
