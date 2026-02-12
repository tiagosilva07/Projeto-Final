package pt.tiago.blog.services;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.Dtos.PostResponseDTO;
import pt.tiago.blog.Dtos.UserRequestDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.exceptions.BadRequestException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.mappers.CommentMapper;
import pt.tiago.blog.mappers.PostMapper;
import pt.tiago.blog.mappers.UserMapper;
import pt.tiago.blog.models.Comment;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.UserRepository;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserResponseDTO findUserById(Long id){
        var user = userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        return UserMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserResponseDTO updateUser(UserRequestDTO dto, User user) {

        validateUserRequest(dto);

        var managedUser = userRepository.findById(user.getId())
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        if(managedUser.getPerson() == null){
           throw new IllegalStateException("User has no associated person");
        }

        var person = managedUser.getPerson();
        person.setEmail(dto.email());
        person.setName(dto.name());
        managedUser.setPerson(person);

        var savedUser = userRepository.save(managedUser);
        return UserMapper.toDTO(savedUser);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUserName(username).orElseThrow(()->new ResourceNotFoundException("User not found"));
    }

    private void validateUserRequest(UserRequestDTO dto) {
        if (dto.name() == null || dto.name().trim().isEmpty()) {
            throw new BadRequestException("Name is required");
        }
        if (dto.email() == null || dto.email().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
    }

    private List<PostResponseDTO> getPostsDTO(List<Post> posts) {
        return posts.stream().map(PostMapper::toDTO).toList();
    }

    private List<CommentResponseDTO> getCommentsDTO(List<Comment> comments) {
        return comments.stream().map(CommentMapper::toDTO).toList();
    }
}
