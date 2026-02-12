package pt.tiago.blog.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import pt.tiago.blog.Dtos.CategoryRequestDTO;
import pt.tiago.blog.Dtos.CategoryResponseDTO;
import pt.tiago.blog.services.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Category Management", description = "To be used by ADMIN role only")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController{

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Operation(summary = "Create Category", description = "Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/categories")
    public ResponseEntity<?> create(@Valid @RequestBody CategoryRequestDTO category) {
        categoryService.create(category);
        return new ResponseEntity<>(category, HttpStatus.CREATED);
    }
    @Operation(summary = "Create Bulk Categories", description = "Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/categories/bulk")
    public ResponseEntity<List<CategoryResponseDTO>> create(@Valid @RequestBody List<CategoryRequestDTO> categories) {
        var result = categoryService.createBulk(categories);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
    @Operation(summary = "Get All Categories")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return new ResponseEntity<>(categoryService.finAll(), HttpStatus.OK);
    }
    @Operation(summary = "Get Category by Id", description = "Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable Long id) {
        return new ResponseEntity<>(categoryService.findById(id), HttpStatus.OK);
    }

    @Operation(summary = "Update Category by Id", description = "Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryResponseDTO> update(@PathVariable Long id, @Valid @RequestBody CategoryRequestDTO category) {
        return new ResponseEntity<>(categoryService.update(id,category), HttpStatus.OK);
    }

    @Operation(summary = "Delete Category by Id", description = "Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
