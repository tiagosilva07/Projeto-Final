package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import pt.tiago.blog.Dtos.AdminOverviewDTO;
import pt.tiago.blog.configurations.JwtAuthenticationFilter;
import pt.tiago.blog.controllers.AdminController;
import pt.tiago.blog.services.AdminService;
import pt.tiago.blog.services.JwtService;


import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
@EnableMethodSecurity(prePostEnabled = true)
public class AdminControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminService adminService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @WithMockUser(username = "jonh",roles = {"USER"})
    void shouldReturn403WhenNoTokenProvided() throws Exception{
        mockMvc.perform(get("/api/admin/overview"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getOverviewShouldReturn200WhenAdminProvided() throws Exception {
        AdminOverviewDTO adminOverviewDTO = new AdminOverviewDTO(
                10L,20L, 5L, List.of());

        Mockito.when(adminService.getOverview()).thenReturn(adminOverviewDTO);
        mockMvc.perform(get("/api/admin/overview"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPosts").value(10))
                .andExpect(jsonPath("$.totalComments").value(20))
                .andExpect(jsonPath("$.totalUsers").value(5));
    }

    @Test
    @WithMockUser(username="jonh", roles={"USER"})
    void shouldReturn403WhenNoAdminRoleProvided() throws Exception{
        mockMvc.perform(get("/api/admin/overview"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin",roles = {"ADMIN"})
    void promoteToAdminShouldReturn200() throws Exception {
        mockMvc.perform(put("/api/admin/users/5/promote"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User promoted to ADMIN"));
    }

    @Test
    @WithMockUser(username = "jonh")
    void promoteToAdminShouldReturn403() throws Exception {
        mockMvc.perform(put("/api/admin/users/5/promote"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access Denied"));
    }

    @Test
    @WithMockUser(username = "admin",roles = {"ADMIN"})
    void demoteAdminShouldReturn200() throws Exception {
        mockMvc.perform(put("/api/admin/users/5/demote"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Admin demoted to USER"));
    }

    @Test
    @WithMockUser(username = "jonh")
    void demoteAdminShouldReturn403() throws Exception {
        mockMvc.perform(put("/api/admin/users/5/demote"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Access Denied"));
    }
}
