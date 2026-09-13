/* =========================================================
   SkillFirst AI — script.js
   Frontend prototype for hackathon demo.
   All AI, matching and payment logic is MOCK / DEMO.
   ========================================================= */

'use strict';

/* =========================================================
   // DEMO DATA
   Everything below is fake data used for the prototype.
   Replace with real API responses later.
   ========================================================= */

// Demo workers used in AI matching (customer flow)
const DEMO_WORKERS = [
  {
    id: 1,
    name: 'Ravi',
    profession: 'Electrician',
    skillScore: 87,
    rating: 4.7,
    distanceKm: 2,
    availability: 'Available',
    matchScore: 94,
    location: 'Warangal',
    services: ['Emergency Fan Repair', 'Switch Board Repair', 'House Wiring']
  },
  {
    id: 2,
    name: 'Suresh',
    profession: 'Electrician',
    skillScore: 82,
    rating: 4.5,
    distanceKm: 4,
    availability: 'Available',
    matchScore: 88,
    location: 'Warangal',
    services: ['Switch Board Repair', 'House Wiring']
  },
  {
    id: 3,
    name: 'Mahesh',
    profession: 'Plumber',
    skillScore: 84,
    rating: 4.6,
    distanceKm: 3,
    availability: 'Available',
    matchScore: 90,
    location: 'Warangal',
    services: ['Pipe Leakage Fix', 'Tap Installation']
  },
  {
    id: 4,
    name: 'Lakshmi',
    profession: 'Tailor',
    skillScore: 91,
    rating: 4.9,
    distanceKm: 5,
    availability: 'Available',
    matchScore: 96,
    location: 'Warangal',
    services: ['Blouse Stitching', 'Pant Alteration']
  }
];

// Keyword → skill mapping for demo skill extraction
const SKILL_KEYWORDS = {
  Electrician: {
    'fan': 'Fan Repair',
    'switch': 'Switch Board Repair',
    'board': 'Switch Board Repair',
    'wiring': 'House Wiring',
    'wire': 'House Wiring',
    'light': 'Light Installation',
    'motor': 'Motor Repair',
    'mcb': 'MCB & Fuse Handling',
    'inverter': 'Inverter Installation'
  },
  Plumber: {
    'pipe': 'Pipe Fitting',
    'leak': 'Leak Repair',
    'tap': 'Tap Installation',
    'toilet': 'Toilet Fitting',
    'basin': 'Basin Installation',
    'water': 'Water Line Repair',
    'drain': 'Drain Cleaning'
  },
  Tailor: {
    'stitch': 'Stitching',
    'blouse': 'Blouse Stitching',
    'pant': 'Pant Alteration',
    'shirt': 'Shirt Stitching',
    'alter': 'Alteration',
    'design': 'Design Work',
    'embroid': 'Embroidery'
  }
};

// Demo assessment questions per profession
const DEMO_QUESTIONS = {
  Electrician: {
    question: 'An MCB frequently trips when a fan is switched on. What would you check first?',
    options: [
      'Replace the fan immediately',
      'Check for short circuit or overload in the fan circuit',
      'Increase the MCB rating',
      'Ignore it — MCBs trip sometimes'
    ],
    correctIndex: 1,
    weights: { tech: 90, practical: 85, safety: 88, experience: 80 }
  },
  Plumber: {
    question: 'A pipe joint is leaking slightly under the sink. What is the best first step?',
    options: [
      'Wrap tape over the leak',
      'Shut off the water supply, then inspect the joint',
      'Ignore it — small leaks stop on their own',
      'Replace the entire pipe'
    ],
    correctIndex: 1,
    weights: { tech: 88, practical: 90, safety: 92, experience: 82 }
  },
  Tailor: {
    question: 'A customer wants a blouse that fits perfectly but has provided no measurements. What do you do?',
    options: [
      'Use standard sizes and hope for the best',
      'Take fresh measurements from the customer',
      'Ask the customer to guess their size',
      'Refuse the order'
    ],
    correctIndex: 1,
    weights: { tech: 90, practical: 88, safety: 85, experience: 86 }
  }
};

// Demo remuneration calculator
// FUTURE API INTEGRATION: replace with real pricing API
const DEMO_PRICING = {
  base: 400,
  complexityBonus: 100,
  emergencyBonus: 50,
  performanceBonus: 25
};

/* =========================================================
   // UTILITIES
   ========================================================= */

const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

/** Show a small toast notification */
function showToast(message, icon = 'fa-circle-check') {
  const toast = $('#toast');
  if (!toast) return;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

/** Smooth-scroll to a section by id */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================================================
   // NAVBAR & MOBILE MENU
   ========================================================= */

function initNavbar() {
  const navbar = $('#navbar');
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');

  // Add shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    $$('a', navLinks).forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Nav actions
  const getStartedBtn = $('#getStartedBtn');
  const loginBtn = $('#loginBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      showToast('Demo: Get Started is a prototype action.', 'fa-circle-info');
      scrollToSection('workers');
    });
  }
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      showToast('Demo: Login is not connected yet.', 'fa-circle-info');
    });
  }
}

/* =========================================================
   // HERO BUTTONS
   ========================================================= */

function initHeroButtons() {
  const imWorkerBtn = $('#imWorkerBtn');
  const imCustomerBtn = $('#imCustomerBtn');

  if (imWorkerBtn) {
    imWorkerBtn.addEventListener('click', () => scrollToSection('workers'));
  }
  if (imCustomerBtn) {
    imCustomerBtn.addEventListener('click', () => scrollToSection('customers'));
  }
}

/* =========================================================
   // ASSESSMENT MODAL — open / close / steps
   ========================================================= */

const assessmentState = {
  profession: null,
  detectedSkills: [],
  spokenText: '',
  answered: false
};

function initAssessmentModal() {
  const modal = $('#assessmentModal');
  const openBtn = $('#startAssessmentBtn');
  const closeBtn = $('#closeAssessment');
  const stepProfession = $('#step-profession');
  const stepVoice = $('#step-voice');
  const stepQuiz = $('#step-quiz');

  if (!modal || !openBtn) return;

  const showStep = (step) => {
    [stepProfession, stepVoice, stepQuiz].forEach(s => s && s.classList.add('hidden'));
    if (step) step.classList.remove('hidden');
  };

  const openModal = () => {
    resetAssessment();
    showStep(stepProfession);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    stopSpeechRecognition();
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Profession selection
  $$('.profession-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.profession-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      assessmentState.profession = card.dataset.profession;

      // Move to voice step
      setTimeout(() => showStep(stepVoice), 220);
    });
  });

  // Example text button
  const useExampleBtn = $('#useExampleBtn');
  if (useExampleBtn) {
    useExampleBtn.addEventListener('click', () => {
      const examples = {
        Electrician: 'I repair fans and switch boards and do house wiring',
        Plumber: 'I fix pipe leaks, install taps and repair toilets',
        Tailor: 'I stitch blouses, alter pants and do embroidery work'
      };
      $('#spokenText').value = examples[assessmentState.profession] || examples.Electrician;
    });
  }

  // Analyze button
  const analyzeBtn = $('#analyzeVoiceBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const text = $('#spokenText').value.trim();
      if (!text) {
        showToast('Please speak or type your skills first.', 'fa-triangle-exclamation');
        return;
      }
      handleSkillAnalysis(text);
    });
  }

  // Finish assessment
  const finishBtn = $('#finishAssessmentBtn');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      closeModal();
      showToast('Skill score saved to your demo profile!', 'fa-circle-check');
      // Scroll to worker dashboard
      scrollToSection('workers');
    });
  }
}

function resetAssessment() {
  assessmentState.profession = null;
  assessmentState.detectedSkills = [];
  assessmentState.spokenText = '';
  assessmentState.answered = false;

  $$('.profession-card').forEach(c => c.classList.remove('selected'));
  const spokenText = $('#spokenText');
  if (spokenText) spokenText.value = '';
  const detectedBox = $('#detectedBox');
  if (detectedBox) detectedBox.classList.add('hidden');
  const scoreResult = $('#scoreResult');
  if (scoreResult) scoreResult.classList.add('hidden');
  const optionsContainer = $('#optionsContainer');
  if (optionsContainer) optionsContainer.innerHTML = '';
}

/* =========================================================
   // VOICE RECOGNITION (Web Speech API)
   // FUTURE API INTEGRATION: could also send audio to a
   // speech-to-text API (e.g. Whisper) for better accuracy.
   ========================================================= */

let recognition = null;
let isListening = false;

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = $('#micBtn');
  const micStatus = $('#micStatus');
  const spokenText = $('#spokenText');

  if (!micBtn) return;

  // Fallback for unsupported browsers
  if (!SpeechRecognition) {
    micBtn.addEventListener('click', () => {
      micStatus.textContent = 'Voice not supported here — please type below';
      showToast('Voice recognition not supported in this browser.', 'fa-triangle-exclamation');
      spokenText.focus();
    });
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';

  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    micStatus.textContent = 'Listening...';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    spokenText.value = transcript;
  };

  recognition.onerror = (event) => {
    console.warn('Speech error:', event.error);
    micStatus.textContent = 'Could not hear clearly. Try again.';
    showToast('Voice error: ' + event.error, 'fa-triangle-exclamation');
    stopSpeechRecognition();
  };

  recognition.onend = () => {
    stopSpeechRecognition();
    if (spokenText.value.trim()) {
      micStatus.textContent = 'Captured! Tap Analyze Skills.';
    } else {
      micStatus.textContent = 'Tap to start speaking';
    }
  };

  micBtn.addEventListener('click', () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      try {
        spokenText.value = '';
        recognition.start();
      } catch (err) {
        console.warn(err);
      }
    }
  });
}

function stopSpeechRecognition() {
  isListening = false;
  const micBtn = $('#micBtn');
  const micStatus = $('#micStatus');
  if (micBtn) micBtn.classList.remove('listening');
  if (micStatus && micStatus.textContent === 'Listening...') {
    micStatus.textContent = 'Tap to start speaking';
  }
  if (recognition) {
    try { recognition.stop(); } catch (e) { /* ignore */ }
  }
}

/* =========================================================
   // DEMO SKILL EXTRACTION
   // FUTURE API INTEGRATION: replace with real NLP / LLM
   // endpoint that returns structured skills from text.
   ========================================================= */

function extractSkills(text, profession) {
  const lower = text.toLowerCase();
  const mapping = SKILL_KEYWORDS[profession] || {};
  const found = new Set();

  Object.keys(mapping).forEach(keyword => {
    if (lower.includes(keyword)) {
      found.add(mapping[keyword]);
    }
  });

  return Array.from(found);
}

function detectProfessionFromText(text) {
  const lower = text.toLowerCase();
  let bestProfession = null;
  let bestScore = 0;

  Object.keys(SKILL_KEYWORDS).forEach(profession => {
    let score = 0;
    Object.keys(SKILL_KEYWORDS[profession]).forEach(kw => {
      if (lower.includes(kw)) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      bestProfession = profession;
    }
  });

  return bestProfession;
}

/* =========================================================
   // ASSESSMENT FLOW: analyze → show quiz → score
   ========================================================= */

function handleSkillAnalysis(text) {
  const detectedProfession = detectProfessionFromText(text) || assessmentState.profession;
  const skills = extractSkills(text, detectedProfession);

  assessmentState.spokenText = text;
  assessmentState.profession = detectedProfession;
  assessmentState.detectedSkills = skills;

  // Show detected box
  const detectedBox = $('#detectedBox');
  const detectedProfessionEl = $('#detectedProfession');
  const detectedSkillsList = $('#detectedSkillsList');

  detectedProfessionEl.textContent = detectedProfession || 'Unknown';
  detectedSkillsList.innerHTML = '';

  if (skills.length === 0) {
    detectedSkillsList.innerHTML = '<li>No specific skills detected — try adding more detail.</li>';
  } else {
    skills.forEach(skill => {
      const li = document.createElement('li');
      li.textContent = skill;
      detectedSkillsList.appendChild(li);
    });
  }
  detectedBox.classList.remove('hidden');

  showToast(`Detected ${skills.length} skill(s) for ${detectedProfession}.`, 'fa-wand-magic-sparkles');

  // Move to quiz step after a short delay
  setTimeout(() => {
    renderQuiz(detectedProfession);
  }, 900);
}

function renderQuiz(profession) {
  const stepVoice = $('#step-voice');
  const stepQuiz = $('#step-quiz');
  const questionText = $('#questionText');
  const optionsContainer = $('#optionsContainer');
  const scoreResult = $('#scoreResult');

  stepVoice.classList.add('hidden');
  stepQuiz.classList.remove('hidden');
  scoreResult.classList.add('hidden');

  const q = DEMO_QUESTIONS[profession] || DEMO_QUESTIONS.Electrician;
  questionText.textContent = q.question;
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(idx, q, optionsContainer, scoreResult));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIdx, question, optionsContainer, scoreResult) {
  if (assessmentState.answered) return;
  assessmentState.answered = true;

  const buttons = $$('.option-btn', optionsContainer);
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === question.correctIndex) btn.classList.add('correct');
    else if (idx === selectedIdx) btn.classList.add('wrong');
  });

  const isCorrect = selectedIdx === question.correctIndex;

  // DEMO SCORING (not real AI)
  // Base weights come from the question, we adjust based on correctness.
  const w = question.weights;
  const adjust = isCorrect ? 0 : -12;

  const tech   = clamp(w.tech + adjust, 40, 100);
  const prac   = clamp(w.practical + adjust, 40, 100);
  const safe   = clamp(w.safety + adjust, 40, 100);
  const exp    = clamp(w.experience + adjust, 40, 100);

  const final  = Math.round((tech + prac + safe + exp) / 4);

  // Animate numbers into the result card
  $('#sTech').textContent = tech;
  $('#sPrac').textContent = prac;
  $('#sSafe').textContent = safe;
  $('#sExp').textContent = exp;
  $('#finalScore').textContent = final + '/100';

  setTimeout(() => scoreResult.classList.remove('hidden'), 400);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/* =========================================================
   // CUSTOMER FLOW: form → demo matching
   // FUTURE API INTEGRATION: POST /match → real backend
   // ========================================================= */

function initCustomerForm() {
  const form = $('#customerForm');
  const matchesContainer = $('#matchesContainer');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const jobType = $('#jobType').value.trim();
    const problemDesc = $('#problemDesc').value.trim();
    const location = $('#location').value.trim();
    const urgency = $('#urgency').value.trim();

    // Basic validation
    if (!jobType || !problemDesc || !location || !urgency) {
      showToast('Please fill in all fields.', 'fa-triangle-exclamation');
      return;
    }

    // Demo loading state
    matchesContainer.innerHTML = `
      <p class="empty-state">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        AI is finding the best workers near you...
      </p>`;

    // Simulate network delay (DEMO ONLY)
    setTimeout(() => {
      const matches = findDemoMatches(jobType, location);
      renderMatches(matches, { jobType, location, urgency });
    }, 900);
  });
}

/** Filter demo workers by service + location, then sort by match score. */
function findDemoMatches(jobType, location) {
  return DEMO_WORKERS
    .filter(w => w.services.includes(jobType) && w.location === location)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function renderMatches(matches, job) {
  const container = $('#matchesContainer');
  container.innerHTML = '';

  if (matches.length === 0) {
    container.innerHTML = `
      <p class="empty-state">
        <i class="fa-solid fa-user-slash"></i>
        No workers found for this service in ${escapeHtml(job.location)}.
        Try another service or location.
      </p>`;
    return;
  }

  matches.forEach(worker => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.innerHTML = `
      <div class="match-top">
        <div class="avatar">${escapeHtml(worker.name[0])}</div>
        <div>
          <h4>${escapeHtml(worker.name)}</h4>
          <p>${escapeHtml(worker.profession)}</p>
        </div>
        <div class="match-score">
          <strong>${worker.matchScore}%</strong>
          <span>AI Match</span>
        </div>
      </div>
      <div class="match-meta">
        <span><i class="fa-solid fa-gauge-high"></i> Skill ${worker.skillScore}/100</span>
        <span><i class="fa-solid fa-star"></i> ${worker.rating}/5</span>
        <span><i class="fa-solid fa-location-dot"></i> ${worker.distanceKm} km</span>
        <span><i class="fa-solid fa-circle-check"></i> ${escapeHtml(worker.availability)}</span>
      </div>
      <button class="btn btn-primary btn-block book-btn" data-id="${worker.id}">
        <i class="fa-solid fa-calendar-check"></i> Book Worker
      </button>
    `;
    container.appendChild(card);
  });

  // Wire up booking buttons
  $$('.book-btn', container).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const worker = DEMO_WORKERS.find(w => w.id === id);
      if (worker) handleBooking(worker, job);
    });
  });

  showToast(`Found ${matches.length} matching worker(s).`, 'fa-magnifying-glass');
}

/* =========================================================
   // BOOKING + REMUNERATION DEMO
   // FUTURE API INTEGRATION: POST /bookings, /payments
   // ========================================================= */

function handleBooking(worker, job) {
  // Basic demo remuneration calculation
  const base = DEMO_PRICING.base;
  const complexity = DEMO_PRICING.complexityBonus;
  const emergency = job.urgency === 'High' ? DEMO_PRICING.emergencyBonus : 0;
  const performance = DEMO_PRICING.performanceBonus;
  const total = base + complexity + emergency + performance;

  showToast(`${worker.name} booked! Recommended pay: ₹${total}`, 'fa-circle-check');

  // Scroll to remuneration section so the demo flow feels connected
  setTimeout(() => {
    scrollToSection('remuneration');
  }, 400);
}

/* =========================================================
   // SECURITY HELPERS
   ========================================================= */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* =========================================================
   // FUTURE API INTEGRATION — placeholder examples
   // Kept here so the backend developer knows where to plug in.
   =========================================================

/*
async function apiAnalyzeSkills(text, profession) {
  const res = await fetch('/api/ai/extract-skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, profession })
  });
  return res.json();
}

async function apiGetMatches(job) {
  const res = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job)
  });
  return res.json();
}

async function apiCreateBooking(workerId, job) { ... }
async function apiInitiatePayment(bookingId, amount) { ... }
*/

/* =========================================================
   // BOOTSTRAP
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroButtons();
  initAssessmentModal();
  initSpeechRecognition();
  initCustomerForm();

  // Small easter egg for hackathon judges
  console.log('%c SkillFirst AI ', 'background:#3b5bfd;color:#fff;padding:4px 10px;border-radius:6px;font-weight:700;', 'Demo prototype ready 🚀');
});