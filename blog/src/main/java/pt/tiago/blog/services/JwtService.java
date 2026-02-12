package pt.tiago.blog.services;

import org.springframework.security.core.userdetails.UserDetails;
import pt.tiago.blog.models.User;

public interface JwtService {
    String generateToken(User user);
    String refreshToken(User user);
    String extractUser(String token);
    boolean isTokenValid(String token, UserDetails user);
    boolean isTokenExpired(String token);
}
