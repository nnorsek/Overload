package com.overload.server.service;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.DTOs.exercises.requests.CreateExerciseRequest;
import com.overload.server.DTOs.exercises.requests.UpdateExerciseRequest;
import com.overload.server.exception.ResourceNotFoundException;
import com.overload.server.model.Exercise;
import com.overload.server.model.Trainer;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.TrainerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepo exerciseRepo;

    private final TrainerRepo trainerRepo;

    public List<ExerciseResponse> findAllExercisesByTrainerId(Long trainerId) {

        if (!trainerRepo.findById(trainerId).isPresent()) {
            throw new ResourceNotFoundException("Trainer not found with id: " + trainerId);
        }

       return exerciseRepo.findAllByTrainerIdOrDefault(trainerId)
            .stream().map(this::toResponse).toList();
    }

    public void createExercise(CreateExerciseRequest request, Long trainerId) {
        if (exerciseRepo.existsByName(request.name(), trainerId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exercise already exists");
        }

        Trainer trainer = trainerRepo.findById(trainerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trainer not found"));

        Exercise exercise = Exercise.builder()
                .name(request.name())
                .muscleGroup(request.muscleGroup())
                .description(request.description())
                .equipmentType(request.equipmentType())
                .category(request.category())
                .trainer(trainer)
                .build();

        exerciseRepo.save(exercise);
    }

    public void deleteExercise(Long exerciseId, Long trainerId) {

        if (!exerciseRepo.existsByIdAndTrainerId(exerciseId, trainerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found");
        }

        exerciseRepo.deleteById(exerciseId);
    }

    public ExerciseResponse updateExercise(UpdateExerciseRequest req, Long exerciseId, Long trainerId) {

        Exercise exercise = exerciseRepo.findByExerciseIdAndTrainer_TrainerId(exerciseId, trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        exercise.setName(req.name());
        exercise.setDescription(req.description());
        exercise.setMuscleGroup(req.muscleGroup());
        exercise.setEquipmentType(req.equipmentType());
        exercise.setCategory(req.category());

        return toResponse(exerciseRepo.save(exercise));
    }

    private ExerciseResponse toResponse(Exercise exercise) {
        return new ExerciseResponse(
            exercise.getExerciseId(),
            exercise.getName(),
            exercise.getEquipmentType(),
            exercise.getMuscleGroup(),
            exercise.getCategory(),
            exercise.getDescription()
        );
    }
}
