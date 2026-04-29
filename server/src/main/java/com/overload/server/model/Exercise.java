package com.overload.server.model;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.MuscleGroup;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "exercises")
public class Exercise {
    
    @Id
    @GeneratedValue
    private long exercise_id;


    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private EquipmentType equipment_type;

    @NotNull
    @Column(nullable = false)
    private MuscleGroup muscle_group;


    private String description;
}
