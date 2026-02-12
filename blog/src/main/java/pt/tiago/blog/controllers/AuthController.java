package pt.tiago.blog.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import pt.tiago.blog.Dtos.ApiResponseDTO;
import pt.tiago.blog.Dtos.LoginRequestDTO;
import pt.tiago.blog.Dtos.LoginResponseDTO;
import pt.tiago.blog.Dtos.UserRegistrationDTO;
import pt.tiago.blog.configurations.UserDetailsImpl;
import pt.tiago.blog.exceptions.BadRequestException;
import pt.tiago.blog.exceptions.UnauthorizedException;
import pt.tiago.blog.models.User;
import pt.tiago.blog.services.AuthService;
import pt.tiago.blog.services.JwtService;
import pt.tiago.blog.services.UserService;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthService authService, JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.userService = userService;
    }

    @Operation(summary = "User Registration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User Created"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Unexpected server error", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))})
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDTO dto) {
        authService.register(dto);
        return new ResponseEntity<>(new ApiResponseDTO("User created successfully"), HttpStatus.CREATED);
    }

    @Operation(summary = "User Login")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User logged in"),
            @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Unexpected server error", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))})
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        return new ResponseEntity<>(authService.login(dto), HttpStatus.OK);
    }

    @Operation(summary = "Refresh Token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Refresh token with success"),
            @ApiResponse(responseCode = "400", description = "Refresh token is invalid", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Unexpected server error", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))})
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");

        if (refreshToken == null) {
            throw new BadRequestException("Refresh token is null");
        }

        String username = jwtService.extractUser(refreshToken);
        User user = userService.findUserByUsername(username);
        UserDetailsImpl userDetails = new UserDetailsImpl(user);

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new LoginResponseDTO(newAccessToken, refreshToken, user.getUserName())
        );
    }


}
