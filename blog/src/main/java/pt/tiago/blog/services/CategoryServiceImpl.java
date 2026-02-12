package pt.tiago.blog.services;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import pt.tiago.blog.Dtos.CategoryRequestDTO;
import pt.tiago.blog.Dtos.CategoryResponseDTO;
import pt.tiago.blog.exceptions.ConflictException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.mappers.CategoryMapper;
import pt.tiago.blog.models.Category;
import pt.tiago.blog.repositories.CategoryRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    @Override
    public boolean create(CategoryRequestDTO category) {
        if (categoryRepository.existsByName(category.name())) {
            throw new ConflictException("Category already exists");
        }

        Category c = new Category(category.name(), category.description());
        categoryRepository.save(c);
        return true;
    }

    @Override
    public List<CategoryResponseDTO> createBulk(List<CategoryRequestDTO> dtos) {
        List<Category> categoriesToCreate = dtos.stream()
                .map(CategoryMapper::toDomain).toList();
        List<Category> saved = categoryRepository.saveAll(categoriesToCreate);

        return saved.stream()
                .map(CategoryMapper::toDTO)
                .toList();
    }

    @GetMapping
    public List<CategoryResponseDTO> finAll() {

        var list = categoryRepository.findAll()
                .stream()
                .map(CategoryMapper::toDTO).toList();
        return list;
    }

    @Override
    public void delete(Long id) {
        var find = categoryRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(find);
    }

    @Override
    public CategoryResponseDTO update(Long id ,CategoryRequestDTO category) {
        var categoryToUpdate = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        categoryToUpdate.setName(category.name());
        categoryToUpdate.setDescription(category.description());
        categoryRepository.save(categoryToUpdate);

        return CategoryMapper.toDTO(categoryToUpdate);
    }

    @Override
    public CategoryResponseDTO findById(Long id){
        var foundCategory = categoryRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Category not found"));

        return CategoryMapper.toDTO(foundCategory);
    }
}
