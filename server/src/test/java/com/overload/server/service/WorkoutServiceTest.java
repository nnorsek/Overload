package com.overload.server.service;

import com.overload.server.DTOs.workouts.requests.WorkoutExerciseRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutExerciseSetRequest;
import com.overload.server.DTOs.workouts.requests.WorkoutRequest;
import com.overload.server.DTOs.workouts.responses.CreateWorkoutResponse;
import com.overload.server.DTOs.workouts.responses.WorkoutResponse;
import com.overload.server.enums.DifficultyLevel;
import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {

    @Mock WorkoutRepo workoutRepo;
    @Mock WorkoutExercisesRepo workoutExercisesRepo;
    @Mock TrainerRepo trainerRepo;
    @Mock ExerciseRepo exerciseRepo;
    @InjectMocks WorkoutService workoutService;

    private static final Long TRAINER_ID = 1L;
    private static final Long WORKOUT_ID = 10L;
    private static final Long EXERCISE_ID = 20L;
    private static final Long WORKOUT_EXERCISE_ID = 30L;

    private Trainer trainer;
    private Exercise exercise;
    private Workout workout;

    @BeforeEach
    void setUp() {
        trainer = new Trainer();
        trainer.setTrainerId(TRAINER_ID);

        exercise = Exercise.builder()
                .exerciseId(EXERCISE_ID)
                .name("Bench Press")
                .muscleGroup(MuscleGroup.CHEST)
                .equipmentType(EquipmentType.BARBELL)
                .category(ExerciseCategory.STRENGTH)
                .build();

        workout = new Workout();
        workout.setWorkoutId(WORKOUT_ID);
        workout.setTrainer(trainer);
        workout.setName("Push Day");
        workout.setDescription("Chest and triceps");
        workout.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        workout.setEstimatedDuration(60);
        workout.setCreatedAt(Instant.now());
        workout.setUpdatedAt(Instant.now());
    }

    // --- helper factories ---

    private WorkoutRequest workoutRequest() {
        return new WorkoutRequest("Push Day", "Chest and triceps", DifficultyLevel.INTERMEDIATE, 60);
    }

    private WorkoutExerciseSetRequest setRequest() {
        return new WorkoutExerciseSetRequest(1, 10, 60.0f);
    }

    private WorkoutExerciseRequest exerciseRequest() {
        return new WorkoutExerciseRequest(EXERCISE_ID, 1, List.of(setRequest()));
    }

    // helper: wire a set's setId so toResponse() can read it
    private WorkoutExercises buildSlotWithSet(Workout parent) {
        WorkoutExercises slot = new WorkoutExercises();
        slot.setWorkoutExerciseId(WORKOUT_EXERCISE_ID);
        slot.setWorkout(parent);
        slot.setExercise(exercise);
        slot.setExerciseOrder(1);

        WorkoutExerciseSet set = new WorkoutExerciseSet();
        set.setSetOrder(1);
        set.setDefaultReps(10);
        set.setDefaultWeight(60.0f);
        set.setWorkoutExercises(slot);
        slot.setWorkoutExerciseSet(new ArrayList<>(List.of(set)));
        return slot;
    }

    // ---- getAllWorkouts ----

    @Test
    void getAllWorkouts_returnsMappedListForTrainer() {
        workout.setExercises(new ArrayList<>());
        when(workoutRepo.findAllByTrainer_TrainerId(TRAINER_ID)).thenReturn(List.of(workout));

        List<WorkoutResponse> result = workoutService.getAllWorkouts(TRAINER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).workoutId()).isEqualTo(WORKOUT_ID);
        assertThat(result.get(0).trainerId()).isEqualTo(TRAINER_ID);
        assertThat(result.get(0).name()).isEqualTo("Push Day");
    }

    @Test
    void getAllWorkouts_emptyList_returnsEmpty() {
        when(workoutRepo.findAllByTrainer_TrainerId(TRAINER_ID)).thenReturn(List.of());

        List<WorkoutResponse> result = workoutService.getAllWorkouts(TRAINER_ID);

        assertThat(result).isEmpty();
    }

    // ---- getWorkout ----

    @Test
    void getWorkout_foundAndOwned_returnsFullResponse() {
        workout.setExercises(new ArrayList<>(List.of(buildSlotWithSet(workout))));
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));

        WorkoutResponse result = workoutService.getWorkout(WORKOUT_ID, TRAINER_ID);

        assertThat(result.workoutId()).isEqualTo(WORKOUT_ID);
        assertThat(result.exercises()).hasSize(1);
        assertThat(result.exercises().get(0).sets()).hasSize(1);
        assertThat(result.exercises().get(0).exerciseName()).isEqualTo("Bench Press");
    }

    @Test
    void getWorkout_notFound_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.getWorkout(WORKOUT_ID, TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    @Test
    void getWorkout_wrongTrainer_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.getWorkout(WORKOUT_ID, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    // ---- createWorkout ----

    @Test
    void createWorkout_savesAndReturnsId() {
        Workout saved = new Workout();
        saved.setWorkoutId(WORKOUT_ID);
        saved.setTrainer(trainer);
        saved.setName("Push Day");
        saved.setDescription("Chest and triceps");
        saved.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        saved.setEstimatedDuration(60);
        saved.setCreatedAt(Instant.now());
        saved.setUpdatedAt(Instant.now());

        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));
        when(workoutRepo.save(any(Workout.class))).thenReturn(saved);

        CreateWorkoutResponse response = workoutService.createWorkout(workoutRequest(), TRAINER_ID);

        assertThat(response.workoutId()).isEqualTo(WORKOUT_ID);
        verify(workoutRepo).save(any(Workout.class));
    }

    @Test
    void createWorkout_trainerNotFound_throwsResourceNotFoundException() {
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.createWorkout(workoutRequest(), TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Trainer not found");
    }

    // ---- updateWorkout ----

    @Test
    void updateWorkout_updatesFieldsAndReturnsResponse() {
        workout.setExercises(new ArrayList<>());
        WorkoutRequest req = new WorkoutRequest("Leg Day", "Quads and hamstrings", DifficultyLevel.ADVANCED, 75);

        Workout updated = new Workout();
        updated.setWorkoutId(WORKOUT_ID);
        updated.setTrainer(trainer);
        updated.setName("Leg Day");
        updated.setDescription("Quads and hamstrings");
        updated.setDifficultyLevel(DifficultyLevel.ADVANCED);
        updated.setEstimatedDuration(75);
        updated.setCreatedAt(Instant.now());
        updated.setUpdatedAt(Instant.now());
        updated.setExercises(new ArrayList<>());

        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(workoutRepo.save(any(Workout.class))).thenReturn(updated);

        WorkoutResponse result = workoutService.updateWorkout(WORKOUT_ID, req, TRAINER_ID);

        assertThat(result.name()).isEqualTo("Leg Day");
        assertThat(result.difficultyLevel()).isEqualTo(DifficultyLevel.ADVANCED);
        assertThat(result.estimatedDuration()).isEqualTo(75);
        verify(workoutRepo).save(workout);
    }

    @Test
    void updateWorkout_notFound_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.updateWorkout(WORKOUT_ID, workoutRequest(), TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    @Test
    void updateWorkout_wrongTrainer_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.updateWorkout(WORKOUT_ID, workoutRequest(), 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    // ---- deleteWorkout ----

    @Test
    void deleteWorkout_deletesWhenFound() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));

        workoutService.deleteWorkout(WORKOUT_ID, TRAINER_ID);

        verify(workoutRepo).delete(workout);
    }

    @Test
    void deleteWorkout_notFound_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.deleteWorkout(WORKOUT_ID, TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    @Test
    void deleteWorkout_wrongTrainer_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.deleteWorkout(WORKOUT_ID, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    // ---- addExercise ----

    @Test
    void addExercise_createsSlotWithSetsAndReturnsResponse() {
        workout.setExercises(new ArrayList<>());

        Workout refreshed = new Workout();
        refreshed.setWorkoutId(WORKOUT_ID);
        refreshed.setTrainer(trainer);
        refreshed.setName("Push Day");
        refreshed.setDescription("Chest and triceps");
        refreshed.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        refreshed.setEstimatedDuration(60);
        refreshed.setCreatedAt(Instant.now());
        refreshed.setUpdatedAt(Instant.now());
        refreshed.setExercises(new ArrayList<>(List.of(buildSlotWithSet(refreshed))));

        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.of(exercise));
        when(workoutExercisesRepo.save(any(WorkoutExercises.class))).thenAnswer(inv -> inv.getArgument(0));
        when(workoutRepo.findById(WORKOUT_ID)).thenReturn(Optional.of(refreshed));

        WorkoutResponse result = workoutService.addExercise(WORKOUT_ID, exerciseRequest(), TRAINER_ID);

        assertThat(result.exercises()).hasSize(1);
        assertThat(result.exercises().get(0).exerciseName()).isEqualTo("Bench Press");

        ArgumentCaptor<WorkoutExercises> captor = ArgumentCaptor.forClass(WorkoutExercises.class);
        verify(workoutExercisesRepo).save(captor.capture());
        assertThat(captor.getValue().getWorkoutExerciseSet()).hasSize(1);
        assertThat(captor.getValue().getWorkoutExerciseSet().get(0).getDefaultReps()).isEqualTo(10);
    }

    @Test
    void addExercise_exerciseNotFound_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.addExercise(WORKOUT_ID, exerciseRequest(), TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Exercise not found");
    }

    @Test
    void addExercise_workoutNotOwned_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.addExercise(WORKOUT_ID, exerciseRequest(), 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    // ---- saveExercises ----

    @Test
    void saveExercises_clearsExistingAndRecreates() {
        WorkoutExercises oldSlot = buildSlotWithSet(workout);
        workout.setExercises(new ArrayList<>(List.of(oldSlot)));

        WorkoutExerciseRequest req1 = new WorkoutExerciseRequest(EXERCISE_ID, 1, List.of(setRequest()));
        WorkoutExerciseRequest req2 = new WorkoutExerciseRequest(EXERCISE_ID, 2, List.of(setRequest()));

        Workout saved = new Workout();
        saved.setWorkoutId(WORKOUT_ID);
        saved.setTrainer(trainer);
        saved.setName("Push Day");
        saved.setDescription("Chest and triceps");
        saved.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        saved.setEstimatedDuration(60);
        saved.setCreatedAt(Instant.now());
        saved.setUpdatedAt(Instant.now());

        WorkoutExercises slot1 = buildSlotWithSet(saved);
        slot1.setExerciseOrder(1);
        WorkoutExercises slot2 = buildSlotWithSet(saved);
        slot2.setExerciseOrder(2);
        saved.setExercises(new ArrayList<>(List.of(slot1, slot2)));

        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.of(exercise));
        when(workoutRepo.save(any(Workout.class))).thenReturn(saved);

        WorkoutResponse result = workoutService.saveExercises(WORKOUT_ID, List.of(req1, req2), TRAINER_ID);

        assertThat(result.exercises()).hasSize(2);
        // Ordering preserved: slot at index 0 should have exerciseOrder 1
        assertThat(result.exercises().get(0).exerciseOrder()).isEqualTo(1);
        assertThat(result.exercises().get(1).exerciseOrder()).isEqualTo(2);
    }

    @Test
    void saveExercises_exerciseNotFound_throwsResourceNotFoundException() {
        workout.setExercises(new ArrayList<>());
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.saveExercises(WORKOUT_ID, List.of(exerciseRequest()), TRAINER_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Exercise not found");
    }

    @Test
    void saveExercises_batchOrderingPreserved() {
        workout.setExercises(new ArrayList<>());

        Long exerciseId2 = 21L;
        Exercise exercise2 = Exercise.builder()
                .exerciseId(exerciseId2)
                .name("Squat")
                .muscleGroup(MuscleGroup.LEGS)
                .equipmentType(EquipmentType.BARBELL)
                .category(ExerciseCategory.STRENGTH)
                .build();

        WorkoutExerciseRequest req1 = new WorkoutExerciseRequest(EXERCISE_ID, 99, List.of(setRequest()));
        WorkoutExerciseRequest req2 = new WorkoutExerciseRequest(exerciseId2, 99, List.of(setRequest()));

        Workout saved = new Workout();
        saved.setWorkoutId(WORKOUT_ID);
        saved.setTrainer(trainer);
        saved.setName("Push Day");
        saved.setDescription("Chest and triceps");
        saved.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        saved.setEstimatedDuration(60);
        saved.setCreatedAt(Instant.now());
        saved.setUpdatedAt(Instant.now());

        WorkoutExercises slot1 = buildSlotWithSet(saved);
        slot1.setExercise(exercise);
        slot1.setExerciseOrder(1);
        WorkoutExercises slot2 = buildSlotWithSet(saved);
        slot2.setExercise(exercise2);
        slot2.setExerciseOrder(2);
        saved.setExercises(new ArrayList<>(List.of(slot1, slot2)));

        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(exerciseRepo.findById(EXERCISE_ID)).thenReturn(Optional.of(exercise));
        when(exerciseRepo.findById(exerciseId2)).thenReturn(Optional.of(exercise2));
        when(workoutRepo.save(any(Workout.class))).thenAnswer(inv -> {
            Workout w = inv.getArgument(0);
            // Verify the service assigned 1-based order regardless of request value
            assertThat(w.getExercises().get(0).getExerciseOrder()).isEqualTo(1);
            assertThat(w.getExercises().get(1).getExerciseOrder()).isEqualTo(2);
            return saved;
        });

        workoutService.saveExercises(WORKOUT_ID, List.of(req1, req2), TRAINER_ID);
    }

    // ---- updateExercise ----

    @Test
    void updateExercise_updatesOrderAndSets() {
        workout.setExercises(new ArrayList<>());
        WorkoutExercises slot = buildSlotWithSet(workout);

        Workout refreshed = new Workout();
        refreshed.setWorkoutId(WORKOUT_ID);
        refreshed.setTrainer(trainer);
        refreshed.setName("Push Day");
        refreshed.setDescription("Chest and triceps");
        refreshed.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        refreshed.setEstimatedDuration(60);
        refreshed.setCreatedAt(Instant.now());
        refreshed.setUpdatedAt(Instant.now());
        refreshed.setExercises(new ArrayList<>(List.of(slot)));

        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(workoutExercisesRepo.findByWorkoutExerciseIdAndWorkout_WorkoutId(WORKOUT_EXERCISE_ID, WORKOUT_ID))
                .thenReturn(Optional.of(slot));
        when(workoutExercisesRepo.save(any(WorkoutExercises.class))).thenReturn(slot);
        when(workoutRepo.findById(WORKOUT_ID)).thenReturn(Optional.of(refreshed));

        WorkoutExerciseRequest req = new WorkoutExerciseRequest(EXERCISE_ID, 3, List.of(
                new WorkoutExerciseSetRequest(1, 12, 70.0f)
        ));

        workoutService.updateExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, req, TRAINER_ID);

        verify(workoutExercisesRepo).save(slot);
        assertThat(slot.getExerciseOrder()).isEqualTo(3);
        assertThat(slot.getWorkoutExerciseSet()).hasSize(1);
        assertThat(slot.getWorkoutExerciseSet().get(0).getDefaultReps()).isEqualTo(12);
    }

    @Test
    void updateExercise_slotNotFound_throwsResponseStatusException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(workoutExercisesRepo.findByWorkoutExerciseIdAndWorkout_WorkoutId(WORKOUT_EXERCISE_ID, WORKOUT_ID))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.updateExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, exerciseRequest(), TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Exercise slot not found");
    }

    // ---- removeExercise ----

    @Test
    void removeExercise_deletesSlot() {
        WorkoutExercises slot = buildSlotWithSet(workout);
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(workoutExercisesRepo.findByWorkoutExerciseIdAndWorkout_WorkoutId(WORKOUT_EXERCISE_ID, WORKOUT_ID))
                .thenReturn(Optional.of(slot));

        workoutService.removeExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, TRAINER_ID);

        verify(workoutExercisesRepo).delete(slot);
    }

    @Test
    void removeExercise_slotNotFound_throwsResponseStatusException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, TRAINER_ID)).thenReturn(Optional.of(workout));
        when(workoutExercisesRepo.findByWorkoutExerciseIdAndWorkout_WorkoutId(WORKOUT_EXERCISE_ID, WORKOUT_ID))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.removeExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Exercise slot not found");
    }

    @Test
    void removeExercise_workoutNotOwned_throwsResourceNotFoundException() {
        when(workoutRepo.findByWorkoutIdAndTrainerId(WORKOUT_ID, 99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.removeExercise(WORKOUT_ID, WORKOUT_EXERCISE_ID, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }
}
