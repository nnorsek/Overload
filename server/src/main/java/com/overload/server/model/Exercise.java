package com.overload.server.model;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.MuscleGroup;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "exercises")
public class Exercise {
    
    @Id
    @GeneratedValue
    private Long exerciseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private EquipmentType equipmentType;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private MuscleGroup muscleGroup;

    private String description;
}
