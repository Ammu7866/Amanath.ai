// 🔹 1) Particles.js config
particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    color: { value: "#0ff" },
    shape: { type: "circle" },
    opacity: {
      value: 0.3,
      anim: { enable: true, speed: 1, opacity_min: 0.1 }
    },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#0ff",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2
    }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "repulse" } }
  }
});

// 🔹 2) p5.js waveform animation
let mic, fft, micActive = false;

function setup() {
  let canvas = createCanvas(windowWidth, 200);
  canvas.parent('waveform');
  noFill();
  stroke(0, 255, 255);
  strokeWeight(2);

  mic = new p5.AudioIn();
  fft = new p5.FFT();
}

function draw() {
  clear();

  if (micActive) {
    let spectrum = fft.analyze();
    beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, 0, width);
      let y = map(spectrum[i], 0, 255, height, 0);
      vertex(x, y);
    }
    endShape();
  }
}

// 🔹 3) Voice commands with Speech Recognition
document.getElementById('start-btn').addEventListener('click', () => {
  mic.start(() => {
    micActive = true;
    fft.setInput(mic);
    speak("Hello, I am Amanar. How can I assist you?");
    startListening();
  }, () => {
    document.getElementById('status').innerText = "Microphone access denied!";
  });
});

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    document.getElementById('status').innerText = "Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    document.getElementById('status').innerText = "You said: " + transcript;

    // Basic local commands
    if (transcript.includes("hello")) {
      speak("Hello, my friend!");
    } else if (transcript.includes("time")) {
      const now = new Date().toLocaleTimeString();
      speak("The current time is " + now);
    } else if (transcript.includes("google")) {
      speak("Opening Google now.");
      window.open("https://www.google.com", "_blank");
    } else if (transcript.includes("ask ai")) {
      askAI("Say your question here...");
    } else {
      speak("Sorry, I did not understand that.");
    }
  };

  recognition.onerror = (event) => {
    document.getElementById('status').innerText = "Error: " + event.error;
  };

  recognition.start();
}

// 🔹 4) Text-to-Speech response
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}

// 🔹 5) OPTIONAL: Example how to call your API
const API_KEY = "YOUR_API_KEY_HERE";

function askAI(prompt) {
  fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    })
  })
  .then(response => response.json())
  .then(data => {
    const reply = data.choices[0].message.content;
    speak(reply);
  })
  .catch(error => console.error(error));
}
