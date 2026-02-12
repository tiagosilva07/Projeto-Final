package pt.tiago.blog.unit.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pt.tiago.blog.Dtos.UserRequestDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.exceptions.BadRequestException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.UserRepository;
import pt.tiago.blog.services.UserServiceImpl;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    private User userEntity;
    private UserRequestDTO userRequestDTO;
    private UserRequestDTO invalidNameUserRequestDTO;
    private UserRequestDTO invalidEmailUserRequestDTO;

    @BeforeEach
    void setup() {
        Person personEntity = new Person("John Doe", "john@mail.com");
        personEntity.setId(10L);

        userEntity = new User("john", "pass", null);
        userEntity.setId(1L);
        userEntity.setPerson(personEntity);
        userEntity.setPosts(List.of());
        userEntity.setComments(List.of());

        userRequestDTO = new UserRequestDTO(
                "John Updated",
                "updated@mail.com"
        );

        invalidNameUserRequestDTO = new UserRequestDTO(
                "",
                "john@mail.com"
        );

        invalidEmailUserRequestDTO = new UserRequestDTO(
                "John Doe",
                ""
        );
    }

    // ---------------------------
    // FIND USER BY ID
    // ---------------------------

    @Test
    void shouldThrowWhenUserNotFoundById() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.findUserById(1L));
    }

    @Test
    void shouldReturnUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(userEntity));

        UserResponseDTO result = userService.findUserById(1L);

        assertEquals("john", result.username());
        assertEquals("John Doe", result.name());
    }

    // ---------------------------
    // UPDATE USER
    // ---------------------------

    @Test
    void shouldThrowWhenUpdatingNonExistingUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.updateUser(userRequestDTO, userEntity));
    }

    @Test
    void shouldUpdateUserSuccessfully() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(userEntity));
        when(userRepository.save(any())).thenReturn(userEntity);

        UserResponseDTO result = userService.updateUser(userRequestDTO, userEntity);

        assertEquals("John Updated", result.name());
        assertEquals("updated@mail.com", result.email());
        verify(userRepository).save(userEntity);
    }

    @Test
    void shouldThrowWhenNameIsBlank() {
        assertThrows(BadRequestException.class,
                () -> userService.updateUser(invalidNameUserRequestDTO, userEntity));
    }

    @Test
    void shouldThrowWhenEmailIsBlank() {
        assertThrows(BadRequestException.class,
                () -> userService.updateUser(invalidEmailUserRequestDTO, userEntity));
    }

    // ---------------------------
    // FIND USER BY USERNAME
    // ---------------------------

    @Test
    void shouldThrowWhenUsernameNotFound() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.findUserByUsername("john"));
    }

    @Test
    void shouldReturnUserByUsername() {
        when(userRepository.findByUserName("john")).thenReturn(Optional.of(userEntity));

        User result = userService.findUserByUsername("john");

        assertEquals("john", result.getUserName());
    }

    // ---------------------------
    // DELETE USER
    // ---------------------------

    @Test
    void shouldDeleteUser() {
        userService.delete(userEntity);
        verify(userRepository).delete(userEntity);
    }
}

