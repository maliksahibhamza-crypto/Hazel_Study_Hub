
/* ======================================================
   HAZEl STUDY HUB
   MCQs | Flashcards | Study Planner | Progress Tracking
   ====================================================== */

"use strict";

const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "hazelStudyHub_v1";

const defaultState = {
  answers: [],
  sessions: [],
  knownCards: [],
  tasks: [],
  quizAttempts: 0
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object"
      ? { ...defaultState, ...saved }
      : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("Unable to save data on this device.");
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* ===================== MCQ LIBRARY ===================== */

const questions = [
  {
    subject: "Biology",
    q: "Which organelle is primarily responsible for ATP production during aerobic respiration?",
    options: ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"],
    answer: 1,
    explanation: "Mitochondria are the main site of aerobic respiration and oxidative phosphorylation."
  },
  {
    subject: "Biology",
    q: "Which molecule carries genetic information in most living organisms?",
    options: ["ATP", "Glucose", "DNA", "Cellulose"],
    answer: 2,
    explanation: "DNA stores hereditary information in its nucleotide sequence."
  },
  {
    subject: "Biology",
    q: "Which structure controls the movement of substances into and out of a cell?",
    options: ["Cell membrane", "Nucleolus", "Ribosome", "Chromosome"],
    answer: 0,
    explanation: "The selectively permeable cell membrane regulates movement between the cell and its surroundings."
  },
  {
    subject: "Biology",
    q: "What is the basic structural and functional unit of life?",
    options: ["Tissue", "Organ", "Organ system", "Cell"],
    answer: 3,
    explanation: "The cell is the basic structural and functional unit of living organisms."
  },
  {
    subject: "Biology",
    q: "Which hormone generally lowers blood glucose levels?",
    options: ["Glucagon", "Insulin", "Adrenaline", "Thyroxine"],
    answer: 1,
    explanation: "Insulin promotes glucose uptake and storage, helping lower blood glucose."
  },
  {
    subject: "Biology",
    q: "Which process produces two genetically similar daughter cells?",
    options: ["Meiosis", "Fertilization", "Mitosis", "Crossing over"],
    answer: 2,
    explanation: "Mitosis generally produces two daughter cells with the same chromosome number as the parent cell."
  },
  {
    subject: "Biology",
    q: "Which blood cells are primarily involved in oxygen transport?",
    options: ["Red blood cells", "Platelets", "Lymphocytes", "Monocytes"],
    answer: 0,
    explanation: "Red blood cells contain haemoglobin, which transports oxygen."
  },
  {
    subject: "Biology",
    q: "Which process allows plants to convert light energy into chemical energy?",
    options: ["Transpiration", "Fermentation", "Excretion", "Photosynthesis"],
    answer: 3,
    explanation: "Photosynthesis uses light energy to help synthesize organic molecules."
  },
  {
    subject: "Chemistry",
    q: "The atomic number of an element equals its number of:",
    options: ["Neutrons", "Protons", "Nucleons", "Electron shells"],
    answer: 1,
    explanation: "The atomic number is defined by the number of protons in the nucleus."
  },
  {
    subject: "Chemistry",
    q: "Which type of bond involves the sharing of electron pairs?",
    options: ["Ionic", "Metallic", "Covalent", "Hydrogen"],
    answer: 2,
    explanation: "Covalent bonds form when atoms share one or more pairs of electrons."
  },
  {
    subject: "Chemistry",
    q: "A solution with a pH of 3 is generally:",
    options: ["Acidic", "Neutral", "Basic", "Always saturated"],
    answer: 0,
    explanation: "At ordinary conditions, a pH below 7 indicates an acidic solution."
  },
  {
    subject: "Chemistry",
    q: "What is the approximate value of Avogadro's constant?",
    options: ["3.00 × 10⁸ mol⁻¹", "9.81 mol⁻¹", "6.02 × 10²³ mol⁻¹", "1.60 × 10⁻¹⁹ mol⁻¹"],
    answer: 2,
    explanation: "Avogadro's constant is approximately 6.022 × 10²³ entities per mole."
  },
  {
    subject: "Chemistry",
    q: "Oxidation is commonly associated with:",
    options: ["Gain of electrons", "Loss of electrons", "Gain of neutrons", "Loss of protons"],
    answer: 1,
    explanation: "Oxidation is defined as the loss of electrons; reduction is the gain of electrons."
  },
  {
    subject: "Chemistry",
    q: "Which gas is commonly released when an acid reacts with a carbonate?",
    options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon dioxide"],
    answer: 3,
    explanation: "An acid reacting with a carbonate generally produces a salt, water and carbon dioxide."
  },
  {
    subject: "Physics",
    q: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    answer: 2,
    explanation: "Force is measured in newtons (N), equivalent to kg·m/s²."
  },
  {
    subject: "Physics",
    q: "Which equation represents average speed?",
    options: ["Distance ÷ time", "Time ÷ distance", "Mass × acceleration", "Force ÷ area"],
    answer: 0,
    explanation: "Average speed equals total distance travelled divided by total time taken."
  },
  {
    subject: "Physics",
    q: "What is the approximate acceleration due to gravity near Earth's surface?",
    options: ["3.0 m/s²", "9.8 m/s²", "15 m/s²", "100 m/s²"],
    answer: 1,
    explanation: "The commonly used approximate value of g near Earth's surface is 9.8 m/s²."
  },
  {
    subject: "Physics",
    q: "Which quantity is measured in watts?",
    options: ["Energy", "Momentum", "Pressure", "Power"],
    answer: 3,
    explanation: "Power is the rate at which work is done or energy is transferred."
  },
  {
    subject: "Physics",
    q: "Ohm's law is represented by:",
    options: ["V = IR", "P = mv", "F = ma²", "W = mg/t"],
    answer: 0,
    explanation: "For an ohmic conductor under constant physical conditions, voltage equals current multiplied by resistance."
  },
  {
    subject: "English",
    q: "Choose the correct synonym of 'abundant'.",
    options: ["Scarce", "Plentiful", "Tiny", "Empty"],
    answer: 1,
    explanation: "'Abundant' means available in large quantities; 'plentiful' is a suitable synonym."
  },
  {
    subject: "English",
    q: "Choose the grammatically correct sentence.",
    options: [
      "She go to school daily.",
      "She going to school daily.",
      "She goes to school daily.",
      "She gone to school daily."
    ],
    answer: 2,
    explanation: "In the simple present tense, a third-person singular subject takes the verb form ending in -s or -es."
  },
  {
    subject: "English",
    q: "What is the opposite of 'expand'?",
    options: ["Increase", "Enlarge", "Extend", "Contract"],
    answer: 3,
    explanation: "'Contract' means to become smaller or narrower and is an antonym of 'expand'."
  },
  {
    subject: "English",
    q: "Choose the correct spelling.",
    options: ["Necessary", "Neccessary", "Necesary", "Necassary"],
    answer: 0,
    explanation: "The correct spelling is necessary: one c and two s letters."
  },
  {
    subject: "English",
    q: "Choose the correct passive form: 'The student solved the problem.'",
    options: [
      "The problem solves the student.",
      "The problem was solved by the student.",
      "The problem is solve by the student.",
      "The student was solved by the problem."
    ],
    answer: 1,
    explanation: "The simple past passive uses was/were + past participle."
  }
];

/* ====================== NAVIGATION ====================== */

function navigate(viewName) {
  const validViews = ["dashboard", "mcqs", "flashcards", "planner", "progress"];
  if (!validViews.includes(viewName)) return;

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `view-${viewName}`);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  const current = document.querySelector(`[data-view="${viewName}"]`);
  if ($("breadcrumbCurrent")) {
    $("breadcrumbCurrent").textContent =
      current ? current.textContent.trim() : viewName;
  }

  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (viewName === "progress") renderProgress();
  if (viewName === "planner") renderPlanner();
  if (viewName === "flashcards") renderFlashcard();
}

function closeSidebar() {
  $("sidebar")?.classList.remove("open");
  $("mobileOverlay")?.classList.remove("show");
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.view));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => navigate(button.dataset.go));
});

document.querySelectorAll("[data-subject]").forEach((button) => {
  button.addEventListener("click", () => {
    $("subjectFilter").value = button.dataset.subject;
    navigate("mcqs");
    showToast(`${button.dataset.subject} selected`);
  });
});

$("menuButton")?.addEventListener("click", () => {
  $("sidebar").classList.toggle("open");
  $("mobileOverlay").classList.toggle("show");
});

$("mobileOverlay")?.addEventListener("click", closeSidebar);

/* ====================== MCQ PRACTICE ====================== */

let quiz = null;

function getFilteredQuestions() {
  const subject = $("subjectFilter")?.value || "All";
  return questions.filter((item) =>
    subject === "All" || item.subject === subject
  );
}

function startQuiz() {
  const available = getFilteredQuestions();

  if (!available.length) {
    showToast("No questions available.");
    return;
  }

  const requested = $("questionCount")?.value || "10";
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const selected = requested === "all"
    ? shuffled
    : shuffled.slice(0, Number(requested));

  quiz = {
    questions: selected,
    index: 0,
    score: 0,
    selected: null,
    answers: [],
    finished: false
  };

  renderQuestion();
}

function renderQuestion() {
  if (!quiz) return;

  if (quiz.index >= quiz.questions.length) {
    finishQuiz();
    return;
  }

  const item = quiz.questions[quiz.index];
  const number = quiz.index + 1;
  const total = quiz.questions.length;
  const progress = ((number - 1) / total) * 100;

  $("quizPanel").innerHTML = `
    <div class="quiz-topline">
      <span>${escapeHTML(item.subject.toUpperCase())}</span>
      <span>QUESTION ${number} OF ${total}</span>
    </div>
    <div class="quiz-progress"><span style="width:${progress}%"></span></div>
    <h2 class="quiz-question">${escapeHTML(item.q)}</h2>
    <div class="options-list">
      ${item.options.map((option, index) => `
        <button class="option-btn" data-option="${index}">
          <span class="option-letter">${String.fromCharCode(65 + index)}</span>
          <span>${escapeHTML(option)}</span>
        </button>
      `).join("")}
    </div>
    <div id="answerFeedback"></div>
    <div class="quiz-actions">
      <small>Choose one answer</small>
      <button class="button button-primary" id="nextQuestion" disabled>
        ${number === total ? "See results" : "Next question →"}
      </button>
    </div>
  `;

  document.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => {
      chooseAnswer(Number(button.dataset.option));
    });
  });

  $("nextQuestion").addEventListener("click", () => {
    quiz.index++;
    quiz.selected = null;
    renderQuestion();
  });
}

function chooseAnswer(index) {
  if (!quiz || quiz.selected !== null) return;

  const item = quiz.questions[quiz.index];
  quiz.selected = index;

  const correct = index === item.answer;
  if (correct) quiz.score++;

  quiz.answers.push({
    subject: item.subject,
    question: item.q,
    correct,
    date: new Date().toISOString()
  });

  document.querySelectorAll("[data-option]").forEach((button) => {
    const optionIndex = Number(button.dataset.option);
    button.disabled = true;

    if (optionIndex === item.answer) {
      button.classList.add("correct");
    } else if (optionIndex === index) {
      button.classList.add("incorrect");
    }
  });

  $("answerFeedback").innerHTML = `
    <div class="feedback ${correct ? "good" : "bad"}">
      <strong>${correct ? "Correct!" : "Not quite."}</strong>
      ${escapeHTML(item.explanation)}
    </div>
  `;

  $("nextQuestion").disabled = false;
  $("nextQuestion").textContent =
    quiz.index === quiz.questions.length - 1
      ? "See results"
      : "Next question →";
}

function finishQuiz() {
  if (!quiz || quiz.finished) return;
  quiz.finished = true;

  const total = quiz.questions.length;
  const percentage = Math.round((quiz.score / total) * 100);

  state.answers.push(...quiz.answers);
  state.quizAttempts++;

  state.sessions.unshift({
    subject: $("subjectFilter")?.value || "All",
    score: quiz.score,
    total,
    percentage,
    date: new Date().toISOString()
  });

  state.sessions = state.sessions.slice(0, 30);
  saveState();
  renderStats();
  renderProgress();

  $("quizPanel").innerHTML = `
    <div class="result-screen">
      <div class="result-score">${percentage}%</div>
      <h2>Practice complete!</h2>
      <p>You answered ${quiz.score} out of ${total} questions correctly.</p>
      <p>${percentage >= 80
        ? "Excellent effort. Keep strengthening your understanding!"
        : "Good practice. Review the explanations and try again."}</p>
      <div class="result-actions">
        <button class="button button-primary" id="retryQuiz">Try again</button>
        <button class="button button-outline" id="reviewProgress">View progress</button>
      </div>
    </div>
  `;

  $("retryQuiz").addEventListener("click", startQuiz);
  $("reviewProgress").addEventListener("click", () => navigate("progress"));

  showToast("Quiz results saved on this device.");
}

$("startQuiz")?.addEventListener("click", startQuiz);
$("startQuizEmpty")?.addEventListener("click", startQuiz);

if ($("libraryCount")) $("libraryCount").textContent = questions.length;

/* ======================= FLASHCARDS ======================= */

const flashcards = [
  { subject: "Biology", q: "What is homeostasis?", a: "The maintenance of a relatively stable internal environment." },
  { subject: "Biology", q: "What is the main function of ribosomes?", a: "Protein synthesis." },
  { subject: "Biology", q: "What is an enzyme?", a: "A biological catalyst that speeds up a reaction without being consumed overall." },
  { subject: "Biology", q: "What is osmosis?", a: "Net movement of water across a selectively permeable membrane down its water potential gradient." },
  { subject: "Biology", q: "What is the role of haemoglobin?", a: "It transports oxygen in red blood cells." },
  { subject: "Chemistry", q: "What is a mole?", a: "The amount of substance containing approximately 6.022 × 10²³ specified entities." },
  { subject: "Chemistry", q: "What is an isotope?", a: "Atoms of the same element with the same proton number but different neutron numbers." },
  { subject: "Chemistry", q: "Define a covalent bond.", a: "A chemical bond formed by sharing electron pair(s) between atoms." },
  { subject: "Chemistry", q: "What does a catalyst do?", a: "It increases reaction rate by providing an alternative pathway with lower activation energy." },
  { subject: "Chemistry", q: "What is an acid in the Brønsted–Lowry model?", a: "A species that donates a proton (H⁺)." },
  { subject: "Physics", q: "Define velocity.", a: "Rate of change of displacement with time; it includes direction." },
  { subject: "Physics", q: "What is Newton's second law?", a: "The resultant force equals the rate of change of momentum; for constant mass, F = ma." },
  { subject: "Physics", q: "Define power.", a: "The rate at which work is done or energy is transferred." },
  { subject: "Physics", q: "What is the SI unit of electric current?", a: "Ampere (A)." },
  { subject: "English", q: "What is a synonym?", a: "A word or expression with the same or nearly the same meaning as another." },
  { subject: "English", q: "What is an antonym?", a: "A word with an opposite or contrasting meaning." }
];

let flashIndex = 0;
let flashFlipped = false;

function getFlashDeck() {
  const subject = $("flashSubject")?.value || "All";
  return flashcards.filter((card) =>
    subject === "All" || card.subject === subject
  );
}

function renderFlashcard() {
  const deck = getFlashDeck();

  if (!deck.length) return;

  if (flashIndex >= deck.length) flashIndex = 0;
  if (flashIndex < 0) flashIndex = deck.length - 1;

  const card = deck[flashIndex];
  flashFlipped = false;

  $("flashCard").classList.remove("flipped");
  $("flashSubjectBadge").textContent = card.subject.toUpperCase();
  $("flashQuestion").textContent = card.q;
  $("flashAnswer").textContent = card.a;
  $("flashCount").textContent = `Card ${flashIndex + 1} of ${deck.length}`;

  $("flashHint").textContent =
    "Tap the card to reveal the answer";

  const key = flashcards.indexOf(card);
  $("markKnown").textContent = state.knownCards.includes(key)
    ? "✓ Known"
    : "✓ I know this";
}

$("flashCard")?.addEventListener("click", () => {
  flashFlipped = !flashFlipped;
  $("flashCard").classList.toggle("flipped", flashFlipped);
  $("flashHint").textContent = flashFlipped
    ? "Think of the answer before moving on"
    : "Tap the card to reveal the answer";
});

$("flashPrev")?.addEventListener("click", () => {
  flashIndex--;
  renderFlashcard();
});

$("flashNext")?.addEventListener("click", () => {
  flashIndex++;
  renderFlashcard();
});

$("flashSubject")?.addEventListener("change", () => {
  flashIndex = 0;
  renderFlashcard();
});

$("markKnown")?.addEventListener("click", () => {
  const deck = getFlashDeck();
  if (!deck.length) return;

  const key = flashcards.indexOf(deck[flashIndex]);

  if (state.knownCards.includes(key)) {
    showToast("This card is already marked as known.");
    return;
  }

  state.knownCards.push(key);
  saveState();
  renderFlashcard();
  renderStats();
  renderProgress();
  showToast("Flashcard progress saved!");
});

/* ======================= STUDY PLANNER ======================= */

function renderPlanner() {
  const filter = $("taskFilter")?.value || "all";
  const today = localDate();

  let tasks = [...state.tasks];

  if (filter === "today") {
    tasks = tasks.filter((task) => task.date === today);
  } else if (filter === "open") {
    tasks = tasks.filter((task) => !task.done);
  } else if (filter === "done") {
    tasks = tasks.filter((task) => task.done);
  }

  tasks.sort((a, b) =>
    a.date.localeCompare(b.date) || a.id - b.id
  );

  const completed = state.tasks.filter((task) => task.done).length;

  $("taskSummary").textContent = state.tasks.length
    ? `${completed} of ${state.tasks.length} tasks completed`
    : "No tasks yet — add your first one.";

  if (!tasks.length) {
    $("plannerTasks").innerHTML =
      '<div class="empty-tasks">No tasks here yet.<br>Add a task to organize your study day.</div>';
    return;
  }

  $("plannerTasks").innerHTML = tasks.map((task) => `
    <div class="planner-task ${task.done ? "completed" : ""}">
      <button class="task-check ${task.done ? "done" : ""}"
        data-task-toggle="${task.id}"
        aria-label="${task.done ? "Mark incomplete" : "Complete task"}">
        ${task.done ? "✓" : ""}
      </button>
      <div class="planner-task-copy">
        <strong>${escapeHTML(task.title)}</strong>
        <p>${escapeHTML(task.subject)} · ${task.duration} min · ${escapeHTML(task.date)}</p>
      </div>
      <span class="task-tag">${task.done ? "Done" : "Planned"}</span>
      <button class="delete-task" data-task-delete="${task.id}" aria-label="Delete task">×</button>
    </div>
  `).join("");

  document.querySelectorAll("[data-task-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find(
        (item) => item.id === Number(button.dataset.taskToggle)
      );

      if (!task) return;

      task.done = !task.done;
      task.completedAt = task.done ? new Date().toISOString() : null;

      saveState();
      renderPlanner();
      renderDashboardTasks();
      renderStats();
      renderProgress();
    });
  });

  document.querySelectorAll("[data-task-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.taskDelete);

      state.tasks = state.tasks.filter((task) => task.id !== id);

      saveState();
      renderPlanner();
      renderDashboardTasks();
      renderStats();
      renderProgress();

      showToast("Task deleted.");
    });
  });
}

if ($("taskDate")) {
  $("taskDate").value = localDate();
}

$("taskFilter")?.addEventListener("change", renderPlanner);

$("taskForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = $("taskTitle").value.trim();
  const subject = $("taskSubject").value;
  const duration = Number($("taskDuration").value);
  const date = $("taskDate").value;

  if (!title || !date) {
    showToast("Please enter a task title and date.");
    return;
  }

  state.tasks.push({
    id: Date.now(),
    title,
    subject,
    duration,
    date,
    done: false,
    completedAt: null
  });

  saveState();

  $("taskTitle").value = "";
  $("taskDate").value = localDate();

  renderPlanner();
  renderDashboardTasks();
  renderStats();
  renderProgress();

  showToast("Study task added!");
});

/* ====================== DASHBOARD TASKS ====================== */

function renderDashboardTasks() {
  const container = $("dashboardTasks");
  if (!container) return;

  const today = localDate();

  const tasks = state.tasks
    .filter((task) => task.date === today)
    .sort((a, b) => Number(a.done) - Number(b.done))
    .slice(0, 4);

  if (!tasks.length) {
    container.innerHTML =
      '<div class="empty-small">No tasks planned for today. Add one to get started.</div>';
    return;
  }

  container.innerHTML = tasks.map((task) => `
    <div class="mini-task ${task.done ? "completed" : ""}">
      <button class="task-check ${task.done ? "done" : ""}"
        data-dashboard-toggle="${task.id}">
        ${task.done ? "✓" : ""}
      </button>
      <div class="mini-task-copy">
        <strong>${escapeHTML(task.title)}</strong>
        <small>${escapeHTML(task.subject)} · ${task.duration} min</small>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-dashboard-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find(
        (item) => item.id === Number(button.dataset.dashboardToggle)
      );

      if (!task) return;

      task.done = !task.done;
      task.completedAt = task.done ? new Date().toISOString() : null;

      saveState();
      renderDashboardTasks();
      renderPlanner();
      renderStats();
      renderProgress();
    });
  });
}

/* ====================== PROGRESS & STATS ====================== */

function renderStats() {
  const total = state.answers.length;
  const correct = state.answers.filter(
    (answer) => answer.correct
  ).length;

  const tasksDone = state.tasks.filter((task) => task.done);
  const minutes = tasksDone.reduce(
    (sum, task) => sum + task.duration,
    0
  );

  if ($("statAnswered")) $("statAnswered").textContent = total;

  if ($("statAccuracy")) {
    $("statAccuracy").textContent =
      `${total ? Math.round(correct / total * 100) : 0}%`;
  }

  if ($("statTasks")) {
    $("statTasks").textContent =
      `${tasksDone.length}/${state.tasks.length}`;
  }

  if ($("statCards")) {
    $("statCards").textContent = state.knownCards.length;
  }

  if ($("progressAnswered")) {
    $("progressAnswered").textContent = total;
  }

  if ($("progressCorrect")) {
    $("progressCorrect").textContent = correct;
  }

  if ($("progressKnown")) {
    $("progressKnown").textContent = state.knownCards.length;
  }

  if ($("progressMinutes")) {
    $("progressMinutes").textContent = minutes;
  }

  if ($("quizAttempts")) {
    $("quizAttempts").textContent = state.quizAttempts;
  }

  if ($("bestAccuracy")) {
    const best = state.sessions.length
      ? Math.max(...state.sessions.map(
          (session) => session.percentage
        ))
      : null;

    $("bestAccuracy").textContent =
      best === null ? "—" : `${best}%`;
  }
}

function renderProgress() {
  const container = $("subjectProgress");

  if (container) {
    const subjects = [
      "Biology",
      "Chemistry",
      "Physics",
      "English"
    ];

    container.innerHTML = subjects.map((subject) => {
      const answers = state.answers.filter(
        (item) => item.subject === subject
      );

      const correct = answers.filter(
        (item) => item.correct
      ).length;

      const accuracy = answers.length
        ? Math.round(correct / answers.length * 100)
        : 0;

      return `
        <div>
          <div class="progress-row-head">
            <strong>${subject}</strong>
            <span>
              ${answers.length
                ? `${accuracy}% · ${answers.length} attempted`
                : "Not attempted yet"}
            </span>
          </div>
          <div class="progress-track">
            <span style="width:${accuracy}%"></span>
          </div>
        </div>
      `;
    }).join("");
  }

  const recent = $("recentSessions");

  if (recent) {
    if (!state.sessions.length) {
      recent.innerHTML =
        '<div class="empty-small">Your completed quiz sessions will appear here.</div>';
    } else {
      recent.innerHTML = state.sessions.slice(0, 5).map((session) => `
        <div class="session-row">
          <div class="session-mark">✓</div>
          <div class="session-copy">
            <strong>${escapeHTML(session.subject)} practice</strong>
            <small>${new Date(session.date).toLocaleString()}</small>
          </div>
          <div class="session-score">
            ${session.score}/${session.total}
          </div>
        </div>
      `).join("");
    }
  }

  renderStats();
}

/* ====================== EXPORT PROGRESS ====================== */

$("exportProgress")?.addEventListener("click", () => {
  const data = {
    exportedAt: new Date().toISOString(),
    progress: state
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "hazel-study-progress.json";
  link.click();

  URL.revokeObjectURL(url);

  showToast("Progress export started.");
});

/* ====================== RESET PROGRESS ====================== */

$("resetProgress")?.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Reset all saved MCQ answers, quiz sessions, tasks and flashcard progress on this device?"
  );

  if (!confirmed) return;

  state = {
    ...defaultState,
    answers: [],
    sessions: [],
    knownCards: [],
    tasks: []
  };

  saveState();

  quiz = null;
  flashIndex = 0;

  renderStats();
  renderProgress();
  renderPlanner();
  renderDashboardTasks();
  renderFlashcard();

  $("quizPanel").innerHTML = `
    <div class="quiz-empty">
      <div class="empty-icon">✓</div>
      <h2>Ready when you are</h2>
      <p>Choose a subject and start a practice set. Your answers will contribute to your progress stats.</p>
      <button class="button button-primary" id="startQuizEmpty">
        Start practice
      </button>
    </div>
  `;

  $("startQuizEmpty").addEventListener("click", startQuiz);

  showToast("Local progress has been reset.");
});

/* ========================== INIT ========================== */

function initializeApp() {
  if ($("todayLabel")) {
    $("todayLabel").textContent = new Date().toLocaleDateString(
      undefined,
      {
        weekday: "short",
        month: "short",
        day: "numeric"
      }
    );
  }

  if ($("taskDate")) {
    $("taskDate").value = localDate();
  }

  renderStats();
  renderProgress();
  renderPlanner();
  renderDashboardTasks();
  renderFlashcard();
}

initializeApp();
      
