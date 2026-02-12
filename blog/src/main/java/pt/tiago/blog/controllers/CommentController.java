package pt.tiago.blog.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pt.tiago.blog.Dtos.CommentRequestDTO;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.services.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@SecurityRequirement(name = "bearerAuth")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> getAllComments() {
        return new ResponseEntity<>(commentService.getAllComments(),HttpStatus.OK);
    }

    @Operation(summary = "Update a comment", description = "Requires ADMIN role or owner")
    @PreAuthorize("@auth.canEditComment(#id)")
    @PutMapping("{id}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable Long id, @Valid @RequestBody CommentRequestDTO dto) {
        var updatedComment = commentService.updateComment(id,dto);
        return new ResponseEntity<>(updatedComment,HttpStatus.OK);
    }

    @Operation(summary = "Delete a comment", description = "Requires ADMIN role or owner")
    @PreAuthorize("@auth.canEditComment(#id)")
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        commentService.deleteComment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
