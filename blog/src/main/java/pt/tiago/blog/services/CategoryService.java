package pt.tiago.blog.services;

import pt.tiago.blog.Dtos.CategoryRequestDTO;
import pt.tiago.blog.Dtos.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    boolean create(CategoryRequestDTO category);
    void delete(Long id);
    CategoryResponseDTO update(Long id,CategoryRequestDTO category);
    List<CategoryResponseDTO> findAll();
    List<CategoryResponseDTO> createBulk(List<CategoryRequestDTO> categories);
    CategoryResponseDTO findById(Long id);
}
