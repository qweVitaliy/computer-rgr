package com.computer.computer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class ComputerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComputerApplication.class, args);
	}

    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login-page.html";
    }
}
