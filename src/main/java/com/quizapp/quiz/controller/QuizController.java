package com.quizapp.quiz.controller;

import com.quizapp.quiz.dto.*;
import com.quizapp.quiz.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionPublicDto>> getQuestions() {
        return ResponseEntity.ok(quizService.getQuestions());
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizResultResponse> submit(@Valid @RequestBody SubmitQuizRequest request) {
        return ResponseEntity.ok(quizService.submitQuiz(request));
    }
}
