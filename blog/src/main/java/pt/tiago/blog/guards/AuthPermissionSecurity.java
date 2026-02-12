package pt.tiago.blog.guards;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import pt.tiago.blog.models.Comment;
import pt.tiago.blog.models.Post;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.CommentRepository;
import pt.tiago.blog.repositories.PostRepository;
import pt.tiago.blog.repositories.UserRepository;

@Component("auth")
public class AuthPermissionSecurity {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public AuthPermissionSecurity(CommentRepository commentRepository,  PostRepository postRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    //COMMENTS SECTION
    public boolean canEditComment(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null) {
            return false;
        }

        String username = authentication.getName();

        boolean isAdmin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if(isAdmin) {
            return true;
        }

       var comment = commentRepository.findById(id).orElse(null);
        if(comment == null) {
            return false;
        }

        return comment.getAuthor().getUserName().equals(username);
    }

    //POST SECTION
    public boolean canEditPost(Long postId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String username = auth.getName();

        if (isAdmin(auth))
            return true;

        var user = getCurrentUser(username);
        var post = getCurrentPost(postId);

        if (user == null || post == null)
            return false;

        return post.getAuthor().getId().equals(user.getId());
    }

    public boolean canDeletePostComment(Long postId, Long commentId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        String username = auth.getName();

        if (isAdmin(auth))
            return true;

        var user = getCurrentUser(username);

        var post = getCurrentPost(postId);

        var comment = getCurrentComment(commentId);

        if (user == null || post == null || comment == null)
            return false;

        if(comment.getAuthor().getId().equals(user.getId()))
            return true;

        return post.getAuthor().getId().equals(user.getId());
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private User getCurrentUser(String username) {
        return userRepository.findByUserName(username)
                .orElse(null);
    }

    private Post getCurrentPost(Long postId) {
        return postRepository.findById(postId)
                .orElse(null);
    }

    private Comment getCurrentComment(Long commentId) {
        return commentRepository.findById(commentId).orElse(null);
    }

}
