package com.computer.computer.users;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String username, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "User not found"
            );
        }

        User user = optionalUser.get();

        String encodedPassword = PreparePassword.encode(rawPassword);

        if (!user.getPassword().equals(encodedPassword)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid password"
            );
        }

        return user;
    }
}
