package com.computer.computer.countries;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/countries")
public class CountryController {

    private final CountryService service;

    public CountryController(CountryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Country> getAll(HttpSession session) {
        requireAuth(session);
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Country> create(@RequestBody Map<String, Object> body, HttpSession session) {
        requireAdmin(session);

        String name = body.get("name") == null ? null : String.valueOf(body.get("name"));
        return ResponseEntity.ok(service.create(name));
    }

    @PutMapping("/{id}")
    public Country update(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpSession session) {
        requireAdmin(session);

        String name = body.get("name") == null ? null : String.valueOf(body.get("name"));
        return service.update(id, name);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpSession session) {
        requireAdmin(session);

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private void requireAuth(HttpSession session) {
        if (session.getAttribute("userId") == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
    }

    private void requireAdmin(HttpSession session) {
        requireAuth(session);

        Object role = session.getAttribute("role");
        String r = role == null ? "" : role.toString();

        if ("USER".equalsIgnoreCase(r)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }
    }
}
