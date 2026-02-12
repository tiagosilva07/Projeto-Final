package pt.tiago.blog.unit.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pt.tiago.blog.Dtos.CommentRequestDTO;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.models.Comment;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CommentRepository;
import pt.tiago.blog.repositories.PostRepository;
import pt.tiago.blog.services.CommentServiceImpl;


import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @InjectMocks
    private CommentServiceImpl commentService;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    private User user;
    private Post post;
    private Comment comment;
    private CommentRequestDTO dto;

    @BeforeEach
    void setup() {
        user = new User("john", "pass123", null);
        post = new Post();
        post.setId(10L);

        dto = new CommentRequestDTO("Nice post!");

        Timestamp now = new Timestamp(System.currentTimeMillis());
        comment = new Comment();
        comment.setId(1L);
        comment.setContent("Nice post!");
        comment.setAuthor(user);
        comment.setPost(post);
        comment.setCreatedAt(now);
        comment.setUpdatedAt(now);
    }

    // ---------------------------
    // ADD COMMENT
    // ---------------------------

    @Test
    void shouldThrowWhenUserIsNull() {
        assertThrows(UsernameNotFoundException.class,
                () -> commentService.addComment(10L, dto, null));
    }

    @Test
    void shouldThrowWhenPostNotFound() {
        when(postRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.addComment(10L, dto, user));
    }

    @Test
    void shouldAddCommentSuccessfully() {
        when(postRepository.findById(10L)).thenReturn(Optional.of(post));
        when(commentRepository.save(any())).thenReturn(comment);

        CommentResponseDTO result = commentService.addComment(10L, dto, user);

        assertEquals("Nice post!", result.comment());
        verify(commentRepository).save(any(Comment.class));
    }

    // ---------------------------
    // GET POST COMMENTS
    // ---------------------------

    @Test
    void shouldThrowWhenPostCommentsNotFound() {
        when(commentRepository.findByPostIdOrderByCreatedAtAsc(10L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.getPostComments(10L));
    }

    @Test
    void shouldReturnPostComments() {
        when(commentRepository.findByPostIdOrderByCreatedAtAsc(10L))
                .thenReturn(Optional.of(List.of(comment)));

        List<CommentResponseDTO> result = commentService.getPostComments(10L);

        assertEquals(1, result.size());
        assertEquals("Nice post!", result.get(0).comment());
    }

    // ---------------------------
    // DELETE COMMENT
    // ---------------------------

    @Test
    void shouldThrowWhenDeletingNonExistingComment() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.deleteComment(1L));
    }

    @Test
    void shouldDeleteCommentSuccessfully() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        commentService.deleteComment(1L);

        verify(commentRepository).deleteById(1L);
    }

    // ---------------------------
    // GET ALL COMMENTS
    // ---------------------------

    @Test
    void shouldReturnAllComments() {
        when(commentRepository.findAll()).thenReturn(List.of(comment));

        List<CommentResponseDTO> result = commentService.getAllComments();

        assertEquals(1, result.size());
        assertEquals("Nice post!", result.get(0).comment());
    }

    // ---------------------------
    // UPDATE COMMENT
    // ---------------------------

    @Test
    void shouldThrowWhenUpdatingNonExistingComment() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.updateComment(1L, dto));
    }

    @Test
    void shouldUpdateCommentSuccessfully() {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(any())).thenReturn(comment);

        CommentResponseDTO result = commentService.updateComment(1L, dto);

        assertEquals("Nice post!", result.comment());
        verify(commentRepository).save(comment);
    }
}
