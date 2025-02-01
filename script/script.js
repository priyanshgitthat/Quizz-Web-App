// alert("Hey Buddy")


// --------------- hamburger menu ------------------
const menuBtn = document.querySelector('#menu-btn')
const nav = document.querySelector('nav')

menuBtn.addEventListener('click', (e) => {
    console.log(e,e.target)
    nav.classList.toggle('active');
})

Array.from(nav.children).forEach(e => {
    console.log(e);
    e.addEventListener('click', () => {
        nav.classList.remove('active');
    })
    
})



// --------------------- subject selection --------------------
const subjectBoxes = document.querySelectorAll('.sub-box');
subjectBoxes.forEach(box => {
    box.addEventListener('click', () => {
        const selectedSubject = box.textContent;
        localStorage.setItem('selectedSubject', selectedSubject);
        window.location.href = 'quizz.html'; // Redirect to quiz.html
    });
});

// Update subject-to-category mapping
const subjectCategoryMap = {
    "General Knowledge": 9,   // General Knowledge category
    "History": 23,            // Entertainment category (Film)
    "Computers": 18,          // Science: Computers
    "Nature": 17,             // Science: Nature
    "Geography": 22           // Science: Geography
};

// Get the selected subject from localStorage
const selectedSubject = localStorage.getItem('selectedSubject');

// Get the category ID for the selected subject
const categoryId = subjectCategoryMap[selectedSubject] || 9; // Default to General Knowledge if not found

// Fetch quiz data from the API
document.getElementById('start-quiz').addEventListener('click', async () => {
    const quizContainer = document.getElementById('quiz-container');
    const selectedDifficulty = document.getElementById('difficulty').value;

    // Show loading text while fetching the quiz
    quizContainer.innerHTML = '<h2>Loading Quiz...</h2>';

    try {
        // Fetch quiz data from the API based on the category and difficulty
        const response = await fetch(`https://opentdb.com/api.php?amount=20&category=${categoryId}&difficulty=${selectedDifficulty}&type=multiple`);

        if (!response.ok) {
            throw new Error('Failed to fetch quiz data please try again');
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if data exists and contains questions
        if (data && data.results && data.results.length > 0) {
            // Clear loading text
            quizContainer.innerHTML = '';

            console.log(data.results);

            // Function to dynamically generate quiz based on fetched data
            const generateQuiz = (questions) => {
                questions.forEach((question, index) => {
                    const questionBox = document.createElement('div');
                    questionBox.classList.add('quiz-box');
                    
                    const questionTitle = document.createElement('h3');
                    questionTitle.textContent = `${index + 1}. ${question.question}`;
                    questionTitle.style.color="#f3bc77";
                    questionBox.appendChild(questionTitle);
                    
                    const optionsContainer = document.createElement('div');
                    optionsContainer.classList.add('options');
                    
                    // Combine correct answer and incorrect answers
                    const allOptions = [...question.incorrect_answers, question.correct_answer];
                    
                    // Shuffle the options if needed (optional)
                    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

                    // Create radio buttons for each option
                    shuffledOptions.forEach(option => {
                        const optionLabel = document.createElement('label');
                        const optionInput = document.createElement('input');
                        optionInput.type = 'radio';
                        optionInput.name = `question-${index}`;
                        optionInput.value = option;
                        optionLabel.appendChild(optionInput);
                        optionLabel.appendChild(document.createTextNode(option));
                        optionsContainer.appendChild(optionLabel);
                    });

                    questionBox.appendChild(optionsContainer);
                    quizContainer.appendChild(questionBox);
                });
            };

            // Call the function to display the quiz questions
            generateQuiz(data.results);

            // Create submit button
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Quiz';
            quizContainer.appendChild(submitButton);

            // Add event listener to submit button
            submitButton.addEventListener('click', () => {
                let score = 0;
            
                // Loop through all questions and check answers
                data.results.forEach((question, index) => {
                    const selectedAnswer = document.querySelector(`input[name="question-${index}"]:checked`);
                    const questionBox = document.querySelector(`.quiz-box:nth-child(${index + 1})`);
            
                    // Check if an answer was selected
                    if (selectedAnswer) {
                        // If the selected answer is correct, increment the score
                        if (selectedAnswer.value === question.correct_answer) {
                            score++;
                            selectedAnswer.parentElement.style.color = 'green'; // Highlight correct answer in green
                        } else {
                            selectedAnswer.parentElement.style.color = 'red'; // Highlight wrong answer in red
                        }
                    }
            
                    // Highlight correct answer (even if not selected) in green
                    const correctOption = [...questionBox.querySelectorAll('input')].find(input => input.value === question.correct_answer);
                    if (correctOption) {
                        correctOption.parentElement.style.color = 'green'; // Correct answer in green
                    }
                });
            

                // Display score in an alert
    // Create and display the score on the page
             const userScore = document.createElement('h2');
             userScore.classList.add('user-score')
             userScore.style.color="#f3bc77";
            userScore.textContent = `Your score is: ${score} / ${data.results.length}`;
             quizContainer.appendChild(userScore);
                // alert(`Your score is: ${score} / ${data.results.length}`);
            });

        } else {
            quizContainer.innerHTML = '<h3>No questions available for this category and difficulty level.</h3>';
        }

    } catch (error) {
        quizContainer.innerHTML = `<h3>Error: ${error.message}</h3>`;
    }
});







