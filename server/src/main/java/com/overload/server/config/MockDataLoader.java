package com.overload.server.config;

import com.overload.server.enums.DifficultyLevel;
import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
import com.overload.server.enums.SessionStatus;
import com.overload.server.model.Client;
import com.overload.server.model.Exercise;
import com.overload.server.model.Session;
import com.overload.server.model.Trainer;
import com.overload.server.model.Workout;
import com.overload.server.model.WorkoutExerciseSet;
import com.overload.server.model.WorkoutExercises;
import com.overload.server.repo.ClientRepo;
import com.overload.server.repo.ExerciseRepo;
import com.overload.server.repo.SessionRepo;
import com.overload.server.repo.TrainerRepo;
import com.overload.server.repo.WorkoutRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/*
 * Fills the database with sample data on startup so the app is usable
 * while there is no real database. Only runs when
 * overload.mock-data.enabled=true, and only into an empty database.
 */
@Component
@ConditionalOnProperty(name = "overload.mock-data.enabled", havingValue = "true")
public class MockDataLoader implements CommandLineRunner {

    public static final String TRAINER_EMAIL = "trainer@overload.dev";
    public static final String PASSWORD = "password123";

    private static final Logger log = LoggerFactory.getLogger(MockDataLoader.class);

    private final TrainerRepo trainerRepo;
    private final ClientRepo clientRepo;
    private final ExerciseRepo exerciseRepo;
    private final WorkoutRepo workoutRepo;
    private final SessionRepo sessionRepo;
    private final PasswordEncoder passwordEncoder;

    public MockDataLoader(TrainerRepo trainerRepo, ClientRepo clientRepo, ExerciseRepo exerciseRepo,
                          WorkoutRepo workoutRepo, SessionRepo sessionRepo, PasswordEncoder passwordEncoder) {
        this.trainerRepo = trainerRepo;
        this.clientRepo = clientRepo;
        this.exerciseRepo = exerciseRepo;
        this.workoutRepo = workoutRepo;
        this.sessionRepo = sessionRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (trainerRepo.count() > 0) {
            log.info("Database already has data, skipping mock data");
            return;
        }

        String passwordHash = passwordEncoder.encode(PASSWORD);

        Trainer trainer = trainerRepo.save(Trainer.builder()
                .firstName("Taylor")
                .lastName("Reed")
                .dateOfBirth(LocalDate.of(1990, 6, 15))
                .gender("FEMALE")
                .email(TRAINER_EMAIL)
                .passwordHash(passwordHash)
                .build());

        Client alice = clientRepo.save(client(trainer, passwordHash, "Alice", "Johnson", "alice@overload.dev",
                LocalDate.of(1998, 4, 12), "FEMALE", 160f, 145f, 65, "Lose weight",
                LocalDateTime.of(2026, 1, 15, 0, 0)));
        Client bob = clientRepo.save(client(trainer, passwordHash, "Bob", "Smith", "bob@overload.dev",
                LocalDate.of(1991, 9, 3), "MALE", 175f, 180f, 70, "Gain muscle",
                LocalDateTime.of(2025, 11, 10, 0, 0)));
        Client carmen = clientRepo.save(client(trainer, passwordHash, "Carmen", "Lee", "carmen@overload.dev",
                LocalDate.of(2002, 1, 27), "FEMALE", 140f, 130f, 63, "Maintain weight",
                LocalDateTime.of(2026, 2, 1, 0, 0)));

        // Default exercises (no trainer) are visible to every trainer.
        Exercise benchPress = exercise(null, "Barbell Bench Press", EquipmentType.BARBELL, MuscleGroup.CHEST,
                ExerciseCategory.STRENGTH, "Press the bar from chest to lockout while lying on a flat bench.");
        Exercise squat = exercise(null, "Back Squat", EquipmentType.BARBELL, MuscleGroup.LEGS,
                ExerciseCategory.STRENGTH, "Squat to depth with the bar across the upper back.");
        Exercise row = exercise(null, "Dumbbell Row", EquipmentType.DUMBBELL, MuscleGroup.BACK,
                ExerciseCategory.STRENGTH, "Row a dumbbell to the hip with one hand braced on a bench.");
        Exercise overheadPress = exercise(null, "Overhead Press", EquipmentType.BARBELL, MuscleGroup.SHOULDERS,
                ExerciseCategory.STRENGTH, "Press the bar from the front rack to overhead.");
        Exercise swing = exercise(null, "Kettlebell Swing", EquipmentType.KETTLEBELL, MuscleGroup.LEGS,
                ExerciseCategory.POWER, "Hinge and drive the hips to swing the bell to chest height.");
        Exercise plank = exercise(null, "Plank", EquipmentType.BODY_WEIGHT, MuscleGroup.CORE,
                ExerciseCategory.CORE, "Hold a straight line from head to heels on the forearms.");
        Exercise pushdown = exercise(trainer, "Cable Tricep Pushdown", EquipmentType.CABLE, MuscleGroup.TRICEPS,
                ExerciseCategory.STRENGTH, "Extend the elbows to push the cable attachment down.");
        Exercise curl = exercise(trainer, "Banded Bicep Curl", EquipmentType.RESISTANCE_BAND, MuscleGroup.BICEPS,
                ExerciseCategory.STRENGTH, "Curl the band handles toward the shoulders.");
        exerciseRepo.saveAll(List.of(benchPress, squat, row, overheadPress, swing, plank, pushdown, curl));

        Workout upperBody = workout(trainer, "Upper Body Strength", "Heavy compound pressing and pulling.",
                DifficultyLevel.INTERMEDIATE, 60);
        addExercise(upperBody, benchPress, 1, new int[][] {{8, 135}, {8, 155}, {6, 175}});
        addExercise(upperBody, row, 2, new int[][] {{10, 50}, {10, 50}});

        Workout legDay = workout(trainer, "Leg Day", "Squat-focused lower body session.",
                DifficultyLevel.ADVANCED, 75);
        addExercise(legDay, squat, 1, new int[][] {{5, 185}, {5, 205}, {5, 225}});
        addExercise(legDay, swing, 2, new int[][] {{20, 53}});

        Workout fullBody = workout(trainer, "Beginner Full Body", "Low-volume introduction to the main lifts.",
                DifficultyLevel.BEGINNER, 45);
        workoutRepo.saveAll(List.of(upperBody, legDay, fullBody));

        // Sessions are scheduled relative to today so the dashboard always has something to show.
        LocalDate today = LocalDate.now();
        sessionRepo.saveAll(List.of(
                session(trainer, upperBody, Set.of(alice), today.atTime(9, 0), 60, SessionStatus.CONFIRMED),
                session(trainer, legDay, Set.of(bob), today.atTime(11, 30), 45, SessionStatus.PENDING),
                session(trainer, fullBody, Set.of(alice, carmen), today.atTime(17, 0), 60, SessionStatus.CONFIRMED),
                session(trainer, fullBody, Set.of(carmen), today.minusDays(2).atTime(15, 0), 30,
                        SessionStatus.COMPLETED)));

        log.info("Loaded mock data. Log in as {} / {}", TRAINER_EMAIL, PASSWORD);
    }

    private Client client(Trainer trainer, String passwordHash, String firstName, String lastName, String email,
                          LocalDate dateOfBirth, String gender, float startingWeight, float currentWeight,
                          int height, String goal, LocalDateTime startedAt) {
        return Client.builder()
                .trainer(trainer)
                .passwordHash(passwordHash)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .dateOfBirth(dateOfBirth)
                .gender(gender)
                .startingWeight(startingWeight)
                .currentWeight(currentWeight)
                .height(height)
                .goal(goal)
                .startedAt(startedAt)
                .build();
    }

    private Exercise exercise(Trainer trainer, String name, EquipmentType equipmentType, MuscleGroup muscleGroup,
                              ExerciseCategory category, String description) {
        return Exercise.builder()
                .trainer(trainer)
                .name(name)
                .equipmentType(equipmentType)
                .muscleGroup(muscleGroup)
                .category(category)
                .description(description)
                .build();
    }

    private Workout workout(Trainer trainer, String name, String description, DifficultyLevel difficulty,
                            int estimatedDuration) {
        Workout workout = new Workout();
        workout.setTrainer(trainer);
        workout.setName(name);
        workout.setDescription(description);
        workout.setDifficultyLevel(difficulty);
        workout.setEstimatedDuration(estimatedDuration);
        return workout;
    }

    // Each entry in repsAndWeights is one set: {reps, weight}.
    private void addExercise(Workout workout, Exercise exercise, int order, int[][] repsAndWeights) {
        WorkoutExercises slot = new WorkoutExercises();
        slot.setWorkout(workout);
        slot.setExercise(exercise);
        slot.setExerciseOrder(order);

        for (int i = 0; i < repsAndWeights.length; i++) {
            WorkoutExerciseSet set = new WorkoutExerciseSet();
            set.setWorkoutExercises(slot);
            set.setSetOrder(i + 1);
            set.setDefaultReps(repsAndWeights[i][0]);
            set.setDefaultWeight((float) repsAndWeights[i][1]);
            slot.getWorkoutExerciseSet().add(set);
        }

        workout.getExercises().add(slot);
    }

    private Session session(Trainer trainer, Workout workout, Set<Client> clients, LocalDateTime start,
                            int durationMinutes, SessionStatus status) {
        Session session = new Session();
        session.setTrainer(trainer);
        session.setWorkout(workout);
        session.getClients().addAll(clients);
        session.setScheduledStart(start);
        session.setScheduledEnd(start.plusMinutes(durationMinutes));
        session.setStatus(status);
        return session;
    }
}
