
const questionBank = [
    {
        question: "What does CSS stand for?",
        choices: [
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Colorful Style Sheets"
        ],
        correctAnswer: 1
    },
    {
        question: "Which language provides structure to a webpage?",
        choices: ["Java", "CSS", "HTML", "Python"],
        correctAnswer: 2
    },
    {
        question: "Which language makes a webpage interactive?",
        choices: ["HTML", "CSS", "JavaScript", "SQL"],
        correctAnswer: 2
    },
    {
        question: "Which HTML tag creates a paragraph?",
        choices: ["<h1>", "<p>", "<img>", "<table>"],
        correctAnswer: 1
    },
    {
        question: "Which symbol selects an ID in CSS?",
        choices: [".", "#", "*", "&"],
        correctAnswer: 1
    },
    {
        question: "Which HTML tag creates a hyperlink?",
        choices: ["<a>", "<p>", "<h2>", "<footer>"],
        correctAnswer: 0
    },
    {
        question: "Which keyword can declare a variable in JavaScript?",
        choices: ["paint", "style", "let", "design"],
        correctAnswer: 2
    },
    {
        question: "Which HTML tag displays an image?",
        choices: ["<picturefile>", "<image>", "<img>", "<src>"],
        correctAnswer: 2
    },
    {
        question: "Which CSS property changes text colour?",
        choices: ["font-size", "background", "text-align", "color"],
        correctAnswer: 3
    },
    {
        question: "Which method selects an element using its ID?",
        choices: [
            "document.getElementById()",
            "document.createElement()",
            "document.write()",
            "document.remove()"
        ],
        correctAnswer: 0
    }
];

// Game variables
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let questions = [];
let answerChecked = false;

// HTML elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionElement = document.getElementById("question");
const choicesElement = document.getElementById("choices");
const progressElement = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const scoreDisplay = document.getElementById("score-display");
const feedbackElement = document.getElementById("feedback");

const finalScoreElement = document.getElementById("final-score");
const resultMessageElement = document.getElementById("result-message");
const highScoreElement = document.getElementById("high-score");

// Button events
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", returnToStart);

// Shuffle questions using the Fisher-Yates algorithm
function shuffleQuestions(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

// Start or reset the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    answerChecked = false;

    questions = shuffleQuestions(questionBank);

    startScreen.classList.add("hidden");
    resultsScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    scoreDisplay.textContent = "Score: 0";

    showQuestion();
}

// Display the current question and its choices
function showQuestion() {
    selectedAnswer = null;
    answerChecked = false;
    nextBtn.disabled = true;

    feedbackElement.textContent = "";
    feedbackElement.className = "";

    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;

    progressElement.textContent =
        `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    progressBar.style.width =
        `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    choicesElement.innerHTML = "";

    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "choice-btn";
        button.textContent = choice;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        choicesElement.appendChild(button);
    });

    nextBtn.textContent =
        currentQuestionIndex === questions.length - 1
            ? "See Results"
            : "Next";
}

// Handle the user's answer
function selectAnswer(index) {
    if (answerChecked) return;

    selectedAnswer = index;

    const currentQuestion = questions[currentQuestionIndex];
    const choiceButtons =
        choicesElement.querySelectorAll(".choice-btn");

    choiceButtons.forEach((button, buttonIndex) => {
        button.classList.remove("selected");
        button.disabled = true;

        if (buttonIndex === currentQuestion.correctAnswer) {
            button.classList.add("correct");
        }
    });

    const selectedButton = choiceButtons[index];
    selectedButton.classList.add("selected");

    if (selectedAnswer === currentQuestion.correctAnswer) {
        feedbackElement.textContent = "Correct answer! Well done!";
        feedbackElement.className = "correct-text";
    } else {
        selectedButton.classList.add("incorrect");
        feedbackElement.textContent =
            "Not quite! The correct answer is highlighted in green.";
        feedbackElement.className = "incorrect-text";
    }

    answerChecked = true;
    nextBtn.disabled = false;
}

// Check the answer and move to the next question
function nextQuestion() {
    if (selectedAnswer === null || !answerChecked) return;

    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
        score++;
    }

    scoreDisplay.textContent = `Score: ${score}`;

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Display the final results
function showResults() {
    quizScreen.classList.add("hidden");
    resultsScreen.classList.remove("hidden");

    finalScoreElement.textContent =
        `You scored ${score}/${questions.length}!`;

    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
        resultMessageElement.textContent =
            "Perfect score! Outstanding work!";
    } else if (percentage >= 70) {
        resultMessageElement.textContent =
            "Excellent job! You know your stuff!";
    } else if (percentage >= 40) {
        resultMessageElement.textContent =
            "Good effort! Keep practising and improving.";
    } else {
        resultMessageElement.textContent =
            "Keep learning! Every attempt helps you improve.";
    }

    saveHighScore();
}

// Save the best score in the browser
function saveHighScore() {
    let previousBest = 0;

    try {
        previousBest =
            Number(localStorage.getItem("quizAppHighScore")) || 0;
    } catch (error) {
        console.warn("High score storage is unavailable.");
    }

    const bestScore = Math.max(previousBest, score);

    try {
        localStorage.setItem("quizAppHighScore", bestScore);
    } catch (error) {
        console.warn("Could not save the high score.");
    }

    highScoreElement.textContent =
        `Best Score: ${bestScore}/${questions.length}`;
}

// Return to the start screen and reset the game
function returnToStart() {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswer = null;
    answerChecked = false;
    questions = [];

    resultsScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");

    progressBar.style.width = "0%";
}
