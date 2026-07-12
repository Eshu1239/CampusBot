
const intents = [
  {
    tag: "greeting",
    patterns: ["hi", "hello", "hey", "good morning", "good afternoon", "hii", "helo"],
    responses: ["Hello! How can I help you today?", "Hi there! What would you like to know?"]
  },
  {
    tag: "goodbye",
    patterns: ["bye", "see you", "goodbye", "talk later", "gtg"],
    responses: ["Goodbye! Have a great day.", "See you soon!"]
  },
  {
    tag: "thanks",
    patterns: ["thanks", "thank you", "thx", "appreciate it"],
    responses: ["You're welcome!", "Happy to help!"]
  },
  {
    tag: "college_timing",
    patterns: ["what time does college start", "college timings", "when does class begin", "college hours"],
    responses: ["College starts at 9:00 AM and ends at 4:00 PM, Monday to Saturday."]
  },
  {
    tag: "fees",
    patterns: ["what is the fee", "how much is tuition", "fee structure", "fees details"],
    responses: ["Please visit the accounts office or check the college website for the latest fee structure."]
  },
  {
    tag: "admissions",
    patterns: ["how to apply", "admission process", "how do i get admission", "application process", "admissions"],
    responses: ["You can apply online through the college admissions portal. You'll need your 12th marksheet and ID proof."]
  },
  {
    tag: "courses",
    patterns: ["what courses are offered", "which courses do you have", "course list", "programs offered"],
    responses: ["We offer BCA, BBA, B.Com, and BSc programs. Would you like details on any specific course?"]
  },
  {
    tag: "library",
    patterns: ["library timings", "when is the library open", "library hours"],
    responses: ["The library is open from 8:00 AM to 6:00 PM on all working days."]
  },
  {
    tag: "contact",
    patterns: ["how do i contact the college", "phone number", "email address", "contact details"],
    responses: ["You can reach the college office at info@college.edu or call +91-XXXXXXXXXX."]
  },
  {
    tag: "name",
    patterns: ["what is your name", "who are you", "your name"],
    responses: ["I'm CampusBot, your virtual assistant! Ask me anything about the college."]
  }
];

function clean(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

function getResponse(userInput) {
  const userClean = clean(userInput);
  const userTokens = new Set(userClean.split(" "));

  let bestMatch = null;
  let bestScore = 0;

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      const patternClean = clean(pattern);

      // Exact substring match (strong signal)
      if (userClean.includes(patternClean)) {
        return randomChoice(intent.responses);
      }

      
      const patternTokens = patternClean.split(" ");
      const overlap = patternTokens.filter(t => userTokens.has(t)).length;
      if (overlap > bestScore) {
        bestScore = overlap;
        bestMatch = intent;
      }
    }
  }

  if (bestMatch && bestScore > 0) {
    return randomChoice(bestMatch.responses);
  }

  return "Sorry, I didn't quite understand that. Could you rephrase, or ask about admissions, fees, courses, timings, or the library?";
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  appendMessage('user', message);
  input.value = '';

  showTyping(true);

  setTimeout(() => {
    const response = getResponse(message);
    showTyping(false);
    appendMessage('bot', response);
  }, 600);
}

function appendMessage(sender, text) {
  const chatWindow = document.getElementById('chat-window');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `<span>${text}</span>`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping(state) {
  const indicator = document.getElementById('typing-indicator');
  if (state) indicator.classList.remove('hidden');
  else indicator.classList.add('hidden');
}

document.getElementById('user-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});


const cursorDot = document.querySelector('.cursor-dot');

document.addEventListener('mousemove', (e) => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  
});

const interactiveElements = document.querySelectorAll('button, input, .message');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
});

document.addEventListener('mousedown', () => {
  cursorDot.style.transform = 'translate(-50%, -50%) scale(0.6)';
});
document.addEventListener('mouseup', () => {
  cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
});
