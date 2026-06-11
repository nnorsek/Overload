package com.overload.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

/*
 * WorkoutExercises is the join table between Workout and Exercise.
 * Each row represents one exercise slot within a workout, carrying the
 * trainer-defined defaults (sets, reps, weight) and the display position
 * of that exercise via exerciseOrder (1-based, ascending).
 *
 * Relationships:
 *   - ManyToOne -> Workout  (many exercise slots belong to one workout)
 *   - ManyToOne -> Exercise (many workout slots can reference the same exercise)
 *
 * SessionExercises references WorkoutExercises to inherit these defaults
 * when a session is performed, allowing the client's actual performance
 * to be tracked against the trainer's original plan.
 */
@Getter
@Setter
@Entity
@Table(name = "workout_exercises")
public class WorkoutExercises {

    @Id
    @GeneratedValue
    private Long workoutExerciseId;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @NotNull
    @Column(nullable = false)
    private int exerciseOrder;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Float defaultWeight;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private int defaultReps;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private int defaultSets;
}
