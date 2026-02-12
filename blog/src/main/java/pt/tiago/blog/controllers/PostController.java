package pt.tiago.blog.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pt.tiago.blog.Dtos.*;
import pt.tiago.blog.configurations.UserDetailsImpl;
import pt.tiago.blog.models.User;
import pt.tiago.blog.services.CommentService;
import pt.tiago.blog.services.PostService;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Post Management", description = "App's for managing posts")
@SecurityRequirement(name = "bearerAuth")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @Operation(summary = "Get all posts")
    @GetMapping("/posts")
    public ResponseEntity<List<PostResponseDTO>> getAll() {
        var posts = postService.findAllByStatusOrderByCreatedAtDesc();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @Operation(summary = "Get a specific user posts", description = "Requires ADMIN role or USER and user must be owner")
    @GetMapping("/posts/me")
    public ResponseEntity<List<PostResponseDTO>> getMe(@AuthenticationPrincipal UserDetailsImpl details) {
        User user = details.getUser();
        var posts = postService.getPostsByUser(user);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @Operation(summary = "Create a post", description = "Requires ADMIN role or USER")
    @PostMapping("/posts")
    public ResponseEntity<PostResponseDTO> post(@Valid @RequestBody PostRequestDTO post, @AuthenticationPrincipal UserDetails details) {
        var result = postService.Create(post, details.getUsername());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Operation(summary = "Update a post", description = "Requires ADMIN role or USER and user must be owner")
    @PreAuthorize("@auth.canEditPost(#id)")
    @PutMapping("/posts/{id}")
    public ResponseEntity<PostResponseDTO> update(@PathVariable Long id, @Valid @RequestBody PostRequestDTO dto) {
        var updated = postService.Update(id, dto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Operation(summary = "Get a post to edit", description = "Requires ADMIN role or USER and user must be owner")
    @PreAuthorize("@auth.canEditPost(#id)")
    @GetMapping("/posts/{id}")
    public ResponseEntity<PostResponseDTO> getPostForEdit(@PathVariable Long id) {
        var post = postService.getPostForEdit(id);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @Operation(summary = "Delete a post", description = "Requires ADMIN role or USER and user must be owner")
    @PreAuthorize("@auth.canEditPost(#id)")
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @Operation(summary = "Get post comments", description = "Requires ADMIN role or USER")
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<CommentResponseDTO> AddComment(@PathVariable Long id,@Valid @RequestBody CommentRequestDTO dto, @AuthenticationPrincipal UserDetailsImpl details) {
        var response = commentService.addComment(id, dto, details.getUser());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Create a post comment")
    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getPostComments(@PathVariable Long id) {
        var response = commentService.getPostComments(id);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Delete a user comment", description = "Requires ADMIN role or owner")
    @PreAuthorize("@auth.canDeletePostComment(#id,#commentId)")
    @DeleteMapping("posts/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Update a post comment", description = "Requires ADMIN role or owner")
    @PreAuthorize("@auth.canEditComment(#commentId)")
    @PutMapping("posts/{id}/comments/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable Long id, @PathVariable Long commentId, @Valid @RequestBody CommentRequestDTO dto){
        var updated = commentService.updateComment(commentId, dto);
        return new ResponseEntity<>(updated,HttpStatus.OK);
    }
}
