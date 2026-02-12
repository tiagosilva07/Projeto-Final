package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import pt.tiago.blog.Dtos.UserResponseDTO;

import pt.tiago.blog.controllers.UserController;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.User;
import pt.tiago.blog.services.JwtService;
import pt.tiago.blog.services.UserService;
import pt.tiago.blog.utils.WithMockUserDetailsImpl;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@EnableMethodSecurity(prePostEnabled = true)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;

    private static final String VALID_USER_JSON = """
        {
            "name": "John Doe",
            "email": "john@mail.com"
        }
        """;
    private UserResponseDTO userResponseDTO;
    private User userEntity;
    private Person personEntity;

    @BeforeEach
    public void setUp() {

        personEntity = new Person("John Doe", "john@mail.com");
        personEntity.setId(10L);
        userEntity= new User("john", "pass", personEntity);
        userEntity.setId(1L);

        userResponseDTO = new UserResponseDTO(
                1L,
                10L,
                "john",
                "John Doe",
                "john@mail.com",
                List.of(),
                List.of()
        );
    }

    // ---------------------------
    // UPDATE PROFILE
    // ---------------------------

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldUpdateUserProfile() throws Exception {

        when(userService.updateUser(any(), any())).thenReturn(userResponseDTO);

        mockMvc.perform(put("/api/users/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_USER_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john@mail.com"));
    }

    // ---------------------------
    // GET MY PROFILE
    // ---------------------------

    @Test
    @WithMockUserDetailsImpl(username = "john")
    void shouldReturnMyProfile() throws Exception {
        when(userService.findUserById(1L)).thenReturn(userResponseDTO);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"));
    }
}

