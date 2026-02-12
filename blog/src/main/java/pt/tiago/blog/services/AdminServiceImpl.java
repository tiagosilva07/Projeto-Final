package pt.tiago.blog.services;

import org.springframework.stereotype.Service;
import pt.tiago.blog.Dtos.AdminOverviewDTO;
import pt.tiago.blog.Dtos.AdminUserViewDTO;
import pt.tiago.blog.Dtos.RecentActivityDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.mappers.UserMapper;
import pt.tiago.blog.models.Comment;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.Role;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CommentRepository;
import pt.tiago.blog.repositories.PostRepository;
import pt.tiago.blog.repositories.UserRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public AdminServiceImpl(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public AdminOverviewDTO getOverview() {
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();
        long totalUsers = userRepository.count();

        List<RecentActivityDTO> activityDTOList = new ArrayList<>();
        List<Post> postList = postRepository.findTop10ByOrderByCreatedAtDesc();
        List<Comment> commentList = commentRepository.findTop10ByOrderByCreatedAtDesc();

        postList.forEach(post ->
           activityDTOList.add(
                   new RecentActivityDTO(
                           "POST",
                           post.getId(),
                           post.getTitle(),
                           post.getAuthor().getUserName(),
                           post.getCreatedAt().toString()
           )));
        commentList.forEach(comment -> activityDTOList.add(new RecentActivityDTO(
                "COMMENT",
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUserName(),
                comment.getCreatedAt().toString()
        )));

        activityDTOList.sort(Comparator.comparing(RecentActivityDTO::createdAt).reversed());
        return new AdminOverviewDTO(
                totalPosts,
                totalComments,
                totalUsers,
                activityDTOList
        );
    }

    public void promoteUserToAdmin(Long id){
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new IllegalStateException("User already an admin");
        }

        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

    public void demoteAdminToUser(Long id){
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.USER) {
            throw new IllegalStateException("Already an USER");
        }

        user.setRole(Role.USER);
        userRepository.save(user);
    }

    @Override
    public List<AdminUserViewDTO> getUsers(){
        return userRepository.findAll().stream().map(UserMapper::toaAminDTO).toList();
    }

}
