package com.quizapp.quiz.repository;

import com.quizapp.quiz.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Integer> {
}
