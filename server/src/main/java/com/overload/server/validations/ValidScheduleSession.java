package com.overload.server.validations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = ValidSessionScheduleValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidScheduleSession {
    String message() default "scheduledEnd must be after scheduledStart";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
