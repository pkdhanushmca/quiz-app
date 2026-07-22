package com.quizapp.quiz.repository;

import com.quizapp.quiz.model.Submission;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    // Ranked by highest score first, then fastest completion time
//    @Query("SELECT s FROM Submission s ORDER BY s.score DESC, s.timeTakenSeconds ASC")
//    List<Submission> findTopRanked(Pageable pageable);
	
	@Query("""
			SELECT s
			FROM Submission s
			JOIN FETCH s.participant
			ORDER BY s.score DESC, s.timeTakenSeconds ASC
			""")
			List<Submission> findTopRanked(Pageable pageable);

    long countByScoreGreaterThan(Integer score);
}
