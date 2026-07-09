// ===============================
//  ACCOUNT + AGE VERIFICATION
// ===============================

function verifyAge() {
  const age = parseInt(document.getElementById("age-input").value);
  if (isNaN(age)) {
    alert("Please enter a valid age.");
    return;
  }
  localStorage.setItem("codelingo_age", age);

  if (age < 18) {
    alert("You're under 18 — CodeLingo is FREE for you.");
  }

  document.getElementById("age-popup").classList.add("hidden");
}

function openAuth() {
  document.getElementById("auth-modal").classList.remove("hidden");
}

function closeAuth() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function registerUser() {
  const name = document.getElementById("auth-name").value;
  const email = document.getElementById("auth-email").value;
  const pass = document.getElementById("auth-pass").value;
  const age = parseInt(document.getElementById("auth-age").value);

  if (!name || !email || !pass || isNaN(age)) {
    alert("Please fill in all fields.");
    return;
  }

  const plan = age < 18 ? "FREE_YOUTH" : "NONE";

  const user = {
    name,
    email,
    pass,
    age,
    plan,
    progress_language: 0,
    progress_code: 0,
    total_xp: 0,
    level: 0
  };

  localStorage.setItem("codelingo_user", JSON.stringify(user));

  alert(age < 18
    ? "Welcome! You're under 18, so CodeLingo is FREE for you forever."
    : "Account created! Choose your plan anytime.");

  updateDashboard();
  closeAuth();
  lexSay("Welcome, " + name + "!");
}


// ===============================
//  XP + LEVEL SYSTEM
// ===============================

function addXP(type, amount) {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  if (type === "code") user.progress_code += amount;
  if (type === "language") user.progress_language += amount;

  user.total_xp = user.progress_code + user.progress_language;
  user.level = Math.floor(user.total_xp / 100);

  localStorage.setItem("codelingo_user", JSON.stringify(user));
  updateDashboard();
  lexSay("XP gained! Keep going.");
}


// ===============================
//  ACHIEVEMENTS
// ===============================

function checkAchievements() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  let achievements = [];

  if (user.progress_language >= 50) achievements.push("Language Novice");
  if (user.progress_code >= 50) achievements.push("Code Novice");
  if (user.level >= 5) achievements.push("Level 5 Achiever");
  if (user.level >= 10) achievements.push("Level 10 Prodigy");

  document.getElementById("ach-list").innerHTML =
    achievements.map(a => `<div class='pill'>${a}</div>`).join("");
}


// ===============================
//  LEADERBOARD
// ===============================

const sampleUsers = [
  { name: "Luca", total_xp: 420 },
  { name: "Sara", total_xp: 350 },
  { name: "Mia", total_xp: 280 }
];

function updateLeaderboard() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  let list = [...sampleUsers];

  if (user) {
    list.push({ name: user.name || "You", total_xp: user.total_xp || 0 });
  }

  list.sort((a, b) => b.total_xp - a.total_xp);

  document.getElementById("lb-list").innerHTML = list
    .map((u, i) => `<div><span>#${i + 1} ${u.name}</span><span>${u.total_xp} XP</span></div>`)
    .join("");
}


// ===============================
//  AVATAR SYSTEM
// ===============================

function updateAvatar() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  const badge = document.getElementById("avatar-badge");
  const xp = user.total_xp || 0;

  if (xp < 100) badge.innerText = "New learner";
  else if (xp < 300) badge.innerText = "Rising creator";
  else if (xp < 600) badge.innerText = "CodeLingo pro";
  else badge.innerText = "Legend";

  const circle = document.getElementById("avatar-circle");
  if (xp >= 600) circle.style.background = "linear-gradient(135deg, gold, orange)";
}


// ===============================
//  TITLES SYSTEM
// ===============================

function updateTitle() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  let title = "Learner";

  if (user.total_xp > 300) title = "Creator";
  if (user.total_xp > 600) title = "Prodigy";
  if (user.total_xp > 1000) title = "Mastermind";

  const streak = parseInt(localStorage.getItem("codelingo_streak") || "0");
  if (streak >= 7) title = "Weekly Grinder";
  if (streak >= 30) title = "Monthly Machine";

  const el = document.getElementById("dash-title");
  if (el) el.innerText = title;
}


// ===============================
//  SMART RECOMMENDATIONS
// ===============================

function recommendNext() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  let rec = "";

  if (user.progress_language < 30) rec = "Italian Basics Lesson 2";
  else if (user.progress_code < 30) rec = "JavaScript Variables Challenge";
  else if (user.total_xp < 200) rec = "Dual Practice: Italian + JS";
  else rec = "Advanced Project: Build a Translator";

  const el = document.getElementById("dash-rec");
  if (el) el.innerText = rec;

  lexSay("I recommend: " + rec);
}


// ===============================
//  DASHBOARD UPDATE
// ===============================

function updateDashboard() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  document.getElementById("dash-name").innerText = user.name;
  document.getElementById("lang-progress").innerText = user.progress_language + "%";
  document.getElementById("code-progress").innerText = user.progress_code + "%";
  document.getElementById("dash-plan").innerText =
    user.plan === "FREE_YOUTH" ? "Youth Free Access" : "Standard / No plan";

  checkAchievements();
  updateLeaderboard();
  updateAvatar();
  updateTitle();
  recommendNext();
  updateBadges();
  updateInventory();

  lexSay("Welcome to your dashboard, " + user.name + "!");
}


// ===============================
//  DAILY STREAK
// ===============================

function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem("codelingo_last");

  if (last !== today) {
    let streak = parseInt(localStorage.getItem("codelingo_streak") || "0");
    streak++;
    localStorage.setItem("codelingo_streak", streak);
    localStorage.setItem("codelingo_last", today);
    notify("🔥 Daily streak: " + streak);
  }
}
</script>
<script>
// ===============================
//  LESSON ENGINE
// ===============================

const lessons = {
  "italian-beginner": {
    title: "Italian Beginner – Lesson 1: Greetings",
    steps: [
      "Learn 'Ciao' (hi/bye).",
      "Learn 'Buongiorno' (good morning).",
      "Practice 'Come ti chiami?' (What's your name?).",
      "Introduce yourself: 'Mi chiamo ...'."
    ]
  },
  "js-basics": {
    title: "JavaScript Basics – Lesson 1: Variables",
    steps: [
      "Understand what a variable is.",
      "Learn 'let' and 'const'.",
      "Write a variable: let x = 5;",
      "Log it: console.log(x);"
    ]
  }
};

let currentLessonId = null;

function openCourse(id) {
  currentLessonId = id;
  const lesson = lessons[id];
  if (!lesson) {
    alert("Course not ready yet.");
    return;
  }

  document.getElementById("lesson-title").innerText = lesson.title;
  document.getElementById("lesson-steps").innerHTML =
    lesson.steps.map(s => `<li>${s}</li>`).join("");

  notify("Lesson loaded: " + lesson.title);
  lexSay("Let's go through this lesson together.");
  scrollToSection("lesson-viewer");
}

function completeLesson() {
  if (!currentLessonId) {
    alert("No lesson selected.");
    return;
  }

  addXP("language", 20);
  addXP("code", 20);
  addItem("Lesson Token");
  notify("Lesson completed! XP added.");
  lexSay("Nice work finishing that lesson!");
}


// ===============================
//  QUIZ ENGINE
// ===============================

const quizData = [
  {
    q: "What does 'Come ti chiami?' mean?",
    options: ["How are you?", "What's your name?", "Where are you from?"],
    correct: 1
  },
  {
    q: "Which keyword declares a variable in JavaScript?",
    options: ["var", "make", "define"],
    correct: 0
  }
];

function loadQuiz() {
  const q = quizData[Math.floor(Math.random() * quizData.length)];
  document.getElementById("quiz-question").innerText = q.q;

  document.getElementById("quiz-options").innerHTML = q.options
    .map((opt, i) => `<button class='btn-secondary' onclick='checkQuiz(${i}, ${q.correct})'>${opt}</button>`)
    .join("");
}

function checkQuiz(i, correct) {
  if (i === correct) {
    notify("Correct!");
    addXP("language", 5);
    addXP("code", 5);
    addItem("Quiz Token");
    lexSay("Correct answer! Nice.");
  } else {
    notify("Incorrect, try again!");
    lexSay("Almost! Try again.");
  }
  loadQuiz();
}


// ===============================
//  CODING PLAYGROUND
// ===============================

function runCode() {
  const code = document.getElementById("code-editor").value;
  try {
    const result = eval(code);
    document.getElementById("output").innerText = result;
  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}


// ===============================
//  LANGUAGE CHAT
// ===============================

function sendChat() {
  const msg = document.getElementById("chat-input").value;
  if (!msg) return;

  const reply = "LEX: '" + msg + "' means: [demo translation coming soon].";
  document.getElementById("chat-log").innerHTML += "<p>" + reply + "</p>";
  document.getElementById("chat-input").value = "";

  lexSay("Nice Italian sentence!");
}
</script>
<script>
// ===============================
//  BADGES
// ===============================

function updateBadges() {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  if (!user) return;

  const badges = [];

  if (user.total_xp >= 100) badges.push("XP 100");
  if (user.total_xp >= 300) badges.push("XP 300");
  if (user.total_xp >= 600) badges.push("XP 600");
  if (user.level >= 5) badges.push("Level 5");
  if (user.level >= 10) badges.push("Level 10");

  const streak = parseInt(localStorage.getItem("codelingo_streak") || "0");
  if (streak >= 7) badges.push("7‑Day Streak");

  const el = document.getElementById("badge-gallery");
  if (!el) return;

  el.innerHTML = badges.map(b => `<span class="pill">${b}</span>`).join("");
}


// ===============================
//  INVENTORY
// ===============================

function addItem(item) {
  const inv = JSON.parse(localStorage.getItem("codelingo_inventory") || "[]");
  inv.push(item);
  localStorage.setItem("codelingo_inventory", JSON.stringify(inv));
  updateInventory();
}

function updateInventory() {
  const inv = JSON.parse(localStorage.getItem("codelingo_inventory") || "[]");
  const el = document.getElementById("inv-list");
  if (!el) return;

  el.innerHTML = inv.map(i => `<span class="pill">${i}</span>`).join("");
}


// ===============================
//  MINI‑GAME: WORD SCRAMBLE
// ===============================

const scrambleWords = ["ciao", "buono", "scuola", "javascript", "python"];
let currentScramble = "";

function loadScramble() {
  const w = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
  currentScramble = w;
  const el = document.getElementById("scramble-word");
  if (!el) return;
  el.innerText = w.split("").sort(() => Math.random() - 0.5).join("");
}

function checkScramble() {
  const input = document.getElementById("scramble-input");
  if (!input) return;

  const guess = input.value.trim();

  if (guess === currentScramble) {
    notify("Correct!");
    addXP("language", 10);
    addXP("code", 10);
    addItem("Scramble Token");
    lexSay("Nice unscramble!");
  } else {
    notify("Try again!");
  }

  loadScramble();
}


// ===============================
//  CODING CHALLENGES
// ===============================

const challenges = [
  {
    text: "Write a function that returns 5.",
    test: code => eval(code)() === 5
  },
  {
    text: "Write a function that returns the sum of 2 and 3.",
    test: code => eval(code)() === 5
  }
];

let currentChallenge = null;

function loadChallenge() {
  currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  const el = document.getElementById("challenge-text");
  if (!el) return;
  el.innerText = currentChallenge.text;
}

function submitChallenge() {
  const codeArea = document.getElementById("challenge-code");
  if (!codeArea || !currentChallenge) return;

  const code = codeArea.value;

  try {
    if (currentChallenge.test(code)) {
      notify("Challenge complete!");
      addXP("code", 20);
      addItem("Challenge Token");
      lexSay("You crushed that challenge!");
    } else {
      notify("Incorrect, try again.");
    }
  } catch {
    notify("Error in code.");
  }

  loadChallenge();
}


// ===============================
//  DAILY MISSIONS
// ===============================

const missions = [
  "Complete a quiz",
  "Finish a lesson",
  "Send a message in global chat",
  "Play a mini-game"
];

function loadMission() {
  const m = missions[Math.floor(Math.random() * missions.length)];
  const box = document.getElementById("mission-box");
  if (!box) return;

  box.innerText = m;
  localStorage.setItem("codelingo_mission", m);
}

function completeMission() {
  notify("Mission complete! +50 XP");
  addXP("code", 25);
  addXP("language", 25);
  addItem("Mission Token");
  lexSay("Daily mission done!");
  loadMission();
}
</script>
<script>
// ===============================
//  LEX PERSONALITY ENGINE
// ===============================

const lexLines = [
  "Keep grinding, champ.",
  "Your brain is leveling up.",
  "Languages + code = unstoppable.",
  "You’re built different.",
  "This is elite work.",
  "Stay locked in.",
  "You’re cooking.",
  "Elite mentality.",
  "This is top‑tier work."
];

function lexSay(msg) {
  const bubble = document.getElementById("lex-assistant");
  bubble.innerText = "LEX: " + msg;

  setTimeout(() => {
    bubble.innerText = "LEX: Need help?";
  }, 4000);
}

function lexRandom() {
  lexSay(lexLines[Math.floor(Math.random() * lexLines.length)]);
}

setInterval(lexRandom, 15000);

document.getElementById("lex-assistant").onclick = () => {
  alert("LEX: I'm here to help you learn languages AND code!");
};


// ===============================
//  NOTIFICATION SYSTEM
// ===============================

function notify(msg) {
  const n = document.getElementById("notify");
  n.innerText = msg;
  n.classList.remove("hidden");

  setTimeout(() => n.classList.add("hidden"), 3000);
}


// ===============================
//  GLOBAL CHAT ROOM
// ===============================

let roomMessages = [
  { user: "Luca", text: "Italian tip: practice with songs!" },
  { user: "Sara", text: "JS tip: console.log everything when debugging." }
];

function renderRoom() {
  document.getElementById("chat-room-log").innerHTML = roomMessages
    .map(m => `<p><strong>${m.user}:</strong> ${m.text}</p>`)
    .join("");
}

function sendRoomMessage() {
  const input = document.getElementById("chat-room-input");
  const text = input.value.trim();
  if (!text) return;

  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  const name = user?.name || "You";

  roomMessages.push({ user: name, text });
  input.value = "";

  renderRoom();
  notify("Message sent to global chat.");
  lexSay("Nice message in the chat room!");
}


// ===============================
//  SETTINGS
// ===============================

function saveDifficulty() {
  const diff = document.getElementById("difficulty").value;
  localStorage.setItem("codelingo_difficulty", diff);
  notify("Difficulty set to " + diff);
}


// ===============================
//  THEME TOGGLE
// ===============================

function toggleTheme() {
  document.body.classList.toggle("light");
  notify("Theme toggled.");
}


// ===============================
//  SCROLL NAVIGATION
// ===============================

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}


// ===============================
//  FIREBASE SKELETON (optional)
// ===============================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Later:
// const app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();


// ===============================
//  MASTER INITIALIZER
// ===============================

window.onload = () => {
  // Age popup
  if (!localStorage.getItem("codelingo_age")) {
    document.getElementById("age-popup").classList.remove("hidden");
  }

  // Dashboard
  updateDashboard();

  // Streak
  updateStreak();

  // Quiz
  loadQuiz();

  // Global chat
  renderRoom();

  // Mini‑game
  loadScramble();

  // Coding challenge
  loadChallenge();

  // Daily mission
  loadMission();

  // Inventory
  updateInventory();
};
</script>
<script>
// ======================================================
//  FIREBASE INIT (joined)
// ======================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ======================================================
//  ACCOUNT SYSTEM (joined)
// ======================================================

function firebaseRegister() {
  const name  = document.getElementById("auth-name").value;
  const email = document.getElementById("auth-email").value;
  const pass  = document.getElementById("auth-pass").value;
  const age   = parseInt(document.getElementById("auth-age").value);

  auth.createUserWithEmailAndPassword(email, pass)
    .then(cred => {
      const uid = cred.user.uid;
      const plan = age < 18 ? "FREE_YOUTH" : "NONE";

      return db.collection("users").doc(uid).set({
        name,
        email,
        age,
        plan,
        progress_language: 0,
        progress_code: 0,
        total_xp: 0,
        level: 0,
        friends: [],
        avatarUrl: null,
        achievements: []
      });
    })
    .then(() => {
      notify("Account created!");
      lexSay("Welcome, " + name + "!");
    });
}

function firebaseLogin() {
  const email = document.getElementById("auth-email").value;
  const pass  = document.getElementById("auth-pass").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(cred => loadUserFromFirebase(cred.user.uid))
    .catch(err => alert(err.message));
}

function loadUserFromFirebase(uid) {
  db.collection("users").doc(uid).onSnapshot(doc => {
    const user = doc.data();
    localStorage.setItem("codelingo_user", JSON.stringify(user));
    updateDashboard();
  });
}


// ======================================================
//  CLOUD XP SYNC (joined)
// ======================================================

function addXP(type, amount) {
  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  const currentUser = auth.currentUser;
  if (!user || !currentUser) return;

  if (type === "code") user.progress_code += amount;
  if (type === "language") user.progress_language += amount;

  user.total_xp = user.progress_code + user.progress_language;
  user.level = Math.floor(user.total_xp / 100);

  db.collection("users").doc(currentUser.uid).update({
    progress_code: user.progress_code,
    progress_language: user.progress_language,
    total_xp: user.total_xp,
    level: user.level
  }).then(() => {
    localStorage.setItem("codelingo_user", JSON.stringify(user));
    updateDashboard();
  });
}


// ======================================================
//  REAL-TIME GLOBAL CHAT (joined)
// ======================================================

function sendRoomMessage() {
  const input = document.getElementById("chat-room-input");
  const text = input.value.trim();
  if (!text) return;

  const user = JSON.parse(localStorage.getItem("codelingo_user"));
  const name = user?.name || "Anon";

  db.collection("chat-room").add({
    user: name,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  input.value = "";
  notify("Message sent.");
}

function listenRoomMessages() {
  db.collection("chat-room")
    .orderBy("createdAt", "asc")
    .onSnapshot(snapshot => {
      const msgs = [];
      snapshot.forEach(doc => msgs.push(doc.data()));
      document.getElementById("chat-room-log").innerHTML =
        msgs.map(m => `<p><strong>${m.user}:</strong> ${m.text}</p>`).join("");
    });
}


// ======================================================
//  FRIENDS SYSTEM (joined)
// ======================================================

function addFriend(friendUid) {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  db.collection("users").doc(currentUser.uid).update({
    friends: firebase.firestore.FieldValue.arrayUnion(friendUid)
  }).then(() => notify("Friend added!"));
}

function removeFriend(friendUid) {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  db.collection("users").doc(currentUser.uid).update({
    friends: firebase.firestore.FieldValue.arrayRemove(friendUid)
  }).then(() => notify("Friend removed."));
}


// ======================================================
//  PROFILE PICTURES (joined)
// ======================================================

function uploadAvatar() {
  const file = document.getElementById("avatar-file").files[0];
  const currentUser = auth.currentUser;
  if (!file || !currentUser) return;

  const ref = storage.ref("avatars/" + currentUser.uid);

  ref.put(file)
    .then(() => ref.getDownloadURL())
    .then(url => {
      return db.collection("users").doc(currentUser.uid).update({
        avatarUrl: url
      }).then(() => {
        document.getElementById("avatar-img").src = url;
        notify("Avatar updated!");
      });
    });
}


// ======================================================
//  ACHIEVEMENTS (joined)
// ======================================================

function grantAchievement(key) {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  db.collection("users").doc(currentUser.uid).update({
    achievements: firebase.firestore.FieldValue.arrayUnion(key)
  }).then(() => notify("Achievement unlocked: " + key));
}

function loadAchievementsFromUser(user) {
  const list = user.achievements || [];
  document.getElementById("ach-list").innerHTML =
    list.map(a => `<div class="pill">${a}</div>`).join("");
}


// ======================================================
//  MASTER INIT (joined)
// ======================================================

window.onload = () => {
  listenRoomMessages();
  updateDashboard();
  updateStreak();
  loadQuiz();
  loadScramble();
  loadChallenge();
  loadMission();
  updateInventory();
};
</script>
