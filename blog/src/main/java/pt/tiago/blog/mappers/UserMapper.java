package pt.tiago.blog.mappers;

import pt.tiago.blog.Dtos.AdminUserViewDTO;
import pt.tiago.blog.Dtos.CommentResponseDTO;
import pt.tiago.blog.Dtos.PostResponseDTO;
import pt.tiago.blog.Dtos.UserResponseDTO;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.User;

import java.util.List;

public class UserMapper {

    public static UserResponseDTO toDTO(User user) {
        if(user == null){
            return null;
        }
        var person = user.getPerson();
        var posts = user.getPosts().stream().map(PostMapper::toDTO).toList();
        var comments = user.getComments().stream().map(CommentMapper::toDTO).toList();

        return new UserResponseDTO(
                user.getId(),
                person.getId(),
                user.getUserName(),
                person.getName(),
                person.getEmail(),
                posts,
                comments
        );
    }

    public static AdminUserViewDTO toaAminDTO(User user) {
        if(user == null){
            return null;
        }
        var person = user.getPerson();
        var posts = user.getPosts().stream().map(PostMapper::toDTO).toList();
        var comments = user.getComments().stream().map(CommentMapper::toDTO).toList();

        return new AdminUserViewDTO(
                user.getId(),
                person.getId(),
                user.getUserName(),
                person.getName(),
                person.getEmail(),
                user.getRole().toString(),
                posts,
                comments
        );
    }
}
