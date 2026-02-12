package pt.tiago.blog.services;

import org.springframework.security.core.userdetails.UserDetails;
import pt.tiago.blog.Dtos.PostRequestDTO;
import pt.tiago.blog.Dtos.PostResponseDTO;
import pt.tiago.blog.configurations.UserDetailsImpl;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.PostStatus;
import pt.tiago.blog.models.User;

import java.util.List;

public interface PostService {
    PostResponseDTO Create(PostRequestDTO post, String username);
    PostResponseDTO Update(Long id, PostRequestDTO dto);
    PostResponseDTO getPostForEdit(Long id);
    void delete(Long id);
    PostResponseDTO findById(Long id);
    List<PostResponseDTO> getPostsByUser(User user);
    List<PostResponseDTO> findAllByStatusOrderByCreatedAtDesc();
}
