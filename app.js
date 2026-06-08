/**
 * Ubaidilms Static Core Application Architecture Engine
 * Developed/Sponsored by Samiullah Samejo
 */

const mockDatabase = {
    lessons: [
        { id: "l1", category: "grammar", title: "Mastering English Tenses", content: "English uses 12 distinct tense structures divided across Past, Present, and Future. Simple configurations focus on programmatic facts, Continuous structures tracking real-time execution processes, Perfect structures mapping completed chronologies, and Perfect Continuous handling sustained durability." },
        { id: "l2", category: "grammar", title: "Active and Passive Voice Framework", content: "Active voice explicitly positions the subjective agent at the focal initiation point of execution ('Samiullah wrote the software module'). Passive voice cleanly transposes structural prominence directly onto the terminal object target ('The software module was written by Samiullah')." },
        { id: "l3", category: "grammar", title: "Direct and Indirect Speech Dynamics", content: "Direct speech encapsulates precise literal quotations bounded inside punctuation quotation arrays. Indirect/Reported speech translates temporal indicators, subject references, and tense matrices back sequentially (e.g., 'He said that he was constructing an IT solution')." },
        { id: "l4", category: "grammar", title: "Sentence Structure Protocols", content: "Sentences scale dynamically from simple single-clause declarations up to complex configurations requiring coordinating conjunctions, subordinating dependent clauses, and careful punctuation balancing." },
        { id: "l5", category: "grammar", title: "Punctuation & Syntax Boundaries", content: "Punctuation handles pacing and structural boundaries. Commas isolate non-essential relative descriptors, semi-colons bind distinct independent clauses without conjunctions, and periods serve as absolute block terminators." },
        { id: "l6", category: "parts-of-speech", title: "Nouns & Pronouns Foundations", content: "Nouns classify entities, operational environments, and concepts. Pronouns (such as subjective 'he', 'she', 'it' or relative 'which', 'who') act as structural reference pointers preventing repetitive variable loading." },
        { id: "l7", category: "parts-of-speech", title: "Verbs, Adjectives & Adverbs", content: "Verbs are behavioral processing units handling system actions or relational states. Adjectives inject descriptive attributes onto nouns, while Adverbs apply parameter modifications to verbs, adjectives, or adjacent adverbs." },
        { id: "l8", category: "parts-of-speech", title: "Prepositions, Conjunctions & Interjections", content: "Prepositions map spatial and temporal relationships. Conjunctions act as structural glue linking clauses, and Interjections express isolated emotional or emphatic spikes." },
        { id: "l9", category: "vocabulary", title: "Lexical Unit: Technical Adaptation", content: "", isVocab: true, word: "Adaptation", definition: "The responsive process of adjusting system configurations or individual behavior to match newly introduced environment structures.", synonym: "Modification", antonym: "Stagnation", example: "The platform interface underwent immediate adaptation to satisfy mobile responsive breakpoints." },
        { id: "l10", category: "vocabulary", title: "Lexical Unit: Architectural Precision", content: "", isVocab: true, word: "Precision", definition: "The state of being highly accurate, refined, clear, and perfectly aligned with deterministic engineering specifications.", synonym: "Exactness", antonym: "Ambiguity", example: "Writing validation logic requires precision to prevent anomalous authentication overrides." }
    ],
    quizzes: {
        grammar: [
            { id: "gq1", question: "Identify the correct past tense structure: 'She ____ to the technical summit yesterday.'", options: ["go", "gone", "went", "goes"], correct: "went" },
            { id: "gq2", question: "Convert to Passive: 'The IT Community organized the event.'", options: ["The event was organized by the IT Community.", "The event organized the IT Community.", "The event has been organizing by IT Community."], correct: "The event was organized by the IT Community." }
        ],
        vocabulary: [
            { id: "vq1", question: "Which term represents the absolute opposite (antonym) of 'Precision'?", options: ["Exactness", "Ambiguity", "Clarity", "Efficiency"], correct: "Ambiguity" },
            { id: "vq2", question: "What is the primary synonym for the lexical unit 'Adaptation'?", options: ["Stagnation", "Rigidity", "Modification", "Erasure"], correct: "Modification" }
        ]
    }
};

class AppEngine {
    constructor() {
        this.database = mockDatabase;
        this.currentUser = null;
        this.activeQuizCategory = null;
        this.currentFilter = "all";
        
        // Load initial local mock user if empty
        if (!localStorage.getItem("ubaidi_users")) {
            const defaultUser = {
                fullName: "John Doe",
                email: "student@example.com",
                password: "password123",
                progress: { lessonsCompleted: 5, quizHighScore: 0 }
            };
            localStorage.setItem("ubaidi_users", JSON.stringify([defaultUser]));
        }
    }

    init() {
        this.renderLessons();
    }

    toggleAuthForm(type) {
        const loginForm = document.getElementById("login-form");
        const signupForm = document.getElementById("signup-form");
        const toggleLogin = document.getElementById("toggle-login");
        const toggleSignup = document.getElementById("toggle-signup");

        if (type === "login") {
            loginForm.style.display = "block";
            signupForm.style.display = "none";
            toggleLogin.classList.add("active");
            toggleSignup.classList.remove("active");
        } else {
            loginForm.style.display = "none";
            signupForm.style.display = "block";
            toggleLogin.classList.remove("active");
            toggleSignup.classList.add("active");
        }
        document.getElementById("auth-message").innerText = "";
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const pass = document.getElementById("login-password").value;
        const msg = document.getElementById("auth-message");

        const userRegistry = JSON.stringify(localStorage.getItem("ubaidi_users"));
        const users = JSON.parse(localStorage.getItem("ubaidi_users")) || [];
        
        const matchedUser = users.find(u => u.email === email && u.password === pass);

        if (matchedUser) {
            this.currentUser = matchedUser;
            this.bootstrapSession();
        } else {
            msg.innerText = "Authentication Failure: Invalid credential parameters.";
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const pass = document.getElementById("signup-password").value;
        const msg = document.getElementById("auth-message");

        let users = JSON.parse(localStorage.getItem("ubaidi_users")) || [];

        if (users.some(u => u.email === email)) {
            msg.innerText = "Conflict: Email entity already exists in database registry.";
            return;
        }

        const newUser = {
            fullName: name,
            email: email,
            password: pass,
            progress: { lessonsCompleted: 0, quizHighScore: 0 }
        };

        users.push(newUser);
        localStorage.setItem("ubaidi_users", JSON.stringify(users));
        this.currentUser = newUser;
        this.bootstrapSession();
    }

    bootstrapSession() {
        document.getElementById("auth-view").style.display = "none";
        document.getElementById("main-nav").style.display = "flex";
        document.getElementById("user-display-name").innerText = this.currentUser.fullName;
        document.getElementById("cert-recipient-name").innerText = this.currentUser.fullName;
        
        this.updateDashboardMetrics();
        this.switchTab("dashboard");
    }

    logout() {
        this.currentUser = null;
        document.getElementById("main-nav").style.display = "none";
        document.getElementById("dashboard-view").style.display = "none";
        document.getElementById("lessons-view").style.display = "none";
        document.getElementById("quizzes-view").style.display = "none";
        document.getElementById("certificate-view").style.display = "none";
        document.getElementById("auth-view").style.display = "block";
        this.toggleAuthForm("login");
    }

    switchTab(tabId) {
        const panels = ["dashboard", "lessons", "quizzes", "certificate"];
        panels.forEach(p => {
            const el = document.getElementById(`${p}-view`);
            if (el) el.style.display = (p === tabId) ? "block" : "none";
            
            const btn = document.getElementById(`tab-${p}`);
            if (btn) {
                if (p === tabId) btn.classList.add("active");
                else btn.classList.remove("active");
            }
        });
    }

    updateDashboardMetrics() {
        document.getElementById("stat-lessons").innerText = `${this.currentUser.progress.lessonsCompleted} / ${this.database.lessons.length}`;
        document.getElementById("stat-score").innerText = `${this.currentUser.progress.quizHighScore}%`;
        
        const certZone = document.getElementById("certificate-claim-zone");
        const certStatusLabel = document.getElementById("stat-cert-status");

        if (this.currentUser.progress.quizHighScore === 100) {
            certZone.style.display = "block";
            certStatusLabel.innerText = "Verified/Issued";
            certStatusLabel.className = "stat-val certified";
        } else {
            certZone.style.display = "none";
            certStatusLabel.innerText = "In Progress";
            certStatusLabel.className = "stat-val";
        }
    }

    renderLessons(subset = null) {
        const target = document.getElementById("lessons-render-target");
        target.innerHTML = "";
        const dataSet = subset || this.database.lessons;

        if (dataSet.length === 0) {
            target.innerHTML = "<p style='color: var(--text-muted); text-align:center;'>No structural learning content matches query metrics.</p>";
            return;
        }

        dataSet.forEach(lesson => {
            const card = document.createElement("div");
            card.className = "lesson-node";
            
            if (lesson.isVocab) {
                card.innerHTML = `
                    <span class="lesson-meta-tag">${lesson.category}</span>
                    <h3>Vocabulary Target: ${lesson.word}</h3>
                    <div class="vocab-block">
                        <p><strong>Structural Definition:</strong> ${lesson.definition}</p>
                        <p><strong>Synonym Reference:</strong> ${lesson.synonym} | <strong>Antonym Pointer:</strong> ${lesson.antonym}</p>
                    </div>
                    <p style="font-style: italic; color: var(--text-muted);">Example Architecture: "${lesson.example}"</p>
                `;
            } else {
                card.innerHTML = `
                    <span class="lesson-meta-tag">${lesson.category}</span>
                    <h3>${lesson.title}</h3>
                    <p style="margin-top:10px; color: #334155;">${lesson.content}</p>
                `;
            }
            target.appendChild(card);
        });
    }

    filterLessons(category) {
        this.currentFilter = category;
        const chips = ["all", "grammar", "parts-of-speech", "vocabulary"];
        chips.forEach(c => {
            const el = document.getElementById(`chip-${c === "parts-of-speech" ? "pos" : c === "vocabulary" ? "vocab" : c}`);
            if (el) {
                if (c === category) el.classList.add("active");
                else el.classList.remove("active");
            }
        });

        if (category === "all") {
            this.renderLessons();
        } else {
            const filtered = this.database.lessons.filter(l => l.category === category);
            this.renderLessons(filtered);
        }
    }

    handleSearch(query) {
        const cleanQuery = query.toLowerCase().trim();
        const filtered = this.database.lessons.filter(l => {
            const matchesCategory = (this.currentFilter === "all" || l.category === this.currentFilter);
            const matchesContent = l.isVocab ? 
                (l.word.toLowerCase().includes(cleanQuery) || l.definition.toLowerCase().includes(cleanQuery)) :
                (l.title.toLowerCase().includes(cleanQuery) || l.content.toLowerCase().includes(cleanQuery));
            return matchesCategory && matchesContent;
        });
        this.renderLessons(filtered);
    }

    startQuiz(category) {
        this.activeQuizCategory = category;
        document.getElementById("quiz-selection").style.display = "none";
        document.getElementById("quiz-runner").style.display = "block";
        document.getElementById("quiz-title").innerText = `${category.toUpperCase()} Assessment Module`;

        const container = document.getElementById("quiz-questions-container");
        container.innerHTML = "";

        const questions = this.database.quizzes[category];
        questions.forEach((q, idx) => {
            const qCard = document.createElement("div");
            qCard.className = "quiz-question-card";
            qCard.innerHTML = `
                <p><strong>Q${idx + 1}:</strong> ${q.question}</p>
                <div class="quiz-options-group">
                    ${q.options.map(opt => `
                        <label class="option-wrapper">
                            <input type="radio" name="question-${q.id}" value="${opt}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            `;
            container.appendChild(qCard);
        });
    }

    evaluateQuiz() {
        const category = this.activeQuizCategory;
        const questions = this.database.quizzes[category];
        let correctCount = 0;
        let reviewHtml = "";

        questions.forEach((q, idx) => {
            const selectedOpt = document.querySelector(`input[name="question-${q.id}"]:checked`);
            const userAns = selectedOpt ? selectedOpt.value : "Unanswered";
            const isCorrect = userAns === q.correct;

            if (isCorrect) correctCount++;

            reviewHtml += `
                <div class="review-item">
                    <p><strong>Q${idx + 1}: ${q.question}</strong></p>
                    <p>Your Input: <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">${userAns}</span></p>
                    ${!isCorrect ? `<p style="color: var(--success);">Correct Protocol: ${q.correct}</p>` : ''}
                </div>
            `;
        });

        const terminalPercentage = Math.round((correctCount / questions.length) * 100);
        
        // Sync score criteria back into tracking references
        if (terminalPercentage > this.currentUser.progress.quizHighScore) {
            this.currentUser.progress.quizHighScore = terminalPercentage;
            
            // Sync with local Storage Engine persistent array
            const users = JSON.parse(localStorage.getItem("ubaidi_users")) || [];
            const idx = users.findIndex(u => u.email === this.currentUser.email);
            if (idx !== -1) {
                users[idx].progress.quizHighScore = terminalPercentage;
                localStorage.setItem("ubaidi_users", JSON.stringify(users));
            }
        }

        document.getElementById("quiz-runner").style.display = "none";
        document.getElementById("quiz-result-view").style.display = "block";
        
        const scoreEl = document.getElementById("quiz-score-percent");
        scoreEl.innerText = `${terminalPercentage}%`;
        scoreEl.style.color = (terminalPercentage === 100) ? "var(--success)" : "var(--brand-accent)";

        document.getElementById("quiz-feedback-text").innerText = (terminalPercentage === 100) ?
            "Perfect Score! Academic credential criteria successfully matched. Certificate unlocked." :
            "Assessment score complete. Achieve 100% precision to auto-generate verified completion certificates.";

        document.getElementById("quiz-review-breakdown").innerHTML = reviewHtml;
        this.updateDashboardMetrics();
    }

    exitQuiz() {
        document.getElementById("quiz-result-view").style.display = "none";
        document.getElementById("quiz-runner").style.display = "none";
        document.getElementById("quiz-selection").style.display = "block";
        this.activeQuizCategory = null;
        this.switchTab("dashboard");
    }
}

// Instantiate and bind context engine globally
const app = new AppEngine();
window.addEventListener("DOMContentLoaded", () => app.init());
