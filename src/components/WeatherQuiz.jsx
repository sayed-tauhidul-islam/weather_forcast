import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

export default function WeatherQuiz({ theme }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      question: "What causes rain?",
      options: ["Water vapor condensing", "Clouds colliding", "Wind pressure", "Sun heating"],
      correct: 0,
      explanation: "Rain forms when water vapor in clouds condenses into water droplets."
    },
    {
      question: "At what temperature does water freeze?",
      options: ["-10°C", "0°C", "5°C", "10°C"],
      correct: 1,
      explanation: "Water freezes at 0°C (32°F) at standard atmospheric pressure."
    },
    {
      question: "What is a hurricane called in the Pacific?",
      options: ["Cyclone", "Typhoon", "Tornado", "Monsoon"],
      correct: 1,
      explanation: "Hurricanes are called typhoons in the Pacific Ocean."
    },
    {
      question: "Which cloud type produces thunderstorms?",
      options: ["Cirrus", "Stratus", "Cumulus", "Cumulonimbus"],
      correct: 3,
      explanation: "Cumulonimbus clouds are tall and produce thunderstorms."
    },
    {
      question: "What does 'UV Index' measure?",
      options: ["Air quality", "Ultraviolet radiation", "Visibility", "Wind speed"],
      correct: 1,
      explanation: "UV Index measures the strength of ultraviolet radiation from the sun."
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
        <h3 className={`text-2xl font-bold ${theme.text} mb-6 text-center`}>Quiz Complete!</h3>
        <div className="text-center">
          <div className="text-6xl mb-4">{score >= 4 ? '🏆' : score >= 3 ? '🥈' : '📚'}</div>
          <div className={`text-4xl font-bold ${theme.text} mb-4`}>
            {score} / {questions.length}
          </div>
          <div className={`text-xl ${theme.text} mb-6`}>
            {score >= 4 ? 'Excellent! Weather Expert!' : 
             score >= 3 ? 'Great! Keep learning!' : 
             'Good try! Study more!'}
          </div>
          <button
            onClick={resetQuiz}
            className={`px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${theme.accent} text-white ${theme.glow} shadow-xl hover:scale-105`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className={`${theme.card} rounded-3xl p-8 ${theme.glow} shadow-2xl border border-white/30`}>
      <h3 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <HelpCircle className="w-6 h-6" />
        Weather Quiz
      </h3>
      
      <div className="mb-6">
        <div className={`text-sm ${theme.text} opacity-70 mb-2`}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className={`text-xl font-bold ${theme.text} mb-6`}>{currentQ.question}</div>

      <div className="space-y-3">
        {currentQ.options.map((option, index) => (
          <button
            key={index}
            onClick={() => selectedAnswer === null && handleAnswer(index)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 rounded-xl border transition-all text-left ${
              selectedAnswer === null
                ? `${theme.card} border-white/20 hover:scale-105 ${theme.text}`
                : selectedAnswer === index
                ? index === currentQ.correct
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-red-500/20 border-red-500'
                : index === currentQ.correct
                ? 'bg-green-500/20 border-green-500'
                : `${theme.card} border-white/10 opacity-50`
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {selectedAnswer !== null && (
                index === currentQ.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : selectedAnswer === index ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <div className={`mt-6 p-4 rounded-xl ${theme.card} border border-white/20 ${theme.text}`}>
          <div className="font-semibold mb-2">💡 Did you know?</div>
          {currentQ.explanation}
        </div>
      )}

      <div className={`mt-6 text-sm ${theme.text} opacity-70 text-center`}>
        Score: {score} / {currentQuestion}
      </div>
    </div>
  );
}
