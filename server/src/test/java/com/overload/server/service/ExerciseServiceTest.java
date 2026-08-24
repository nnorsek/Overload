package com.overload.server.service;

import com.overload.server.DTOs.exercises.repsonses.ExerciseResponse;
import com.overload.server.DTOs.exercises.requests.CreateExerciseRequest;
import com.overload.server.DTOs.exercises.requests.UpdateExerciseRequest;
import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
import com.overload.server.exception.ResourceNotFoundException;
import com.overload.server.model.Exercise;
import com.overload.server.model.Trainer;
import com.overload.server.model.TrainerHiddenExercise;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.TrainerHiddenExerciseRepo;
import com.overload.server.repo.TrainerRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseServiceTest {

    @Mock ExerciseRepo exerciseRepo;
    @Mock TrainerRepo trainerRepo;
    @Mock TrainerHiddenExerciseRepo hiddenExerciseRepo;
    @InjectMocks ExerciseService exerciseService;

    private static final Long TRAINER_ID = 1L;
    private static final Long EXERCISE_ID = 10L;
    private static final Long DEFAULT_EXERCISE_ID = 20L;

    private Trainer trainer;
    private Exercise trainerExercise;
    private Exercise defaultExercise;
    private CreateExerciseRequest createRequest;
    private UpdateExerciseRequest updateRequest;

    @BeforeEach
    void setUp() {
        trainer = new Trainer();
        trainer.setTrainerId(TRAINER_ID);

        trainerExercise = Exercise.builder()
                .exerciseId(EXERCISE_ID)
                .name("Bench Press")
                .equipmentType(EquipmentType.BARBELL)
                .muscleGroup(MuscleGroup.CHEST)
                .category(ExerciseCategory.STRENGTH)
                .description("Chest compound")
                .trainer(trainer)
                .build();

        defaultExercise = Exercise.builder()
                .exerciseId(DEFAULT_EXERCISE_ID)
                .name("Push Up")
                .equipmentType(EquipmentType.BODY_WEIGHT)
                .muscleGroup(MuscleGroup.CHEST)
                .category(ExerciseCategory.STRENGTH)
                .description("Default bodyweight")
                .trainer(null)
                .build();

        createRequest = new CreateExerciseRequest(
                "Squat",
                "Leg compound",
                ExerciseCategory.STRENGTH,
                EquipmentType.BARBELL,
                MuscleGroup.LEGS
        );

        updateRequest = new UpdateExerciseRequest(
                "Updated Name",
                "Updated description",
                EquipmentType.DUMBBELL,
                MuscleGroup.BICEPS,
                ExerciseCategory.STRENGTH
        );
    }

    // --- findAllExercisesByTrainerId ---

    @Test
    void findAllExercisesByTrainerId_trainerNotFound_throws() {
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> exerciseService.findAllExercisesByTrainerId(TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Trainer not found");
    }

    @Test
    void findAllExercisesByTrainerId_returnsExercises() {
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));
        when(exerciseRepo.findAllByTrainerIdOrDefault(TRAINER_ID))
                .thenReturn(List.of(trainerExercise, defaultExercise));

        List<ExerciseResponse> result = exerciseService.findAllExercisesByTrainerId(TRAINER_ID);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).exerciseId()).isEqualTo(EXERCISE_ID);
        assertThat(result.get(1).trainerId()).isNull();
    }

    // --- createExercise ---

    @Test
    void createExercise_success_savesExercise() {
        when(exerciseRepo.existsByName(createRequest.name(), TRAINER_ID)).thenReturn(false);
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));

        exerciseService.createExercise(createRequest, TRAINER_ID);

        ArgumentCaptor<Exercise> captor = ArgumentCaptor.forClass(Exercise.class);
        verify(exerciseRepo).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Squat");
        assertThat(captor.getValue().getTrainer()).isEqualTo(trainer);
    }

    @Test
    void createExercise_duplicateName_throws() {
        when(exerciseRepo.existsByName(createRequest.name(), TRAINER_ID)).thenReturn(true);

        assertThatThrownBy(() -> exerciseService.createExercise(createRequest, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Exercise already exists");

        verify(exerciseRepo, never()).save(any());
    }

    // --- deleteExercise ---

    @Test
    void deleteExercise_defaultExercise_createsHiddenRecord() {
        when(exerciseRepo.findDefaultById(DEFAULT_EXERCISE_ID)).thenReturn(Optional.of(defaultExercise));
        when(hiddenExerciseRepo.existsByTrainer_TrainerIdAndExercise_ExerciseId(TRAINER_ID, DEFAULT_EXERCISE_ID))
                .thenReturn(false);
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));
        when(exerciseRepo.findById(DEFAULT_EXERCISE_ID)).thenReturn(Optional.of(defaultExercise));

        exerciseService.deleteExercise(DEFAULT_EXERCISE_ID, TRAINER_ID);

        ArgumentCaptor<TrainerHiddenExercise> captor = ArgumentCaptor.forClass(TrainerHiddenExercise.class);
        verify(hiddenExerciseRepo).save(captor.capture());
        assertThat(captor.getValue().getTrainer()).isEqualTo(trainer);
        assertThat(captor.getValue().getExercise()).isEqualTo(defaultExercise);
        verify(exerciseRepo, never()).deleteById(any());
    }

    @Test
    void deleteExercise_defaultExerciseAlreadyHidden_doesNothing() {
        when(exerciseRepo.findDefaultById(DEFAULT_EXERCISE_ID)).thenReturn(Optional.of(defaultExercise));
        when(hiddenExerciseRepo.existsByTrainer_TrainerIdAndExercise_ExerciseId(TRAINER_ID, DEFAULT_EXERCISE_ID))
                .thenReturn(true);

        exerciseService.deleteExercise(DEFAULT_EXERCISE_ID, TRAINER_ID);

        verify(hiddenExerciseRepo, never()).save(any());
        verify(exerciseRepo, never()).deleteById(any());
    }

    @Test
    void deleteExercise_customExercise_hardDeletes() {
        when(exerciseRepo.findDefaultById(EXERCISE_ID)).thenReturn(Optional.empty());
        when(exerciseRepo.existsByIdAndTrainerId(EXERCISE_ID, TRAINER_ID)).thenReturn(true);

        exerciseService.deleteExercise(EXERCISE_ID, TRAINER_ID);

        verify(exerciseRepo).deleteById(EXERCISE_ID);
    }

    @Test
    void deleteExercise_notFound_throws() {
        when(exerciseRepo.findDefaultById(EXERCISE_ID)).thenReturn(Optional.empty());
        when(exerciseRepo.existsByIdAndTrainerId(EXERCISE_ID, TRAINER_ID)).thenReturn(false);

        assertThatThrownBy(() -> exerciseService.deleteExercise(EXERCISE_ID, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Exercise not found");

        verify(exerciseRepo, never()).deleteById(any());
    }

    // --- updateExercise ---

    @Test
    void updateExercise_defaultExercise_forksNewExercise() {
        when(exerciseRepo.findDefaultById(DEFAULT_EXERCISE_ID)).thenReturn(Optional.of(defaultExercise));
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));

        Exercise fork = Exercise.builder()
                .exerciseId(99L)
                .name(updateRequest.name())
                .description(updateRequest.description())
                .equipmentType(updateRequest.equipmentType())
                .muscleGroup(updateRequest.muscleGroup())
                .category(updateRequest.category())
                .trainer(trainer)
                .originalExerciseId(DEFAULT_EXERCISE_ID)
                .build();
        when(exerciseRepo.save(any(Exercise.class))).thenReturn(fork);

        ExerciseResponse result = exerciseService.updateExercise(updateRequest, DEFAULT_EXERCISE_ID, TRAINER_ID);

        ArgumentCaptor<Exercise> captor = ArgumentCaptor.forClass(Exercise.class);
        verify(exerciseRepo).save(captor.capture());
        assertThat(captor.getValue().getOriginalExerciseId()).isEqualTo(DEFAULT_EXERCISE_ID);
        assertThat(captor.getValue().getTrainer()).isEqualTo(trainer);
        assertThat(result.exerciseId()).isEqualTo(99L);
    }

    @Test
    void updateExercise_customExercise_updatesInPlace() {
        when(exerciseRepo.findDefaultById(EXERCISE_ID)).thenReturn(Optional.empty());
        when(exerciseRepo.findByExerciseIdAndTrainerId(EXERCISE_ID, TRAINER_ID))
                .thenReturn(Optional.of(trainerExercise));
        when(exerciseRepo.save(trainerExercise)).thenReturn(trainerExercise);

        exerciseService.updateExercise(updateRequest, EXERCISE_ID, TRAINER_ID);

        assertThat(trainerExercise.getName()).isEqualTo(updateRequest.name());
        assertThat(trainerExercise.getDescription()).isEqualTo(updateRequest.description());
        verify(exerciseRepo).save(trainerExercise);
    }

    @Test
    void updateExercise_customExerciseNotFound_throws() {
        when(exerciseRepo.findDefaultById(EXERCISE_ID)).thenReturn(Optional.empty());
        when(exerciseRepo.findByExerciseIdAndTrainerId(EXERCISE_ID, TRAINER_ID))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> exerciseService.updateExercise(updateRequest, EXERCISE_ID, TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Exercise not found");

        verify(exerciseRepo, never()).save(any());
    }
}
