package pt.tiago.blog.Dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequestDTO(
        @NotBlank(message = "Category name is required")
        @Size(min = 3, max = 100)
        String name,
        @NotBlank(message = "Description is required")
        @Size(min = 3, max = 255)
        String description
) {
}
