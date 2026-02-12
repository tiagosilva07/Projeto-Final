package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pt.tiago.blog.Dtos.LoginResponseDTO;
import pt.tiago.blog.controllers.AuthController;
import pt.tiago.blog.exceptions.UnauthorizedException;
import pt.tiago.blog.services.AuthService;
import pt.tiago.blog.services.JwtService;
import pt.tiago.blog.services.UserService;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerLoginTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    private static final String VALID_LOGIN_JSON = """
        {
            "username": "john",
            "password": "password123"
        }
        """;

    // -------------------------
    // LOGIN SUCCESS
    // -------------------------

    @Test
    void shouldReturn200WhenCredentialsAreValid() throws Exception {
        LoginResponseDTO response = new LoginResponseDTO("fake-jwt", "fake-refresh", "john");

        when(authService.login(any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_LOGIN_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt"))
                .andExpect(jsonPath("$.refreshToken").value("fake-refresh"))
                .andExpect(jsonPath("$.username").value("john"));
    }

    // -------------------------
    // LOGIN INVALID CREDENTIALS
    // -------------------------

    @Test
    void shouldReturn401WhenCredentialsAreInvalid() throws Exception {
        when(authService.login(any()))
                .thenThrow(new UnauthorizedException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_LOGIN_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    // -------------------------
    // VALIDATION TESTS
    // -------------------------

    @Test
    void shouldReturn400WhenUsernameMissing() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "password": "password123"
                            }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.username").value("Username is required"));
    }

    @Test
    void shouldReturn400WhenPasswordMissing() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "username": "john"
                            }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password is required"));
    }

    @Test
    void shouldReturn400WhenUsernameEmpty() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "username": "",
                                "password": "password123"
                            }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.username").value("Username is required"));
    }

    @Test
    void shouldReturn400WhenPasswordEmpty() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "username": "john",
                                "password": ""
                            }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password is required"));
    }
}
