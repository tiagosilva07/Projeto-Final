package pt.tiago.blog.Dtos;

public record LoginResponseDTO(
        String token,
        String refreshToken,
        String username
) {
}
