package pt.tiago.blog.unit.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import pt.tiago.blog.controllers.CategoryController;
import pt.tiago.blog.services.AuthService;
import pt.tiago.blog.services.CategoryService;
import pt.tiago.blog.services.JwtService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
@EnableMethodSecurity(prePostEnabled = true)
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryService categoryService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    private static final String VALID_CATEGORY_JSON = """
        {
            "name": "New Category",
            "description": "Some Description"
        }
        """;

    private static final String VALID_BULK_JSON = """
        [{
            "name": "New Category",
            "description": "Some Description"
        }]
        """;

    private ResultActions postJson(String endpoint, String json) throws Exception {
        return mockMvc.perform(
                post("/api/" + endpoint)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        );
    }

    // -----------------------------
    // CREATE CATEGORY
    // -----------------------------

    @Test
    @WithMockUser(username = "jonh", roles = "USER")
    void shouldReturn403WhenUserDoesNotHaveAdminRole() throws Exception {
        postJson("categories", VALID_CATEGORY_JSON)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username="admin",roles = "ADMIN")
    void shouldReturn201WhenAdminCreatesCategory() throws Exception {
        postJson("categories", VALID_CATEGORY_JSON)
                .andExpect(status().isCreated());
    }

    // -----------------------------
    // BULK CREATE
    // -----------------------------

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserDoesNotHaveAdminRoleBulk() throws Exception {
        postJson("categories/bulk", VALID_BULK_JSON)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturn201WhenAdminCreatesBulk() throws Exception {
        postJson("categories/bulk", VALID_BULK_JSON)
                .andExpect(status().isCreated());
    }

    // -----------------------------
    // GET ALL (public)
    // -----------------------------

    @Test
    void shouldReturn200WhenGettingAllCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk());
    }

    // -----------------------------
    // GET BY ID (ADMIN)
    // -----------------------------

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserGetsByIdWithoutAdminRole() throws Exception {
        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturn200WhenAdminGetsById() throws Exception {
        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isOk());
    }

    // -----------------------------
    // UPDATE (ADMIN)
    // -----------------------------

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserUpdatesWithoutAdminRole() throws Exception {
        mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_CATEGORY_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturn200WhenAdminUpdatesCategory() throws Exception {
        mockMvc.perform(put("/api/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(VALID_CATEGORY_JSON))
                .andExpect(status().isOk());
    }

    // -----------------------------
    // DELETE (ADMIN)
    // -----------------------------

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserDeletesWithoutAdminRole() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturn200WhenAdminDeletesCategory() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isOk());
    }
}