package pt.tiago.blog.services;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import pt.tiago.blog.Dtos.PostRequestDTO;
import pt.tiago.blog.Dtos.PostResponseDTO;
import pt.tiago.blog.exceptions.BadRequestException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.mappers.PostMapper;
import pt.tiago.blog.models.Category;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.PostStatus;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CategoryRepository;
import pt.tiago.blog.repositories.PostRepository;
import pt.tiago.blog.repositories.UserRepository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService{

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public PostResponseDTO Create(PostRequestDTO dto, String username) {
        var user = userRepository.findByUserName(username).orElseThrow(
                ()-> new ResourceNotFoundException("User not found")
        );

        Set<Category> categories = dto.categoryIds()
                .stream()
                .map(id -> categoryRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Category not found")))
                .collect(Collectors.toSet());

        var post = PostMapper.toDomain(dto, user, categories);
        post.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        post.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        var savedPost = postRepository.save(post);
        return PostMapper.toDTO(savedPost);
    }

    @Override
    public PostResponseDTO getPostForEdit(Long id){
        Post post = postRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Post not found")
        );
        return PostMapper.toDTO(post);
    }

    @Override
    @Transactional
    public PostResponseDTO Update(Long id, PostRequestDTO dto)
    {
        Post post = postRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Post not found"));

        PostStatus status;
        try {
            status = PostStatus.valueOf(dto.status().toUpperCase());
        } catch (IllegalArgumentException e)
        {
            throw new BadRequestException("Invalid status: " + dto.status());
        }

        post.setTitle(dto.title());
        post.setContent(dto.content());
        post.setStatus(status);
        post.setImageUrl(dto.imageUrl());
        post.setCategories(new HashSet<>(categoryRepository.findAllById(dto.categoryIds())));
        post.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        postRepository.save(post);

        return PostMapper.toDTO(post);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        var post = postRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post not found"));
        postRepository.delete(post);
    }
    @Override
    @Transactional
    public List<PostResponseDTO> getPostsByUser(User user){
        var posts = postRepository.findByAuthorId(user.getPerson().getId());
        return posts.stream().map(PostMapper::toDTO).toList();
    }

    @Override
    public List<PostResponseDTO> findAllByStatusOrderByCreatedAtDesc() {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED)
                .stream()
                .map(PostMapper::toDTO)
                .toList();

    }

    @Override
    public PostResponseDTO findById(Long id) {
        var post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return PostMapper.toDTO(post);
    }
}
