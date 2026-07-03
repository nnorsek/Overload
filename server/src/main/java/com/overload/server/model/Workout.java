package com.overload.server.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.overload.server.enums.DifficultyLevel;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/*
 * Workout is a reusable training template created by a Trainer.
 * It is not tied to a single client — instead, it is assigned to clients
 * via ClientWorkout, allowing the same workout to be given to many clients.
 *
 * Relationships:
 *   - ManyToOne -> Trainer        (the trainer who authored this workout)
 *   - OneToMany -> WorkoutExercises (the ordered list of exercises in this workout)
 *   - OneToMany -> ClientWorkout  (the clients this workout has been assigned to)
 *   - OneToOne  <- Session        (sessions reference a workout to track performance)
 */
@Entity
@Getter
@Setter
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue
    private Long workoutId;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("exerciseOrder ASC")
    private List<WorkoutExercises> exercises = new ArrayList<>();

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

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
