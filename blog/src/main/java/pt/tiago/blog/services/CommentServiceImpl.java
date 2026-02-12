package pt.tiago.blog.services;

import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pt.tiago.blog.Dtos.CommentRequestDTO;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.mappers.CommentMapper;
import pt.tiago.blog.models.Comment;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CommentRepository;
import pt.tiago.blog.repositories.PostRepository;

import java.security.InvalidParameterException;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentServiceImpl(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    @Override
    @Transactional
    public CommentResponseDTO addComment(Long postId, CommentRequestDTO dto, User user) {
         if(user==null){
             throw new UsernameNotFoundException("User not found");
         }
         Post post = postRepository.findById(postId).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
         Comment comment = CommentMapper.toDomain(dto,user,post);
         post.getComments().add(comment);
         comment.setCreatedAt(new Timestamp(System.currentTimeMillis()));
         comment.setUpdatedAt(comment.getCreatedAt());
         Comment savedComment = commentRepository.save(comment);

         return CommentMapper.toDTO(savedComment);
    }

    @Override
    public List<CommentResponseDTO> getPostComments(Long id){
        var comments = commentRepository.findByPostIdOrderByCreatedAtAsc(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        return comments.stream().map(CommentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public  void deleteComment(Long id) {
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        commentRepository.deleteById(comment.getId());
    }

    @Override
    @Transactional
    public List<CommentResponseDTO> getAllComments() {
        var comments = commentRepository.findAll();
        return comments.stream().map(CommentMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponseDTO updateComment(Long id, CommentRequestDTO dto){
        var comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        comment.setContent(dto.content());
        comment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Comment updatedComment = commentRepository.save(comment);
        return CommentMapper.toDTO(updatedComment);
    }


}
