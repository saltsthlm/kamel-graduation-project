const continuousSpeechToSubtitle = (language, onTranscript, onQuiet, onStart, onError) => {
  try {
    const SpeechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language;

    recognition.onstart = function () {
      onStart('### started speech reecognition ###');
    }

    recognition.onspeechend = function () {
      onQuiet('### You were quiet for a while. Restarting speech recognition ###');
      continuousSpeechToSubtitle(language, onTranscript, onQuiet, onStart, onError)
    }

    recognition.onerror = function (event) {
      // console.log('### Speech-to-text error ###');
      // console.log(event.error);
      if (event.error === 'no-speech') {        
        // console.log('### No speech was detected. Try again. ###');
        continuousSpeechToSubtitle(language, onTranscript, onQuiet, onStart, onError)
      }
    }

    recognition.onresult = function (event) {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      onTranscript(transcript);
    }

    recognition.start();
  } catch (e) {
    console.log('caught error')
    onError(e);
  }
}

export { continuousSpeechToSubtitle };
