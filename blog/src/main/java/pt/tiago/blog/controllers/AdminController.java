package pt.tiago.blog.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import pt.tiago.blog.Dtos.AdminOverviewDTO;
import pt.tiago.blog.Dtos.AdminUserViewDTO;
import pt.tiago.blog.Dtos.ApiResponseDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.services.AdminService;
import pt.tiago.blog.services.AuthService;

import java.util.List;

@Tag(name = "Admin", description = "Admin-only operations")
@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Operation(summary = "ADMIN app overview details", description = "Requires ADMIN role")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Overview retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AdminOverviewDTO.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden — requires ADMIN role",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewDTO> getOverview() {
        return new ResponseEntity<>(adminService.getOverview(),HttpStatus.OK);
    }


    @Operation(summary = "Promote users to admin", description = "Requires ADMIN role")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User promoted to ADMIN"),
            @ApiResponse(responseCode = "400", description = "Invalid user ID", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Access Denied — requires ADMIN role", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "User already an admin", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Unexpected server error", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/promote")
    public ResponseEntity<?> promoteUser(@PathVariable Long id) {
        adminService.promoteUserToAdmin(id);
        return new ResponseEntity<>(new ApiResponseDTO("User promoted to ADMIN"),HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/demote")
    public ResponseEntity<?> demoteUser(@PathVariable Long id) {
        adminService.demoteAdminToUser(id);
        return new ResponseEntity<>(new ApiResponseDTO("Admin demoted to USER"),HttpStatus.OK);
    }

    @Operation(summary = "Get All users", description = "Requires ADMIN role")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Return all users successfully",
                    content = @Content(schema = @Schema(implementation = AdminOverviewDTO.class))),
            @ApiResponse(responseCode = "403", description = "Forbidden — requires ADMIN role",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserViewDTO>> getUsers() {
        return new ResponseEntity<>(adminService.getUsers(),HttpStatus.OK);
    }
}
