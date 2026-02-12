package pt.tiago.blog.services;

import pt.tiago.blog.Dtos.UserRegistrationDTO;
import pt.tiago.blog.Dtos.UserRequestDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.User;

public interface UserService {
    void delete(User user);
    User findUserByUsername(String username);
    UserResponseDTO findUserById(Long id);
    UserResponseDTO updateUser(UserRequestDTO dto, User user);
}
