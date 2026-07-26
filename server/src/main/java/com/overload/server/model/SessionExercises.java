package com.overload.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/*
 * SessionExercises records one exercise as it was actually performed during a Session.
 * It references WorkoutExercises to know the trainer's planned defaults (sets, reps, weight),
 * and the Exercise directly for convenient lookups without joining through WorkoutExercises.
 *
 * NOTE: The flat sets/reps fields here are out of sync with WorkoutExercises, which
 * was refactored to store per-set details in WorkoutExerciseSet. A SessionExerciseSet
 * table should be introduced to record the client's actual weight/reps for each set.
 *
 * Relationships:
 *   - ManyToOne -> Session          (many exercise records belong to one session)
 *   - ManyToOne -> Exercise         (which exercise was performed)
 *   - ManyToOne -> WorkoutExercises (the trainer's planned slot this performance is against)
 */
@Getter
@Setter
@Entity
@Table(name = "session_exercises")
public class SessionExercises {

    @Id
    @GeneratedValue
    private Long sessionExerciseId;

    @ManyToOne
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
