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
    private Long trainer_id;

    @Column(nullable = false)
    @NotBlank
    private String first_name;

    @Column(nullable = false)
    @NotBlank
    private String last_name;

    @Column(nullable = false)
    @NotNull
    private LocalDateTime date_of_birth;

    @Column(nullable = false)
    @NotBlank
    private String gender;

    private String photo_url;
    
    @OneToMany(mappedBy = "trainer")
    private List<Client> clients = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant created_at;

    @PrePersist
    public void onCreate(){
        Instant now = Instant.now();
        created_at = now;
        updated_at = now;
    }
    
    @Column(nullable = false)
    private Instant updated_at;

    @PreUpdate
    public void onUpdate() {
        updated_at = Instant.now();
    }

}
