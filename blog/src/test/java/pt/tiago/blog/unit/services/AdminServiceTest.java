package pt.tiago.blog.unit.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.Role;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.UserRepository;
import pt.tiago.blog.services.AdminServiceImpl;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @InjectMocks
    private AdminServiceImpl adminService;
    @Mock
    private UserRepository userRepository;

    private User userEntity;
    @BeforeEach
    public void setUp() {
        userEntity = new User(
                "john",
                "password123",
                new Person(
                        "Jonh Doe",
                        "john@mail.com")
        );
    }
    @Test
    void promoteUserShouldReturnIllegalArgumentExceptionWhenIdIsInvalid(){
        assertThrows(IllegalArgumentException.class, () -> {
           adminService.promoteUserToAdmin(0L);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            adminService.promoteUserToAdmin(-1L);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            adminService.promoteUserToAdmin(null);
        });
    }

    @Test
    void promoteUserToAdminShouldThrowNotFoundExceptionWhenUserDoesNotExist(){
        Mockito.when(userRepository.findById(Mockito.anyLong()))
                .thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> {
            adminService.promoteUserToAdmin(3L);
        });
    }

    @Test
    void promoteUserToAdminShouldThrowConflictWhenUserAlreadyAdmin(){
        userEntity.setRole(Role.ADMIN);

        Mockito.when(userRepository.findById(5L))
                .thenReturn(Optional.of(userEntity));

        assertThrows(IllegalStateException.class, () -> {
            adminService.promoteUserToAdmin(5L);
        });
    }


    @Test
    void promoteUserToAdminShouldPromoteUserToAdmin(){
        userEntity.setRole(Role.USER);
        Mockito.when(userRepository.findById(5L))
                .thenReturn(Optional.of(userEntity));

        adminService.promoteUserToAdmin(5L);
        assertEquals(Role.ADMIN,userEntity.getRole());
        Mockito.verify(userRepository).save(userEntity);
    }

    @Test
    void demoteAdminToUserShouldThrowConflictWhenUserAlreadyUser(){
        userEntity.setRole(Role.USER);

        Mockito.when(userRepository.findById(5L))
                .thenReturn(Optional.of(userEntity));

        assertThrows(IllegalStateException.class, () -> {
            adminService.demoteAdminToUser(5L);
        });
    }

    @Test
    void demoteAdminToUserShouldDemoteAdminToUser(){
        userEntity.setRole(Role.ADMIN);
        Mockito.when(userRepository.findById(5L))
                .thenReturn(Optional.of(userEntity));

        adminService.demoteAdminToUser(5L);
        assertEquals(Role.USER,userEntity.getRole());
        Mockito.verify(userRepository).save(userEntity);
    }
}
