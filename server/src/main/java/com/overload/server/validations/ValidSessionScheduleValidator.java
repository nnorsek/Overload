package com.overload.server.validations;

import com.overload.server.DTOs.sessions.requests.CreateSessionRequest;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ValidSessionScheduleValidator implements ConstraintValidator<ValidScheduleSession, CreateSessionRequest> {
    
    @Override
    public boolean isValid(CreateSessionRequest req, ConstraintValidatorContext ctx) {
        if (req.scheduledStart() == null || req.scheduledEnd() == null) {
            return true;
        }
        return req.scheduledEnd().isAfter(req.scheduledStart());
    }
}
