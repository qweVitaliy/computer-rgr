package com.computer.computer.firm;

import jakarta.persistence.*;

@Entity
@Table(name = "firm")
public class Firm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "country_id", nullable = false)
    private Integer countryId;

    @Column(nullable = false)
    private String name;

    public Firm() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getCountryId() {
        return countryId;
    }

    public void setCountryId(Integer countryId) {
        this.countryId = countryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}