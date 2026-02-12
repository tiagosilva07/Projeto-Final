package pt.tiago.blog.Dtos;

import java.util.List;

public record AdminOverviewDTO(
        Long totalPosts,
        Long totalComments,
        Long totalUsers,
        List<RecentActivityDTO> activity
        ) {
}
