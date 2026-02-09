import { ref } from 'vue';

export function useSpeech() {
  const speaking = ref(false);
  const supported = ref('speechSynthesis' in window);

  function speak(text: string, lang: 'id-ID' | 'en-US' = 'id-ID') {
    if (!supported.value) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      speaking.value = true;
    };

    utterance.onend = () => {
      speaking.value = false;
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      speaking.value = false;
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function stop() {
    window.speechSynthesis.cancel();
    speaking.value = false;
  }

  return {
    speak,
    stop,
    speaking,
    supported,
  };
}
