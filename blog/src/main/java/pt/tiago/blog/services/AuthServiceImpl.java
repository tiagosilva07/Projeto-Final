package pt.tiago.blog.services;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pt.tiago.blog.Dtos.LoginRequestDTO;
import pt.tiago.blog.Dtos.LoginResponseDTO;
import pt.tiago.blog.Dtos.UserRegistrationDTO;
import pt.tiago.blog.exceptions.ConflictException;
import pt.tiago.blog.exceptions.ResourceNotFoundException;
import pt.tiago.blog.exceptions.UnauthorizedException;
import pt.tiago.blog.models.Person;
import pt.tiago.blog.models.Role;
import pt.tiago.blog.models.User;
import pt.tiago.blog.repositories.PersonRepository;
import pt.tiago.blog.repositories.UserRepository;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository, PersonRepository personRepository, BCryptPasswordEncoder encoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public void register(UserRegistrationDTO dto) {

        if(userRepository.existsByUserName(dto.username())){
            throw new ConflictException("Username is already taken");
        }

        if(personRepository.existsByEmail(dto.email())){
            throw new ConflictException("Email is already taken");
        }

        Person person = new Person(dto.name(), dto.email());
        String password = encoder.encode(dto.password());
        User user  = new User(dto.username(), password, person);
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByUserName(dto.username())
                .orElseThrow(() ->new UnauthorizedException("Invalid Credentials"));

        if(!encoder.matches(dto.password(),user.getPassword())){
            throw new UnauthorizedException("Invalid Credentials!");
        }
        String token = jwtService.generateToken(user);
        String refreshToken = jwtService.refreshToken(user);
        return new LoginResponseDTO(token, refreshToken,user.getUserName());
    }
}
