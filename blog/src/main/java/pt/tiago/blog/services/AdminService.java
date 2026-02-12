package pt.tiago.blog.services;

import pt.tiago.blog.Dtos.AdminOverviewDTO;
import pt.tiago.blog.Dtos.AdminUserViewDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;

import java.util.List;

public interface AdminService {
    AdminOverviewDTO getOverview();
    void promoteUserToAdmin(Long id);
    void demoteAdminToUser(Long id);
    List<AdminUserViewDTO> getUsers();
}
