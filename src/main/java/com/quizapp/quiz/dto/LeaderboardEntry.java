package com.quizapp.quiz.dto;

public class LeaderboardEntry {
    private int rank;
    private String name;
    private int score;
    private int totalQuestions;
    private int timeTakenSeconds;

    public LeaderboardEntry(int rank, String name, int score, int totalQuestions, int timeTakenSeconds) {
        this.rank = rank;
        this.name = name;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public int getRank() { return rank; }
    public String getName() { return name; }
    public int getScore() { return score; }
    public int getTotalQuestions() { return totalQuestions; }
    public int getTimeTakenSeconds() { return timeTakenSeconds; }
}
