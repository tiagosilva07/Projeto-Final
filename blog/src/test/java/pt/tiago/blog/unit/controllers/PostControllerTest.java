package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pt.tiago.blog.Dtos.*;
import pt.tiago.blog.configurations.UserDetailsImpl;
import pt.tiago.blog.controllers.PostController;
import pt.tiago.blog.guards.AuthPermissionSecurity;
import pt.tiago.blog.models.User;
import pt.tiago.blog.services.CommentService;
import pt.tiago.blog.services.JwtService;
import pt.tiago.blog.services.PostService;
import pt.tiago.blog.utils.WithMockUserDetailsImpl;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
@AutoConfigureMockMvc(addFilters = false)
@EnableMethodSecurity(prePostEnabled = true)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PostService postService;

    @MockitoBean
    private CommentService commentService;

    @MockitoBean(name = "auth")
    private AuthPermissionSecurity authPermissionSecurity;

    @MockitoBean
    private JwtService jwtService;

    private static final String VALID_POST_JSON = """
        {
            "title": "My Post",
            "content": "Some content",
            "categoryIds": [1],
            "status": "PUBLISHED"
        }
        """;

    private static final String VALID_COMMENT_JSON = """
        {
            "content": "Nice post!"
        }
        """;


    private PostResponseDTO makePostResponse(){
        return new PostResponseDTO(
                1L,
                "My Post",
                "Some content",
                "2025-01-01",
                "2025-01-02",
                "john",
                "PUBLISHED",
                "https://example.com/image.jpg",
                List.of(),
                List.of()
        );
    }

    private PostResponseDTO makePostUpdateResponse(){
        return new PostResponseDTO(
                1L,
                "Updated Title",
                "Updated content",
                "2025-01-01",
                "2025-01-02",
                "john",
                "PUBLISHED",
                null,
                List.of(),
                List.of()
        );
    }

    // ---------------------------
    // GET ALL POSTS
    // ---------------------------

    @Test
    @WithMockUser
    void shouldReturn200WhenGettingAllPosts() throws Exception {
        when(postService.findAllByStatusOrderByCreatedAtDesc()).thenReturn(List.of());

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk());
    }

    // ---------------------------
    // GET MY POSTS
    // ---------------------------

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldReturn200WhenGettingMyPosts() throws Exception {
        User user = new User("john", "pass", null);
        UserDetailsImpl details = new UserDetailsImpl(user);

        when(postService.getPostsByUser(user)).thenReturn(List.of());

        mockMvc.perform(get("/api/posts/me").principal(() -> "john"))
                .andExpect(status().isOk());
    }

    // ---------------------------
    // CREATE POST
    // ---------------------------

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldCreatePostSuccessfully() throws Exception {
        when(postService.Create(any(), eq("john"))).thenReturn(makePostResponse());

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_POST_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("My Post"));
    }

    // ---------------------------
    // UPDATE POST
    // ---------------------------

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldReturn403WhenUserCannotEditPost() throws Exception {
        when(authPermissionSecurity.canEditPost(1L)).thenReturn(false);

        mockMvc.perform(put("/api/posts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_POST_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldUpdatePostSuccessfully() throws Exception {
        when(authPermissionSecurity.canEditPost(1L)).thenReturn(true);
        when(postService.Update(eq(1L), any())).thenReturn(makePostUpdateResponse());

        mockMvc.perform(put("/api/posts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_POST_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    // ---------------------------
    // GET POST FOR EDIT
    // ---------------------------

    @Test
    @WithMockUser(username = "john")
    void shouldReturn403WhenUserCannotAccessPostForEdit() throws Exception {
        when(authPermissionSecurity.canEditPost(1L)).thenReturn(false);

        mockMvc.perform(get("/api/posts/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john")
    void shouldReturnPostForEdit() throws Exception {
        when(authPermissionSecurity.canEditPost(1L)).thenReturn(true);

        when(postService.getPostForEdit(1L)).thenReturn(makePostResponse());

        mockMvc.perform(get("/api/posts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("My Post"));
    }

    // ---------------------------
    // DELETE POST
    // ---------------------------

    @Test
    @WithMockUser(username = "john")
    void shouldReturn403WhenUserCannotDeletePost() throws Exception {
        when(authPermissionSecurity.canEditPost(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/posts/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john")
    void shouldDeletePostSuccessfully() throws Exception {
        when(authPermissionSecurity.canEditPost(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/posts/1"))
                .andExpect(status().isOk());

        verify(postService).delete(1L);
    }

    // ---------------------------
    // ADD COMMENT TO POST
    // ---------------------------

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldAddCommentToPost() throws Exception {
        CommentResponseDTO response = new CommentResponseDTO(
                1L, "Nice post!", "2025-01-01", "2025-01-01",
                "john", 1L, 10L, "PUBLISHED"
        );

        when(commentService.addComment(eq(10L), any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/posts/10/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_COMMENT_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.comment").value("Nice post!"));
    }

    // ---------------------------
    // GET POST COMMENTS
    // ---------------------------

    @Test
    @WithMockUser
    void shouldReturnPostComments() throws Exception {
        when(commentService.getPostComments(10L)).thenReturn(List.of());

        mockMvc.perform(get("/api/posts/10/comments"))
                .andExpect(status().isCreated());
    }

    // ---------------------------
    // DELETE COMMENT
    // ---------------------------

    @Test
    @WithMockUser(username = "john")
    void shouldReturn403WhenUserCannotDeleteComment() throws Exception {
        when(authPermissionSecurity.canDeletePostComment(10L, 5L)).thenReturn(false);

        mockMvc.perform(delete("/api/posts/10/comments/5"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john")
    void shouldDeleteCommentSuccessfully() throws Exception {
        when(authPermissionSecurity.canDeletePostComment(10L, 5L)).thenReturn(true);

        mockMvc.perform(delete("/api/posts/10/comments/5"))
                .andExpect(status().isNoContent());

        verify(commentService).deleteComment(5L);
    }

    // ---------------------------
    // UPDATE COMMENT
    // ---------------------------

    @Test
    @WithMockUser(username = "john")
    void shouldReturn403WhenUserCannotEditComment() throws Exception {
        when(authPermissionSecurity.canEditComment(5L)).thenReturn(false);

        mockMvc.perform(put("/api/posts/10/comments/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_COMMENT_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john")
    void shouldUpdateCommentSuccessfully() throws Exception {
        when(authPermissionSecurity.canEditComment(5L)).thenReturn(true);

        CommentResponseDTO response = new CommentResponseDTO(
                5L, "Updated", "2025-01-01", "2025-01-02",
                "john", 1L, 10L, "PUBLISHED"
        );

        when(commentService.updateComment(eq(5L), any())).thenReturn(response);

        mockMvc.perform(put("/api/posts/10/comments/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_COMMENT_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comment").value("Updated"));
    }
}

