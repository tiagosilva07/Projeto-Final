package pt.tiago.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.tiago.blog.models.Category;
import pt.tiago.blog.models.Post;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
    
    @Query(""" 
SELECT c.posts FROM Category c WHERE c.id = :id
""")
    List<Post> findPostsByCategoryId(Long id);
}
