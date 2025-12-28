package com.computer.computer.computers;

import com.computer.computer.firm.FirmRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ComputerService {

    private final ComputerRepository computerRepository;
    private final com.computer.computer.firm.FirmRepository firmRepository;

    public ComputerService(ComputerRepository computerRepository, FirmRepository firmRepository) {
        this.computerRepository = computerRepository;
        this.firmRepository = firmRepository;
    }

    public List<Computer> getAll() {
        return computerRepository.findAll();
    }

    public Computer getById(Integer id) {
        Optional<Computer> opt = computerRepository.findById(id);
        if (opt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Computer not found");
        }
        return opt.get();
    }

    public Computer create(String model, String cpu, Integer ramGb, BigDecimal price, Integer firmId) {
        model = normalizeRequired(model, "model", 100);

        if (firmId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "firmId is required");
        if (!firmRepository.existsById(firmId)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Firm does not exist");

        Computer c = new Computer();
        c.setModel(model);
        c.setCpu(normalizeOptional(cpu, 100));
        c.setRamGb(ramGb);
        c.setPrice(price);
        c.setFirmId(firmId);

        return computerRepository.save(c);
    }

    public Computer update(Integer id, String model, String cpu, Integer ramGb, BigDecimal price, Integer firmId) {
        model = normalizeRequired(model, "model", 100);

        Computer c = computerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Computer not found"));

        if (firmId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "firmId is required");
        if (!firmRepository.existsById(firmId)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Firm does not exist");

        c.setModel(model);
        c.setCpu(normalizeOptional(cpu, 100));
        c.setRamGb(ramGb);
        c.setPrice(price);
        c.setFirmId(firmId);

        return computerRepository.save(c);
    }

    public void delete(Integer id) {
        if (!computerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Computer not found");
        }
        computerRepository.deleteById(id);
    }

    private Integer normalizeFirmId(Integer firmId) {
        if (firmId == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "firmId is required");
        if (firmId <= 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "firmId must be > 0");
        return firmId;
    }

    private String normalizeModel(String model) {
        if (model == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "model is required");
        String t = model.trim();
        if (t.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "model is required");
        if (t.length() > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "model is too long");
        return t;
    }

    private String normalizeRequired(String v, String field, int max) {
        if (v == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        String t = v.trim();
        if (t.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is required");
        if (t.length() > max) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + " is too long");
        return t;
    }

    private String normalizeOptional(String v, int max) {
        if (v == null) return null;
        String t = v.trim();
        if (t.isEmpty()) return null;
        if (t.length() > max) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Value is too long");
        return t;
    }
}