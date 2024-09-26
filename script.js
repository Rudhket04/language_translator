const fromLanguageSelect = document.getElementById('fromLanguage');
const toLanguageSelect = document.getElementById('toLanguage');
const speechInput = document.getElementById('speechInput');
const translatedOutput = document.getElementById('translatedOutput');
const speakBtn = document.getElementById('speakBtn');
const translateBtn = document.getElementById('translateBtn');
const speakOutputBtn = document.getElementById('speakOutputBtn');
const copyBtn = document.createElement('button');
const clearBtn = document.createElement('button');
const historyBox = document.createElement('div');
let translationHistory = [];

// Set attributes for copy and clear buttons
copyBtn.textContent = 'Copy';
copyBtn.classList.add('copy-btn');
clearBtn.textContent = 'Clear All';
clearBtn.classList.add('clear-btn');
translatedOutput.appendChild(copyBtn);
document.body.appendChild(clearBtn);

// Append history section
historyBox.classList.add('history-box');
document.body.appendChild(historyBox);

// Mock API call for language detection and translation (to be replaced with actual API)
const detectLanguage = (text) => {
    const languages = {
        en: 'English', es: 'Spanish', fr: 'French', de: 'German', hi: 'Hindi', 
        'zh-CN': 'Chinese', ru: 'Russian', ja: 'Japanese', ko: 'Korean'
    };
    // Mock: auto-detect language based on content
    return languages[Object.keys(languages)[Math.floor(Math.random() * Object.keys(languages).length)]];
};
const simulateTranslation = (text, fromLang, toLang) => {
    return text + ' (translated from ' + fromLang + ' to ' + toLang + ')';
};

// Web Speech API: Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = fromLanguageSelect.value;
recognition.continuous = true;

speakBtn.addEventListener('click', () => {
    recognition.start();
});
recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    speechInput.value += speechResult + ' ';
};
recognition.onerror = (event) => {
    console.error('Speech Recognition Error:', event.error);
};

// Translation Functionality
translateBtn.addEventListener('click', () => {
    const inputText = speechInput.value.trim();
    const fromLang = detectLanguage(inputText); // Auto-detect
    const toLang = toLanguageSelect.value;

    if (inputText) {
        const translatedText = simulateTranslation(inputText, fromLang, toLang);
        translatedOutput.innerText = translatedText;

        // Add to history
        translationHistory.push({ original: inputText, translated: translatedText });
        updateHistory();
    } else {
        alert('Please enter text or speak first.');
    }
});

// Web Speech API: Text-to-Speech (Speak Output)
const synth = window.speechSynthesis;
speakOutputBtn.addEventListener('click', () => {
    const outputText = translatedOutput.innerText;
    if (outputText) {
        const utterance = new SpeechSynthesisUtterance(outputText);
        utterance.lang = toLanguageSelect.value;
        synth.speak(utterance);
    } else {
        alert('No translated text to speak.');
    }
});

// Copy to Clipboard functionality
copyBtn.addEventListener('click', () => {
    const text = translatedOutput.innerText;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Text copied to clipboard!');
        });
    }
});

// Clear all input, output, and history
clearBtn.addEventListener('click', () => {
    speechInput.value = '';
    translatedOutput.innerText = '';
    translationHistory = [];
    updateHistory();
});

// Update translation history
const updateHistory = () => {
    historyBox.innerHTML = ''; // Clear current history
    translationHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerText = `${index + 1}. ${item.original} -> ${item.translated}`; // Use backticks for template literals
        historyBox.appendChild(historyItem);
    });
};


// Update recognition language on change of source language
fromLanguageSelect.addEventListener('change', () => {
    recognition.lang = fromLanguageSelect.value;
});