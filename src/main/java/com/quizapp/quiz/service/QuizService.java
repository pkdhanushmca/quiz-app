package com.quizapp.quiz.service;

import com.quizapp.quiz.dto.*;
import com.quizapp.quiz.model.*;
import com.quizapp.quiz.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class QuizService {

	private final ParticipantRepository participantRepository;
	private final QuestionRepository questionRepository;
	private final SubmissionRepository submissionRepository;
	private final AnswerRepository answerRepository;

	public QuizService(ParticipantRepository participantRepository, QuestionRepository questionRepository,
			SubmissionRepository submissionRepository, AnswerRepository answerRepository) {
		this.participantRepository = participantRepository;
		this.questionRepository = questionRepository;
		this.submissionRepository = submissionRepository;
		this.answerRepository = answerRepository;
	}

	public Participant registerParticipant(ParticipantRequest req) {
		if (req.getEmail() != null && !req.getEmail().isBlank()
				&& participantRepository.existsByEmail(req.getEmail())) {
			throw new NoSuchElementException("Email address already registered");
//			throw new DuplicateResourceException("Email already exists");
		}
		Participant p = new Participant(req.getName().trim(), req.getEmail().trim(), req.getAddress());
		return participantRepository.save(p);
	}

	public List<QuestionPublicDto> getQuestions() {
		return questionRepository.findAllByOrderByOrderIndexAsc().stream().map(QuestionPublicDto::from)
				.collect(Collectors.toList());
	}

	@Transactional
	public QuizResultResponse submitQuiz(SubmitQuizRequest req) {
		Participant participant = participantRepository.findById(req.getParticipantId())
				.orElseThrow(() -> new NoSuchElementException("Participant not found"));

		List<Question> allQuestions = questionRepository.findAll();
		Map<Integer, Question> questionById = new HashMap<>();
		for (Question q : allQuestions) {
			questionById.put(q.getId(), q);
		}

		Submission submission = new Submission();
		submission.setParticipant(participant);
		submission.setTotalQuestions(req.getAnswers().size());
		submission.setTimeTakenSeconds(req.getTimeTakenSeconds() == null ? 0 : req.getTimeTakenSeconds());
		submission = submissionRepository.save(submission);

		int score = 0;
		for (SubmitQuizRequest.AnswerItem item : req.getAnswers()) {
			Question q = questionById.get(item.getQuestionId());
			if (q == null)
				continue;

			boolean correct = q.getCorrectOption().equalsIgnoreCase(item.getSelectedOption());
			if (correct)
				score++;

			Answer answer = new Answer();
			answer.setSubmission(submission);
			answer.setQuestion(q);
			answer.setSelectedOption(item.getSelectedOption());
			answer.setCorrect(correct);
			answerRepository.save(answer);
		}

		submission.setScore(score);
		submission = submissionRepository.save(submission);

		long rank = submissionRepository.countByScoreGreaterThan(score) + 1;

		return new QuizResultResponse(submission.getId(), submission.getScore(), submission.getTotalQuestions(),
				submission.getTimeTakenSeconds(), rank);
	}

//	public List<LeaderboardEntry> getTopThree() {
//		List<Submission> top = submissionRepository.findTopRanked(PageRequest.of(0, 3));
//		List<LeaderboardEntry> result = new java.util.ArrayList<>();
//		int rank = 1;
//		for (Submission s : top) {
//			result.add(new LeaderboardEntry(rank++, s.getParticipant().getName(), s.getScore(), s.getTotalQuestions(),
//					s.getTimeTakenSeconds()));
//		}
//		return result;
//	}

	public List<LeaderboardEntry> getTopThree() {
		List<Submission> top = submissionRepository.findTopRanked(PageRequest.of(0, 3));
		List<LeaderboardEntry> result = new java.util.ArrayList<>();
		int rank = 1;
		for (Submission s : top) {
			result.add(new LeaderboardEntry(rank++, s.getParticipant().getName(), s.getScore(), s.getTotalQuestions(),
					s.getTimeTakenSeconds()));
		}
		return result;
	}
}
