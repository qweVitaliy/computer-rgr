package com.computer.computer.countries;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CountryService {

    private final CountryRepository repository;

    public CountryService(CountryRepository repository) {
        this.repository = repository;
    }

    public List<Country> getAll() {
        return repository.findAll();
    }

    public Country getById(Integer id) {
        Optional<Country> opt = repository.findById(id);

        if (opt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found");
        }

        return opt.get();
    }

    public Country create(String name) {
        name = normalizeName(name);

        Country c = new Country();
        c.setName(name);

        return repository.save(c);
    }

    public Country update(Integer id, String name) {
        name = normalizeName(name);

        Optional<Country> opt = repository.findById(id);
        if (opt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found");
        }

        Country c = opt.get();
        c.setName(name);

        return repository.save(c);
    }

    public void delete(Integer id) {
        Optional<Country> opt = repository.findById(id);

        if (opt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found");
        }

        repository.deleteById(id);
    }

    private String normalizeName(String name) {
        if (name == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        String trimmed = name.trim();

        if (trimmed.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is required");
        }

        if (trimmed.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name is too long");
        }

        return trimmed;
    }
}
