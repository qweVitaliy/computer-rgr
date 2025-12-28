package com.computer.computer.users;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public User login(
        @RequestBody Map<String, String> body,
        HttpSession session
    ) {
        String username = body.get("username");
        String password = body.get("password");

        User user = authService.login(username, password);

        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole());

        return user;
    }

    @PostMapping
    public void logout(HttpSession session) {
        session.removeAttribute("userId");
        session.removeAttribute("role");
    }
}
