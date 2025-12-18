// Voice Search utility
class VoiceSearchManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;
    this.init();
  }

  init() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      
      // Configure recognition
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'th-TH'; // Thai language
      this.recognition.maxAlternatives = 1;
    }
  }

  startListening(onResult, onError, onStart, onEnd) {
    if (!this.isSupported || !this.recognition) {
      onError('เบราว์เซอร์ไม่รองรับการค้นหาด้วยเสียง');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.isListening = true;
    
    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log('Voice recognition result:', transcript, 'Confidence:', confidence);
      
      if (onResult) {
        onResult(transcript, confidence);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'เกิดข้อผิดพลาดในการรับฟังเสียง';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'ไม่พบเสียงพูด กรุณาลองใหม่';
          break;
        case 'audio-capture':
          errorMessage = 'ไม่สามารถเข้าถึงไมโครโฟนได้';
          break;
        case 'not-allowed':
          errorMessage = 'กรุณาอนุญาตการใช้งานไมโครโฟน';
          break;
        case 'network':
          errorMessage = 'เกิดข้อผิดพลาดเครือข่าย';
          break;
      }
      
      if (onError) onError(errorMessage);
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.isListening = false;
      if (onError) onError('ไม่สามารถเริ่มการรับฟังเสียงได้');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isCurrentlyListening() {
    return this.isListening;
  }

  isSupportedBrowser() {
    return this.isSupported;
  }
}

// Create singleton instance
export const voiceSearchManager = new VoiceSearchManager();

// Helper function to process voice input for better search
export const processVoiceInput = (transcript) => {
  // Clean up the transcript
  let processed = transcript.trim();
  
  // Convert common Thai speech patterns to search-friendly terms
  const replacements = {
    'หา': 'ค้นหา',
    'ดู': 'แสดง',
    'เอกสาร': 'เอกสาร',
    'นโยบาย': 'นโยบาย',
    'วิธี': 'วิธีการ',
    'ขั้นตอน': 'ขั้นตอน',
    'การลา': 'การลา',
    'สินเชื่อ': 'สินเชื่อ',
    'ไอที': 'IT',
    'คอมพิวเตอร์': 'คอมพิวเตอร์'
  };

  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(key, 'gi');
    processed = processed.replace(regex, value);
  });

  return processed;
};

export default voiceSearchManager;