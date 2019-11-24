const speechLanguages = {
  'sv': 'en-US',
  'es': 'en-US',
  'de': 'en-US',
  'fr': 'en-US',
  'en': 'en-US',
};

const recognizeSpeech = (language, onTranscript, onQuiet, onStart, onError) => {
  try {
    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = speechLanguages[language];
    recognition.onstart = function () {
      onStart('### started speech reecognition ###');
    }

    recognition.onspeechend = function () {
      onQuiet('### You were quiet for a while. Restarting speech recognition ###');
      recognizeSpeech(onTranscript, onQuiet, onStart, onError)
    }

    recognition.onerror = function (event) {
      console.log('### Speech-to-text error ###');
      if (event.error === 'no-speech') {
        console.log('### No speech was detected. Try again. ###');
      }
    }
    recognition.onresult = function (event) {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      onTranscript(transcript);
    }
    recognition.start();
  } catch (e) {
    onError(e);
  }
}

export { recognizeSpeech };
