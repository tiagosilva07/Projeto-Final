package pt.tiago.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.PostStatus;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("""
    SELECT p FROM Post p
    JOIN FETCH p.author
    WHERE p.author.id = :id
""")
    List<Post> findByAuthorId(@Param("id")Long id);
    List<Post> findByStatusOrderByCreatedAtDesc(PostStatus status);
    List<Post> findTop10ByOrderByCreatedAtDesc();
}
