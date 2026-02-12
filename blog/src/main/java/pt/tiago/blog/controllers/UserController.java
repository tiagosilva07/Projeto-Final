package pt.tiago.blog.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pt.tiago.blog.Dtos.UserRequestDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.configurations.UserDetailsImpl;

import pt.tiago.blog.services.UserService;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users Management", description = "Endpoints to manage  user profile")
public class UserController {

    private final UserService userService;

     public UserController(UserService userService) {
         this.userService = userService;
     }

    @Operation(summary = "Update user profile" , description = "Requires USER role")
    @PutMapping("/users/profile")
     public ResponseEntity<UserResponseDTO> updateUserProfile(@Valid @RequestBody UserRequestDTO dto, @AuthenticationPrincipal UserDetailsImpl userDetails){
        var updateProfile = userService.updateUser(dto, userDetails.getUser());
         return new ResponseEntity<>(updateProfile,HttpStatus.OK);
     }

    @Operation(summary = "Get user profile", description = "REQUIRES USER role")
    @GetMapping("/users/me")
    public ResponseEntity<UserResponseDTO> getMyProfile(@AuthenticationPrincipal UserDetailsImpl user){
        var userProfile = userService.findUserById(user.getUser().getId());
        return new ResponseEntity<>(userProfile,HttpStatus.OK);
    }

}
