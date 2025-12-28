package com.computer.computer.computers;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "computer")
public class Computer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "firm_id", nullable = false)
    private Integer firmId;

    @Column(name = "model", nullable = false, length = 100)
    private String model;

    @Column(name = "cpu", length = 100)
    private String cpu;

    @Column(name = "ram_gb")
    private Integer ramGb;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    public Integer getId() { return id; }

    public Integer getFirmId() { return firmId; }
    public void setFirmId(Integer firmId) { this.firmId = firmId; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCpu() { return cpu; }
    public void setCpu(String cpu) { this.cpu = cpu; }

    public Integer getRamGb() { return ramGb; }
    public void setRamGb(Integer ramGb) { this.ramGb = ramGb; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}