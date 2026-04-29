package com.overload.server.model;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "trainers")
public class Trainer {
    
    @Id
    @GeneratedValue
    private Long trainerId;

    @Column(nullable = false)
    @NotBlank
    private String firstName;

    @Column(nullable = false)
    @NotBlank
    private String lastName;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime dateOfBirth;

    @Column(nullable = false)
    @NotBlank
    private String gender;

    private String photoUrl;
    
    @OneToMany(mappedBy = "trainer", cascade = CascadeType.ALL)
    private List<Client> clients = new ArrayList<>();

    // Relationship logic to add a client to a trainer and vice versa
    public void addClient(Client client) {
        clients.add(client);
        client.setTrainer(this);
    }

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void onCreate(){
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }
    
    @Column(nullable = false)
    private Instant updatedAt;

    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }

}
