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
    private long workout_id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @NotBlank
    @Column(nullable = false)
    private DifficultyLevel difficulty_level;

    @NotBlank
    @Column(nullable = false)
    private int estimated_duration;

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
