package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pt.tiago.blog.controllers.AuthController;
import pt.tiago.blog.models.User;
import pt.tiago.blog.services.AuthService;
import pt.tiago.blog.services.JwtService;
import pt.tiago.blog.services.UserService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerRefreshTokenTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private UserService userService;
    @MockitoBean
    private AuthService authService;
    @MockitoBean
    private JwtService jwtService;

    @Test
    void shouldReturn400WhenRefreshTokenIsMissing() throws Exception {
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Refresh token is null"));
    }

    @Test
    void shouldReturn401WhenRefreshTokenIsInvalid() throws Exception {
        String refreshToken = "invalid-token";

        when(jwtService.extractUser(refreshToken)).thenReturn("john");
        when(userService.findUserByUsername("john")).thenReturn(new User("john", "pass", null));
        when(jwtService.isTokenValid(eq(refreshToken), any())).thenReturn(false);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        { "refreshToken": "invalid-token" }
                    """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid refresh token"));
    }

    @Test
    void shouldReturn200WhenRefreshTokenIsValid() throws Exception {
        String refreshToken = "valid-refresh-token";
        String newAccessToken = "new-access-token";

        User user = new User("john", "pass", null);

        when(jwtService.extractUser(refreshToken)).thenReturn("john");
        when(userService.findUserByUsername("john")).thenReturn(user);
        when(jwtService.isTokenValid(eq(refreshToken), any())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn(newAccessToken);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        { "refreshToken": "valid-refresh-token" }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("new-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("valid-refresh-token"))
                .andExpect(jsonPath("$.username").value("john"));
    }
}
