package pt.tiago.blog.utils;

import org.springframework.security.test.context.support.WithSecurityContext;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithUserDetailsImplFactory.class)
public @interface WithMockUserDetailsImpl {
    String username() default "john";
    String email() default "john@mail.com";
}
