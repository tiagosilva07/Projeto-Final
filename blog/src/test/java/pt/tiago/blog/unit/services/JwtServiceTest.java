package pt.tiago.blog.unit.services;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.Role;
import pt.tiago.blog.models.User;
import pt.tiago.blog.services.JwtTokenImpl;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtTokenImpl jwtService;
    private User user;

    @BeforeEach
    void setup() {
        jwtService = new JwtTokenImpl();

        Person person = new Person("John Doe", "john@mail.com");
        person.setId(10L);

        user = new User("john", "pass", person);
        user.setId(1L);
        user.setRole(Role.USER);
    }

    // ---------------------------
    // TOKEN GENERATION
    // ---------------------------

    @Test
    void shouldGenerateValidToken() {
        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void shouldContainCorrectClaims() {
        String token = jwtService.generateToken(user);

        String username = jwtService.extractUser(token);
        assertEquals("john", username);

        var claims = extractClaims(token);

        assertEquals("John Doe", claims.get("name"));
        assertEquals("john@mail.com", claims.get("email"));
        assertEquals("USER", claims.get("role"));
    }

    // ---------------------------
    // TOKEN VALIDATION
    // ---------------------------

    @Test
    void shouldValidateTokenSuccessfully() {
        String token = jwtService.generateToken(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("john")
                .password("pass")
                .roles("USER")
                .build();

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void shouldInvalidateTokenWithWrongUsername() {
        String token = jwtService.generateToken(user);

        UserDetails wrongUser = org.springframework.security.core.userdetails.User
                .withUsername("wrong")
                .password("pass")
                .roles("USER")
                .build();

        assertFalse(jwtService.isTokenValid(token, wrongUser));
    }

    // ---------------------------
    // EXPIRATION
    // ---------------------------

    @Test
    void shouldDetectExpiredToken() {
        String expiredToken = generateExpiredToken();
        assertTrue(jwtService.isTokenExpired(expiredToken));
    }

    // ---------------------------
    // REFRESH TOKEN
    // ---------------------------

    @Test
    void shouldGenerateRefreshToken() {
        String token = jwtService.refreshToken(user);

        assertNotNull(token);
        assertFalse(token.isBlank());

        String username = jwtService.extractUser(token);
        assertEquals("john", username);
    }

    // ---------------------------
    // INVALID TOKEN
    // ---------------------------

    @Test
    void shouldThrowExceptionForInvalidToken() {
        String invalidToken = "invalid.token.value";

        assertThrows(Exception.class, () -> jwtService.extractUser(invalidToken));
    }

    // ---------------------------
    // HELPERS
    // ---------------------------

    private String generateExpiredToken() {
        return io.jsonwebtoken.Jwts.builder()
                .setSubject("john")
                .setExpiration(new Date(System.currentTimeMillis() - 1000))
                .signWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                        "a8f3c9e1b7d4a6c2f1e9d8b3a4c5e7f2d1c6b8a9f4d2c3e1b7a9d6f3c2e8b1".getBytes()
                ), io.jsonwebtoken.SignatureAlgorithm.HS256)
                .compact();
    }


    private io.jsonwebtoken.Claims extractClaims(String token) {
        return io.jsonwebtoken.Jwts.parserBuilder()
                .setSigningKey("a8f3c9e1b7d4a6c2f1e9d8b3a4c5e7f2d1c6b8a9f4d2c3e1b7a9d6f3c2e8b1".getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
