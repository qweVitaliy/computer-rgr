package com.computer.computer.firm;

import com.computer.computer.countries.CountryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class FirmService {
    private final FirmRepository firmRepository;
    private final CountryRepository countryRepository;

    public FirmService(FirmRepository firmRepository, CountryRepository countryRepository) {
        this.firmRepository = firmRepository;
        this.countryRepository = countryRepository;
    }

    public List<Firm> getAll() {
        return firmRepository.findAll();
    }

    public Firm getById(Integer id) {
        Optional<Firm> opt = firmRepository.findById(id);

        if (opt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Firm not found");
        }

        return opt.get();
    }

    public Firm create(String name, Integer countryId) {
        if (!countryRepository.existsById(countryId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Country does not exist");
        }

        Firm firm = new Firm();
        firm.setName(name);
        firm.setCountryId(countryId);

        return firmRepository.save(firm);
    }

    public Firm update(Integer id, String name, Integer countryId) {
        Optional<Firm> opt = firmRepository.findById(id);
        if (opt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Firm not found");
        }

        if (!countryRepository.existsById(countryId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Country does not exist");
        }

        Firm firm = opt.get();
        firm.setName(name);
        firm.setCountryId(countryId);

        return firmRepository.save(firm);
    }

    public void delete(Integer id) {
        if (!firmRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Firm not found");
        }

        firmRepository.deleteById(id);
    }
}
