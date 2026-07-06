package com.overload.server.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "workout_exercise_set")
public class WorkoutExerciseSet {

    @Id
    @GeneratedValue
    private long setId;

    @NotNull
    private int setOrder;

    @PositiveOrZero
    private Float defaultWeight;

    @Positive
    private int defaultReps;

    @ManyToOne
    @JoinColumn(name = "workout_exercise_id", nullable = false)
    private WorkoutExercises workoutExercises; 
}