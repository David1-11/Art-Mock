let examQuestions = [];
let currentIdx = 0;
let userAnswers = {};
let timeLeft = 3600; 
let timerInterval;
let securityWarnings = 0;

// 1. THE SHUFFLER (High Speed)
function fastShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 2. START EXAM
function startExam() {
    const nameInput = document.getElementById('student-name');
    if(!nameInput || !nameInput.value) return alert("Full Name Required!");

    examQuestions = [];
    currentIdx = 0;
    userAnswers = {};

    // Get 20 from each subject
    try {
        for(let subject in masterBank) {
            let shuffledSubject = fastShuffle([...masterBank[subject]]);
            examQuestions.push(...shuffledSubject.slice(0, 20));
        }
        // Shuffle the combined 60 questions
        fastShuffle(examQuestions);
    } catch (e) {
        console.error("Error loading questions. Check your masterBank structure.", e);
        return alert("Error loading questions!");
    }

    // UI Switch
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('exam-screen').classList.remove('hidden');
    
    startTimer();
    renderQuestion();
}

// 3. RENDER QUESTION
function renderQuestion() {
    if (examQuestions.length === 0) return;

    const q = examQuestions[currentIdx];
    
    // Update labels
    document.getElementById('q-number').innerText = `Question ${currentIdx + 1} of ${examQuestions.length}`;
    document.getElementById('q-text').innerText = q.q;
    
    // Options
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";
    
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'option-card';
        if (userAnswers[currentIdx] === opt) btn.classList.add('selected');
        
        btn.onclick = () => {
            userAnswers[currentIdx] = opt;
            renderQuestion(); // Refresh to show selection
        };
        grid.appendChild(btn);
    });

    // Control Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    // Logic: If on last question, hide Next and show Submit
    if (currentIdx === examQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
    }

    // Hide prev on first question
    prevBtn.style.display = currentIdx === 0 ? 'none' : 'inline-block';
}

// 4. NAVIGATION
function navigate(dir) {
    let newIdx = currentIdx + dir;
    if (newIdx >= 0 && newIdx < examQuestions.length) {
        currentIdx = newIdx;
        renderQuestion();
        window.scrollTo(0, 0);
    }
}

// 5. TIMER & FINISH
function startTimer() {
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft/60), s = timeLeft % 60;
        document.getElementById('timer-box').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        if(timeLeft <= 0) finishExam();
    }, 1000);
}

function finishExam() {
    let score = 0;
    examQuestions.forEach((q, i) => { if(userAnswers[i] === q.a) score++; });
    const name = document.getElementById('student-name').value;
    const phone = "2347082828150";
    const report = `*IBEJU SENIOR HIGH SCHOOL RESULT*%0A*Candidate:* ${name}%0A*Score:* ${score}/60%0A*Security:* ${securityWarnings} switches`;
    window.location.href = `https://wa.me/${phone}?text=${report}`;
}