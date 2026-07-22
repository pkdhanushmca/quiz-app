package com.quizapp.quiz.controller;

import com.quizapp.quiz.dto.LeaderboardEntry;
import com.quizapp.quiz.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final QuizService quizService;

    public LeaderboardController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/top3")
    public ResponseEntity<List<LeaderboardEntry>> topThree() {
        return ResponseEntity.ok(quizService.getTopThree());
    }
}
