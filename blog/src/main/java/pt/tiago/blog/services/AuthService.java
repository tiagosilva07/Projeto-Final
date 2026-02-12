package pt.tiago.blog.services;

import pt.tiago.blog.Dtos.LoginRequestDTO;
import pt.tiago.blog.Dtos.LoginResponseDTO;
import pt.tiago.blog.Dtos.UserRegistrationDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO dto);
    void register(UserRegistrationDTO user);
}
