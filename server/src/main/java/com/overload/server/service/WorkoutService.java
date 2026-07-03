package com.overload.server.service;

import com.overload.server.DTOs.workouts.requests.WorkoutExerciseRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutRequest;
import com.overload.server.DTOs.workouts.responses.WorkoutExerciseResponse;
import com.overload.server.DTOs.workouts.responses.WorkoutResponse;
import com.overload.server.exception.ResourceNotFoundException;
import com.overload.server.model.Exercise;
import com.overload.server.model.Trainer;
import com.overload.server.model.Workout;
import com.overload.server.model.WorkoutExercises;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.TrainerRepo;
import com.overload.server.repo.WorkoutExercisesRepo;
import com.overload.server.repo.WorkoutRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepo workoutRepo;
    private final WorkoutExercisesRepo workoutExercisesRepo;
    private final TrainerRepo trainerRepo;
    private final ExerciseRepo exerciseRepo;

    public List<WorkoutResponse> getAllWorkouts(Long trainerId) {
        return workoutRepo.findAllByTrainer_TrainerId(trainerId)
                .stream().map(this::toResponse).toList();
    }

    public WorkoutResponse getWorkout(Long workoutId, Long trainerId) {
        return toResponse(findOwned(workoutId, trainerId));
    }

    public WorkoutResponse createWorkout(WorkoutRequest req, Long trainerId) {
        Trainer trainer = trainerRepo.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        Workout workout = new Workout();
        workout.setTrainer(trainer);
        workout.setName(req.name());
        workout.setDescription(req.description());
        workout.setDifficultyLevel(req.difficultyLevel());
        workout.setEstimatedDuration(req.estimatedDuration());

        return toResponse(workoutRepo.save(workout));
    }

    public WorkoutResponse updateWorkout(Long workoutId, WorkoutRequest req, Long trainerId) {
        Workout workout = findOwned(workoutId, trainerId);

        workout.setName(req.name());
        workout.setDescription(req.description());
        workout.setDifficultyLevel(req.difficultyLevel());
        workout.setEstimatedDuration(req.estimatedDuration());

        return toResponse(workoutRepo.save(workout));
    }

    public void deleteWorkout(Long workoutId, Long trainerId) {
        Workout workout = findOwned(workoutId, trainerId);
        workoutRepo.delete(workout);
    }

    public WorkoutResponse addExercise(Long workoutId, WorkoutExerciseRequest req, Long trainerId) {
        Workout workout = findOwned(workoutId, trainerId);

        Exercise exercise = exerciseRepo.findById(req.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        WorkoutExercises slot = new WorkoutExercises();
        slot.setWorkout(workout);
        slot.setExercise(exercise);
        slot.setExerciseOrder(req.exerciseOrder());
        slot.setDefaultSets(req.defaultSets());
        slot.setDefaultReps(req.defaultReps());
        slot.setDefaultWeight(req.defaultWeight());

        workoutExercisesRepo.save(slot);

        return toResponse(workoutRepo.findById(workoutId).get());
    }

    public WorkoutResponse updateExercise(Long workoutId, Long workoutExerciseId, WorkoutExerciseRequest req, Long trainerId) {
        findOwned(workoutId, trainerId);

        WorkoutExercises slot = workoutExercisesRepo
                .findByWorkoutExerciseIdAndWorkout_WorkoutId(workoutExerciseId, workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise slot not found"));

        slot.setExerciseOrder(req.exerciseOrder());
        slot.setDefaultSets(req.defaultSets());
        slot.setDefaultReps(req.defaultReps());
        slot.setDefaultWeight(req.defaultWeight());

        workoutExercisesRepo.save(slot);

        return toResponse(workoutRepo.findById(workoutId).get());
    }

    public void removeExercise(Long workoutId, Long workoutExerciseId, Long trainerId) {
        findOwned(workoutId, trainerId);

        WorkoutExercises slot = workoutExercisesRepo
                .findByWorkoutExerciseIdAndWorkout_WorkoutId(workoutExerciseId, workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise slot not found"));

        workoutExercisesRepo.delete(slot);
    }

    private Workout findOwned(Long workoutId, Long trainerId) {
        return workoutRepo.findByWorkoutIdAndTrainerId(workoutId, trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));
    }

    private WorkoutResponse toResponse(Workout workout) {
        List<WorkoutExerciseResponse> exercises = workout.getExercises().stream()
                .map(slot -> new WorkoutExerciseResponse(
                        slot.getWorkoutExerciseId(),
                        slot.getExerciseOrder(),
                        slot.getDefaultSets(),
                        slot.getDefaultReps(),
                        slot.getDefaultWeight(),
                        slot.getExercise().getExerciseId(),
                        slot.getExercise().getName(),
                        slot.getExercise().getMuscleGroup(),
                        slot.getExercise().getEquipmentType(),
                        slot.getExercise().getCategory()
                ))
                .toList();

        return new WorkoutResponse(
                workout.getWorkoutId(),
                workout.getTrainer().getTrainerId(),
                workout.getName(),
                workout.getDescription(),
                workout.getDifficultyLevel(),
                workout.getEstimatedDuration(),
                exercises,
                workout.getCreatedAt(),
                workout.getUpdatedAt()
        );
    }
}
