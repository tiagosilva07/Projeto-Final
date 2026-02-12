package pt.tiago.blog.unit.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pt.tiago.blog.Dtos.LoginRequestDTO;
import pt.tiago.blog.Dtos.LoginResponseDTO;
import pt.tiago.blog.Dtos.UserRegistrationDTO;
import pt.tiago.blog.exceptions.ConflictException;
import pt.tiago.blog.exceptions.UnauthorizedException;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.Role;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.PersonRepository;
import pt.tiago.blog.repositories.UserRepository;
import pt.tiago.blog.services.AuthServiceImpl;
import pt.tiago.blog.services.JwtService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PersonRepository personRepository;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private JwtService jwtService;

    private UserRegistrationDTO validUserDto;
    private LoginRequestDTO validLoginDto;
    private User userEntity;
    // ---------------------------
    // REGISTER TESTS
    // ---------------------------

    @BeforeEach
    public void setUp() {
        validUserDto = new UserRegistrationDTO(
                "john",
                "password123",
                "John Doe",
                "john@mail.com");
        validLoginDto = new LoginRequestDTO("john", "password123");
        userEntity = new User("john", "encodedPassword", new Person("Jonh Doe", "john@mail.com"));
    }

    @Test
    void shouldThrowConflictExceptionIfUserNameExists() {

        when(userRepository.existsByUserName(userEntity.getUserName())).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.register(validUserDto));

        assertEquals("Username is already taken", ex.getMessage());
    }

    @Test
    void shouldThrowConflictExceptionIfEmailExists() {

        when(personRepository.existsByEmail(userEntity.getPerson().getEmail())).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.register(validUserDto));

        assertEquals("Email is already taken", ex.getMessage());
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        when(userRepository.existsByUserName(userEntity.getUserName())).thenReturn(false);
        when(personRepository.existsByEmail(userEntity.getPerson().getEmail())).thenReturn(false);
        when(encoder.encode("password123")).thenReturn("encodedPassword");

        authService.register(validUserDto);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        User saved = captor.getValue();

        assertEquals("john", saved.getUserName());
        assertEquals("encodedPassword", saved.getPassword());
        assertEquals("John Doe", saved.getPerson().getName());
        assertEquals("john@mail.com", saved.getPerson().getEmail());
        assertEquals(Role.USER, saved.getRole());
    }

    // ---------------------------
    // LOGIN TESTS
    // ---------------------------

    @Test
    void shouldThrowUnauthorizedWhenUserNotFound() {
        when(userRepository.findByUserName(userEntity.getUserName())).thenReturn(Optional.empty());

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(validLoginDto));

        assertEquals("Invalid Credentials", ex.getMessage());
    }

    @Test
    void shouldThrowUnauthorizedWhenPasswordDoesNotMatch() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.of(userEntity));
        when(encoder.matches("password123", "encodedPassword")).thenReturn(false);

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(validLoginDto));

        assertEquals("Invalid Credentials!", ex.getMessage());
    }

    @Test
    void shouldLoginSuccessfully() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.of(userEntity));
        when(encoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(userEntity)).thenReturn("token123");
        when(jwtService.refreshToken(userEntity)).thenReturn("refresh123");

        LoginResponseDTO response = authService.login(validLoginDto);

        assertEquals("token123", response.token());
        assertEquals("refresh123", response.refreshToken());
        assertEquals("john", response.username());
    }
}
