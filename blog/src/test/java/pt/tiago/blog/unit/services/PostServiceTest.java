package pt.tiago.blog.unit.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pt.tiago.blog.Dtos.PostRequestDTO;
import pt.tiago.blog.Dtos.PostResponseDTO;
import pt.tiago.blog.exceptions.BadRequestException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.models.Category;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.PostStatus;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CategoryRepository;
import pt.tiago.blog.repositories.PostRepository;
import pt.tiago.blog.repositories.UserRepository;
import pt.tiago.blog.services.PostServiceImpl;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @InjectMocks
    private PostServiceImpl postService;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    private User user;
    private Category category;
    private Post post;
    private PostRequestDTO dto;

    @BeforeEach
    void setup() {
        user = new User("john", "pass", null);
        user.setPerson(new pt.tiago.blog.models.Person("John Doe", "john@mail.com"));
        user.getPerson().setId(10L);

        category = new Category("Tech", "Technology");
        category.setId(1L);

        dto = new PostRequestDTO(
                "My Post",
                "Some content",
                "PUBLISHED",
                "https://example.com/img.jpg",
                List.of(1L)
        );

        post = new Post();
        post.setId(1L);
        post.setTitle("My Post");
        post.setContent("Some content");
        post.setStatus(PostStatus.PUBLISHED);
        post.setAuthor(user);
        post.setCategories(Set.of(category));
        post.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        post.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
    }

    // ---------------------------
    // CREATE
    // ---------------------------

    @Test
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> postService.Create(dto, "john"));
    }

    @Test
    void shouldThrowWhenCategoryNotFound() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.of(user));
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> postService.Create(dto, "john"));
    }

    @Test
    void shouldCreatePostSuccessfully() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.of(user));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(postRepository.save(any())).thenReturn(post);

        PostResponseDTO result = postService.Create(dto, "john");

        assertEquals("My Post", result.title());
        assertEquals("john", result.username());
        verify(postRepository).save(any(Post.class));
    }

    // ---------------------------
    // GET POST FOR EDIT
    // ---------------------------

    @Test
    void shouldThrowWhenPostNotFoundForEdit() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> postService.getPostForEdit(1L));
    }

    @Test
    void shouldReturnPostForEdit() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        PostResponseDTO result = postService.getPostForEdit(1L);

        assertEquals("My Post", result.title());
    }

    // ---------------------------
    // UPDATE
    // ---------------------------

    @Test
    void shouldThrowWhenUpdatingNonExistingPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> postService.Update(1L, dto));
    }

    @Test
    void shouldThrowWhenStatusIsInvalid() {
        PostRequestDTO invalidDto = new PostRequestDTO(
                "My Post",
                "Content",
                "INVALID",
                null,
                List.of(1L)
        );

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        assertThrows(BadRequestException.class,
                () -> postService.Update(1L, invalidDto));
    }

    @Test
    void shouldUpdatePostSuccessfully() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(categoryRepository.findAllById(List.of(1L))).thenReturn(List.of(category));
        when(postRepository.save(any())).thenReturn(post);

        PostResponseDTO result = postService.Update(1L, dto);

        assertEquals("My Post", result.title());
        assertEquals("PUBLISHED", result.status());
        verify(postRepository).save(post);
    }

    // ---------------------------
    // DELETE
    // ---------------------------

    @Test
    void shouldThrowWhenDeletingNonExistingPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> postService.delete(1L));
    }

    @Test
    void shouldDeletePostSuccessfully() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        postService.delete(1L);

        verify(postRepository).delete(post);
    }

    // ---------------------------
    // GET POSTS BY USER
    // ---------------------------

    @Test
    void shouldReturnPostsByUser() {
        when(postRepository.findByAuthorId(10L)).thenReturn(List.of(post));

        List<PostResponseDTO> result = postService.getPostsByUser(user);

        assertEquals(1, result.size());
        assertEquals("My Post", result.getFirst().title());
    }

    // ---------------------------
    // FIND ALL PUBLISHED
    // ---------------------------

    @Test
    void shouldReturnAllPublishedPosts() {
        when(postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED))
                .thenReturn(List.of(post));

        List<PostResponseDTO> result = postService.findAllByStatusOrderByCreatedAtDesc();

        assertEquals(1, result.size());
        assertEquals("My Post", result.getFirst().title());
    }

    // ---------------------------
    // FIND BY ID
    // ---------------------------

    @Test
    void shouldThrowWhenPostNotFoundById() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> postService.findById(1L));
    }

    @Test
    void shouldReturnPostById() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        PostResponseDTO result = postService.findById(1L);

        assertEquals("My Post", result.title());
    }
}

