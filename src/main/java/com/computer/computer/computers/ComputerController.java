package com.computer.computer.computers;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/computers")
public class ComputerController {

    private final ComputerService service;

    public ComputerController(ComputerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Computer> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Computer getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<Computer> create(@RequestBody Map<String, Object> body, HttpSession session) {
        requireAdmin(session);

        String model = body.get("model") == null ? null : String.valueOf(body.get("model"));
        String cpu = body.get("cpu") == null ? null : String.valueOf(body.get("cpu"));

        Integer firmId = parseInt(body.get("firmId"));
        Integer ramGb = parseInt(body.get("ramGb"));

        BigDecimal price = parseBigDecimal(body.get("price"));

        return ResponseEntity.ok(service.create(model, cpu, ramGb, price, firmId));
    }

    @PutMapping("/{id}")
    public Computer update(@PathVariable Integer id, @RequestBody Map<String, Object> body, HttpSession session) {
        requireAdmin(session);

        String model = body.get("model") == null ? null : String.valueOf(body.get("model"));
        String cpu = body.get("cpu") == null ? null : String.valueOf(body.get("cpu"));

        Integer firmId = parseInt(body.get("firmId"));
        Integer ramGb = parseInt(body.get("ramGb"));

        BigDecimal price = parseBigDecimal(body.get("price"));

        return service.update(id, model, cpu, ramGb, price, firmId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, HttpSession session) {
        requireAdmin(session);

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Integer parseInt(Object v) {
        if (v == null) return null;
        String s = String.valueOf(v).trim();
        if (s.isEmpty()) return null;
        return Integer.parseInt(s);
    }

    private BigDecimal parseBigDecimal(Object v) {
        if (v == null) return null;
        String s = String.valueOf(v).trim();
        if (s.isEmpty()) return null;
        return new BigDecimal(s);
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