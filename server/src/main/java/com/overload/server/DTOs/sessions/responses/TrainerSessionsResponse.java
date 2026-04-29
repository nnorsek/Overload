package com.overload.server.DTOs.sessions.responses;

import com.overload.server.enums.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TrainerSessionsResponse {

    private Long sessionId;
    private String clientFirstName;
    private String clientLastName;
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private SessionStatus status;
    private String notes;
}
