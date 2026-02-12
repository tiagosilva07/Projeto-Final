package pt.tiago.blog.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import pt.tiago.blog.models.User;

import java.util.Date;

@Service
public class JwtTokenImpl implements JwtService{
    private static final String SECRET_KEY = "a8f3c9e1b7d4a6c2f1e9d8b3a4c5e7f2d1c6b8a9f4d2c3e1b7a9d6f3c2e8b1";

    @Override
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUserName())
                .claim("name",user.getPerson().getName())
                .claim("email",user.getPerson().getEmail())
                .claim("role",user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()),SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public String refreshToken(User user) {
        return Jwts.builder() .setSubject(user.getUserName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7 days
        .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256) .compact();
    }

    @Override
    public String extractUser(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUser(token);
        return username.equals(userDetails.getUsername() ) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        try {
            return getClaimsFromToken(token).getExpiration().before(new Date());
        }catch (ExpiredJwtException e){
            return true;
        }
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
