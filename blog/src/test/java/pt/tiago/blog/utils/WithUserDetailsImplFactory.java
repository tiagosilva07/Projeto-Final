package pt.tiago.blog.utils;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.context.support.WithSecurityContextFactory;
import pt.tiago.blog.configurations.UserDetailsImpl;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.User;

public class WithUserDetailsImplFactory implements WithSecurityContextFactory<WithMockUserDetailsImpl> {

    @Override
    public SecurityContext createSecurityContext(WithMockUserDetailsImpl annotation) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        Person person = new Person("John Doe", annotation.email());
        person.setId(10L);
        User user = new User(annotation.username(), "password", person);
        user.setId(1L);
        UserDetailsImpl principal = new UserDetailsImpl(user);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        principal.getPassword(),
                        principal.getAuthorities()
                );

        context.setAuthentication(auth);
        return context;
    }
}
