package com.quizapp.quiz.repository;

import com.quizapp.quiz.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findAllByOrderByOrderIndexAsc();
}
