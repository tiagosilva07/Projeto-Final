package pt.tiago.blog.Dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequestDTO(
        @NotBlank(message = "Comment cannot be empty")
        @Size(min= 3 , max = 500)
        String content
) {
}
