package com.overload.server.service;

import com.overload.server.DTOs.workouts.requests.WorkoutExerciseRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutExerciseSetRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutRequest;
import com.overload.server.DTOs.workouts.responses.CreateWorkoutResponse;
import com.overload.server.DTOs.workouts.responses.WorkoutExerciseResponse;
import com.overload.server.DTOs.workouts.responses.WorkoutExerciseSetResponse;
import com.overload.server.DTOs.workouts.responses.WorkoutResponse;
import com.overload.server.exception.ResourceNotFoundException;
import com.overload.server.model.Exercise;
import com.overload.server.model.Trainer;
import com.overload.server.model.Workout;
import com.overload.server.model.WorkoutExerciseSet;
import com.overload.server.model.WorkoutExercises;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.TrainerRepo;
import com.overload.server.repo.WorkoutExercisesRepo;
import com.overload.server.repo.WorkoutRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    public CreateWorkoutResponse createWorkout(WorkoutRequest req, Long trainerId) {
        Trainer trainer = trainerRepo.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));

        Workout workout = new Workout();
        workout.setTrainer(trainer);
        workout.setName(req.name());
        workout.setDescription(req.description());
        workout.setDifficultyLevel(req.difficultyLevel());
        workout.setEstimatedDuration(req.estimatedDuration());

        Workout saved = workoutRepo.save(workout);
        return new CreateWorkoutResponse(saved.getWorkoutId());
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

    @Transactional
    public WorkoutResponse addExercise(Long workoutId, WorkoutExerciseRequest req, Long trainerId) {
        Workout workout = findOwned(workoutId, trainerId);

        Exercise exercise = exerciseRepo.findById(req.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        WorkoutExercises slot = new WorkoutExercises();
        slot.setWorkout(workout);
        slot.setExercise(exercise);
        slot.setExerciseOrder(req.exerciseOrder());
        slot.setWorkoutExerciseSet(req.sets().stream().map(s -> buildSet(s, slot)).toList());

        workoutExercisesRepo.save(slot);

        return toResponse(workoutRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found")));
    }

    @Transactional
    public WorkoutResponse saveExercises(Long workoutId, List<WorkoutExerciseRequest> requests, Long trainerId) {
        Workout workout = findOwned(workoutId, trainerId);

        workout.getExercises().clear();

        for (int i = 0; i < requests.size(); i++) {
            WorkoutExerciseRequest req = requests.get(i);
            Exercise exercise = exerciseRepo.findById(req.exerciseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

            WorkoutExercises slot = new WorkoutExercises();
            slot.setWorkout(workout);
            slot.setExercise(exercise);
            slot.setExerciseOrder(i + 1);
            slot.setWorkoutExerciseSet(req.sets().stream().map(s -> buildSet(s, slot)).toList());
            workout.getExercises().add(slot);
        }

        return toResponse(workoutRepo.save(workout));
    }

    @Transactional
    public WorkoutResponse updateExercise(Long workoutId, Long workoutExerciseId, WorkoutExerciseRequest req, Long trainerId) {
        findOwned(workoutId, trainerId);

        WorkoutExercises slot = workoutExercisesRepo
                .findByWorkoutExerciseIdAndWorkout_WorkoutId(workoutExerciseId, workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise slot not found"));

        slot.setExerciseOrder(req.exerciseOrder());
        slot.getWorkoutExerciseSet().clear();
        slot.getWorkoutExerciseSet().addAll(req.sets().stream().map(s -> buildSet(s, slot)).toList());

        workoutExercisesRepo.save(slot);

        return toResponse(workoutRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found")));
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
                .map(slot -> {
                    List<WorkoutExerciseSetResponse> sets = slot.getWorkoutExerciseSet().stream()
                            .map(s -> new WorkoutExerciseSetResponse(
                                    s.getSetId(),
                                    s.getSetOrder(),
                                    s.getDefaultReps(),
                                    s.getDefaultWeight()
                            ))
                            .toList();
                    return new WorkoutExerciseResponse(
                            slot.getWorkoutExerciseId(),
                            slot.getExerciseOrder(),
                            sets,
                            slot.getExercise().getExerciseId(),
                            slot.getExercise().getName(),
                            slot.getExercise().getMuscleGroup(),
                            slot.getExercise().getEquipmentType(),
                            slot.getExercise().getCategory()
                    );
                })
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

    private WorkoutExerciseSet buildSet(WorkoutExerciseSetRequest req, WorkoutExercises parent) {
        WorkoutExerciseSet set = new WorkoutExerciseSet();
        set.setSetOrder(req.setOrder());
        set.setDefaultReps(req.defaultReps());
        set.setDefaultWeight(req.defaultWeight());
        set.setWorkoutExercises(parent);
        return set;
    }
}
