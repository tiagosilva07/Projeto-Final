package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pt.tiago.blog.controllers.AuthController;
import pt.tiago.blog.services.AuthService;
import pt.tiago.blog.services.JwtService;
import pt.tiago.blog.services.UserService;



import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerRegisterTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private UserService userService;
    @MockitoBean
    private AuthService authService;
    @MockitoBean
    private JwtService jwtService;

    @Test
    void shouldReturn201WhenValidRequest() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username":"jonh",
                            "email":"john@mail.com",
                            "password":"password123",
                            "name":"John Doe"
                        }
                    """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("User created successfully"));
    }

    @Test
    void shouldReturn400WhenPasswordTooShort() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username":"jonh",
                            "email":"john@mail.com",
                            "password":"pass",
                            "name":"John Doe"
                        }
                    """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Password must have at least 6 characters"));
    }

    @Test
    void shouldReturn400WhenRequestIsEmpty() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturn400WhenUsernameEmpty() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username":"",
                            "email":"john@mail.com",
                            "password":"password123",
                            "name":"John Doe"
                        }
                    """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.username").value("Username is required"));
    }

    @Test
    void shouldReturn400WhenEmailInvalid() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username":"jonh",
                            "email":"johnmail",
                            "password":"password123",
                            "name":"John Doe"
                        }
                    """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Invalid email format"));
    }

    @Test
    void shouldReturn400WhenEmailEmpty() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username":"jonh",
                            "email":"",
                            "password":"password123",
                            "name":"John Doe"
                        }
                    """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is required"));
    }

    @Test
    void shouldReturn400WhenNameEmpty() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                            "username":"jonh",
                            "email":"john@mail.com",
                            "password":"password123",
                            "name":""
                        }
                    """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("Name is required"));
    }
}