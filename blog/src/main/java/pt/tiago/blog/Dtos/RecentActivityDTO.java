package pt.tiago.blog.Dtos;

public record RecentActivityDTO (
        String type,
        Long id,
        String titleOrContent,
        String author,
        String createdAt
){
}
