package com.overload.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "session_exercises")
public class SessionExercises {

    @Id
    @GeneratedValue
    private long session_exercise_id;

    @OneToOne
    @NotNull
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "workout_exercise_id", nullable = false)
    private WorkoutExercises workoutExercises;

    @NotNull
    @Column(nullable = false)
    private int sets;

    @NotNull
    @Column(nullable = false)
    private int reps;
}
