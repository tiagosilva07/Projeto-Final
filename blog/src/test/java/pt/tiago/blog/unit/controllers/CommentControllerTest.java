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
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.controllers.CommentController;
import pt.tiago.blog.guards.AuthPermissionSecurity;
import pt.tiago.blog.services.CommentService;
import pt.tiago.blog.services.JwtService;


import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
@EnableMethodSecurity(prePostEnabled = true)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommentService commentService;

    @MockitoBean(name = "auth")
    private AuthPermissionSecurity authPermissionSecurity;

    @MockitoBean
    private JwtService jwtService;

    private static final String VALID_COMMENT_JSON = """
            {
                "content": "Updated comment"
            }
            """;

    // ---------------------------
    // GET ALL COMMENTS (ADMIN)
    // ---------------------------

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserIsNotAdmin() throws Exception {
        mockMvc.perform(get("/api/comments"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturn200WhenAdminGetsAllComments() throws Exception {
        when(commentService.getAllComments()).thenReturn(List.of());

        mockMvc.perform(get("/api/comments"))
                .andExpect(status().isOk());
    }

    // ---------------------------
    // UPDATE COMMENT
    // ---------------------------

    @Test
    @WithMockUser(username = "john", roles = "USER")
    void shouldReturn403WhenUserCannotEditComment() throws Exception {
        when(authPermissionSecurity.canEditComment(1L)).thenReturn(false);

        mockMvc.perform(put("/api/comments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_COMMENT_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john", roles = "USER")
    void shouldReturn200WhenUserCanEditComment() throws Exception {
        when(authPermissionSecurity.canEditComment(1L)).thenReturn(true);
        when(commentService.updateComment(eq(1L), any())).thenReturn(
                new CommentResponseDTO(
                        1L,
                        "Updated comment",
                        "2025-01-01T10:00:00",
                        "2025-01-01T10:00:00",
                        "jonh",
                        10L,
                        100L,
                        "PUBLISHED")
        );

        mockMvc.perform(put("/api/comments/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_COMMENT_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comment").value("Updated comment"));
    }

    // ---------------------------
    // DELETE COMMENT
    // ---------------------------

    @Test
    @WithMockUser(username = "john", roles = "USER")
    void shouldReturn403WhenUserCannotDeleteComment() throws Exception {
        when(authPermissionSecurity.canEditComment(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/comments/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "john", roles = "USER")
    void shouldReturn204WhenUserCanDeleteComment() throws Exception {
        when(authPermissionSecurity.canEditComment(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/comments/1"))
                .andExpect(status().isNoContent());

        verify(commentService).deleteComment(1L);
    }
}
