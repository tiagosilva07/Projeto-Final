package pt.tiago.blog.Dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PostRequestDTO(
        @NotBlank(message = "Title is required")
        @Size(min = 3 , max = 500)
        String title,
        @NotBlank(message = "Content is required")
        String content,
        @NotBlank(message = "Status ir required")
        String status,
        String imageUrl,
        @NotNull(message = "A post must have one or more categories associated")
        List<Long> categoryIds
) { }
