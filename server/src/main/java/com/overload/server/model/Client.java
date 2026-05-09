package com.overload.server.model;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue
    private Long clientId;

    @Column(nullable = false)
    @NotBlank
    private String firstName;

    @Column(nullable = false)
    @NotBlank
    private String lastName;

    private String middleName;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Email
    private String email;

    @Size(min = 8, max = 72)
    @NotNull
    private String passwordHash;

    @Column(nullable = false)
    @NotNull
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    @NotBlank
    private String gender;

    @Column(nullable = false)
    @NotNull
    @Positive
    private Float startingWeight;

    @Column(nullable = false, columnDefinition = "float default 1.0")
    @NotNull
    @Positive
    private Float currentWeight;

    @Column(nullable = false)
    @NotNull
    @Positive
    private Integer height;

    private String goal;

    private String photoUrl;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    private LocalDateTime startedAt;

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
