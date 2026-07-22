package com.quizapp.quiz.controller;

import com.quizapp.quiz.dto.ParticipantRequest;
import com.quizapp.quiz.model.Participant;
import com.quizapp.quiz.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final QuizService quizService;

    public ParticipantController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody ParticipantRequest request) {
        Participant p = quizService.registerParticipant(request);
        return ResponseEntity.ok(Map.of(
                "participantId", p.getId(),
                "name", p.getName()
        ));
    }
}
