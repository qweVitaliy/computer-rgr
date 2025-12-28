package com.computer.computer.firm;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/firms")
public class FirmController {
    private final FirmService service;

    public FirmController(FirmService service) {
        this.service = service;
    }

    @GetMapping
    public List<Firm> getAll(HttpSession session) {
        requireAuth(session);
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Firm> create(@RequestBody Map<String, Object> body, HttpSession session) {
        requireAdmin(session);

        String name = body.get("name") == null ? null : String.valueOf(body.get("name"));

        Integer countryId = null;
        Object raw = body.get("countryId");
        if (raw != null) countryId = Integer.parseInt(String.valueOf(raw));

        return ResponseEntity.ok(service.create(name, countryId));
    }

    @PutMapping("/{id}")
    public Firm update(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpSession session) {
        requireAdmin(session);

        String name = body.get("name") == null ? null : String.valueOf(body.get("name"));

        Integer countryId = null;
        Object raw = body.get("countryId");
        if (raw != null) countryId = Integer.parseInt(String.valueOf(raw));

        return service.update(id, name, countryId);
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