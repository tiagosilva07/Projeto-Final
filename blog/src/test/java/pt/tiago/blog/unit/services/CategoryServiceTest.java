package pt.tiago.blog.unit.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pt.tiago.blog.Dtos.CategoryRequestDTO;
import pt.tiago.blog.Dtos.CategoryResponseDTO;
import pt.tiago.blog.exceptions.ConflictException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.models.Category;
import pt.tiago.blog.repositories.CategoryRepository;
import pt.tiago.blog.services.CategoryServiceImpl;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    private CategoryRequestDTO validDto;
    private CategoryRequestDTO validDto2;
    private Category categoryEntity;
    private Category categoryEntity2;

    @BeforeEach
    void setup() {
        validDto = new CategoryRequestDTO("Tech", "Technology related content");
        validDto2 = new CategoryRequestDTO("Games", "Gaming related content");

        categoryEntity = new Category("Tech", "Technology related content");
        categoryEntity2 = new Category("Games", "Gaming related content");
    }

    // ---------------------------
    // CREATE
    // ---------------------------

    @Test
    void shouldThrowConflictWhenCategoryAlreadyExists() {
        when(categoryRepository.existsByName("Tech")).thenReturn(true);

        ConflictException ex = assertThrows(
                ConflictException.class,
                () -> categoryService.create(validDto)
        );

        assertEquals("Category already exists", ex.getMessage());
    }

    @Test
    void shouldCreateCategorySuccessfully() {
        when(categoryRepository.existsByName("Tech")).thenReturn(false);

        boolean result = categoryService.create(validDto);

        assertTrue(result);
        verify(categoryRepository).save(any(Category.class));
    }

    // ---------------------------
    // BULK CREATE
    // ---------------------------

    @Test
    void shouldCreateBulkSuccessfully() {
        List<CategoryRequestDTO> dtos = List.of(validDto, validDto2);
        List<Category> savedEntities = List.of(categoryEntity, categoryEntity2);

        when(categoryRepository.saveAll(any())).thenReturn(savedEntities);

        List<CategoryResponseDTO> result = categoryService.createBulk(dtos);

        assertEquals(2, result.size());
        assertEquals("Tech", result.get(0).name());
        assertEquals("Games", result.get(1).name());
    }

    // ---------------------------
    // FIND ALL
    // ---------------------------

    @Test
    void shouldReturnAllCategories() {
        when(categoryRepository.findAll()).thenReturn(List.of(categoryEntity, categoryEntity2));

        List<CategoryResponseDTO> result = categoryService.findAll();

        assertEquals(2, result.size());
        assertEquals("Tech", result.get(0).name());
    }

    // ---------------------------
    // FIND BY ID
    // ---------------------------

    @Test
    void shouldThrowNotFoundWhenCategoryDoesNotExist() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.findById(1L));
    }

    @Test
    void shouldReturnCategoryById() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(categoryEntity));

        CategoryResponseDTO result = categoryService.findById(1L);

        assertEquals("Tech", result.name());
        assertEquals("Technology related content", result.description());
    }

    // ---------------------------
    // UPDATE
    // ---------------------------

    @Test
    void shouldThrowNotFoundWhenUpdatingNonExistingCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.update(1L, validDto));
    }

    @Test
    void shouldUpdateCategorySuccessfully() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(categoryEntity));

        CategoryResponseDTO result = categoryService.update(1L, validDto2);

        assertEquals("Games", result.name());
        assertEquals("Gaming related content", result.description());
    }

    // ---------------------------
    // DELETE
    // ---------------------------

    @Test
    void shouldThrowNotFoundWhenDeletingNonExistingCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.delete(1L));
    }

    @Test
    void shouldDeleteCategorySuccessfully() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(categoryEntity));

        categoryService.delete(1L);

        verify(categoryRepository).delete(categoryEntity);
    }
}