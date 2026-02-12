package pt.tiago.blog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.tiago.blog.models.Comment;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository  extends JpaRepository<Comment, Long> {
   Optional<List<Comment>> findByPostIdOrderByCreatedAtAsc(Long postId);
   List<Comment> findTop10ByOrderByCreatedAtDesc();
}
