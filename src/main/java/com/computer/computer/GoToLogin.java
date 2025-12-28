package com.computer.computer;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GoToLogin {
    @GetMapping("/")
    public String root() {
        return "redirect:/login-page.html";
    }
}