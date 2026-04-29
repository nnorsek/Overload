package com.overload.server.model;

import java.time.Instant;

import com.overload.server.enums.DifficultyLevel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue
    private long workoutId;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @NotBlank
    @Column(nullable = false)
    private DifficultyLevel difficultyLevel;

    @NotBlank
    @Column(nullable = false)
    private int estimatedDuration;

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
