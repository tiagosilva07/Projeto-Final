package pt.tiago.blog.mappers;

import pt.tiago.blog.Dtos.CategoryRequestDTO;
import pt.tiago.blog.Dtos.CategoryResponseDTO;
import pt.tiago.blog.models.Category;

import java.util.ArrayList;

public class CategoryMapper {

    public static CategoryResponseDTO toDTO(Category category){
        if(category == null){
            return null;
        }
        return new CategoryResponseDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public static Category toDomain(CategoryRequestDTO dto){
        if(dto == null){
            return null;
        }
        Category category = new Category();
        category.setName(dto.name());
        category.setDescription(dto.description());
        return category;
    }
}
