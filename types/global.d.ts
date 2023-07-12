// 扩展window对象
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    speechSynthesis: any;
    GoogleTTS: any;
  }
}
