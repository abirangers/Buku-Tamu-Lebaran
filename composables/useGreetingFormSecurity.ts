import { ref, computed, onMounted } from 'vue'

/**
 * Composable untuk mengelola keamanan formulir greeting
 * Termasuk deteksi spam, validasi konten, dan honeypot
 */
export function useGreetingFormSecurity() {
  // ---------- HONEYPOT & TIMESTAMP ----------
  // Honeypot: Field tersembunyi untuk menangkap bot
  const honeypot = ref('');
  // Timestamp: Waktu saat form dibuka
  const formLoadTimestamp = ref(0);
  // Minimal waktu pengisian form yang wajar (dalam ms)
  const MIN_SUBMIT_TIME = 3000; // 3 detik

  // ---------- SPAM DETECTION ----------
  // Riwayat waktu submit
  const submitHistory = ref<number[]>([]);
  // Batas jumlah submit dalam interval pendek (5 dalam 30 detik)
  const SPAM_THRESHOLD = 5;
  const SPAM_WINDOW = 30000; // 30 detik
  
  // Deteksi spam berdasarkan pola submit
  const isSpamDetected = computed(() => {
    if (submitHistory.value.length < SPAM_THRESHOLD) return false;
    
    const now = Date.now();
    const recentSubmits = submitHistory.value.filter(timestamp => 
      now - timestamp < SPAM_WINDOW
    );
    
    return recentSubmits.length >= SPAM_THRESHOLD;
  });
  
  // Sisa waktu cooldown jika spam terdeteksi
  const spamCooldownRemaining = computed(() => {
    if (!isSpamDetected.value) return 0;
    
    const lastSubmit = Math.max(...submitHistory.value);
    const cooldownEnd = lastSubmit + 120000; // 2 menit cooldown
    const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
    
    return remaining;
  });

  // ---------- CONTENT FILTERING ----------  
  // Daftar kata yang sering digunakan dalam spam
  const spamWords = [
    "viagra", "cialis", "casino", "lottery", "prize", "winner", 
    "bitcoin", "investment", "wealth", "rich", "free money",
    "porn", "sex", "xxx", "dating", "hot singles", "click here",
    "buy now", "discount", "cheap", "promo", "limited time",
    "earn money", "make money", "quick cash", "easy money",
    "forex", "trading", "crypto", "token", "nft", "mining",
    "password", "login", "account", "urgent", "suspicious",
    "bank", "credit card", "loan", "debt", "mortgage", "insurance"
  ];

  // Fungsi untuk memeriksa konten spam
  const containsSpamContent = (text: string): boolean => {
    if (!text) return false;
    
    const lowerText = text.toLowerCase();
    
    // 1. Periksa kata-kata spam
    const hasSpamWord = spamWords.some(word => lowerText.includes(word.toLowerCase()));
    if (hasSpamWord) return true;
    
    // 2. Periksa URL yang mencurigakan
    const suspiciousURLPattern = /bit\.ly|goo\.gl|tinyurl\.com|t\.co|is\.gd|ow\.ly|amzn\.to|adf\.ly/i;
    if (suspiciousURLPattern.test(lowerText)) return true;
    
    // 3. Periksa terlalu banyak URL
    const urlCount = (lowerText.match(/https?:\/\//g) || []).length;
    if (urlCount > 2) return true;
    
    // 4. Periksa terlalu banyak emoji
    const emojiPattern = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
    const emojiCount = (lowerText.match(emojiPattern) || []).length;
    if (emojiCount > 10) return true;
    
    return false;
  };

  // ---------- METHODS ----------
  // Fungsi untuk mencatat history submit
  const recordSubmit = () => {
    const now = Date.now();
    submitHistory.value.push(now);
    
    // Simpan hanya 10 submit terakhir untuk efisiensi
    if (submitHistory.value.length > 10) {
      submitHistory.value = submitHistory.value.slice(-10);
    }
    
    // Simpan ke localStorage
    localStorage.setItem('submitHistory', JSON.stringify(submitHistory.value));
  };

  // Cek honeypot dan timestamp (true jika terdeteksi bot)
  const isBot = (): boolean => {
    // Cek honeypot (jika terisi, kemungkinan bot)
    if (honeypot.value !== '') {
      console.log('Honeypot terisi, kemungkinan bot');
      return true;
    }
    
    // Cek waktu pengisian form terlalu cepat (kemungkinan bot)
    const formFillTime = Date.now() - formLoadTimestamp.value;
    if (formFillTime < MIN_SUBMIT_TIME) {
      console.log('Form diisi terlalu cepat, kemungkinan bot:', formFillTime + 'ms');
      return true;
    }
    
    return false;
  };

  // ---------- INITIALIZATION ----------
  onMounted(() => {
    // Set timestamp saat form dimuat
    formLoadTimestamp.value = Date.now();
    
    // Cek history submit dari storage
    const storedHistory = localStorage.getItem('submitHistory');
    if (storedHistory) {
      try {
        submitHistory.value = JSON.parse(storedHistory);
      } catch (e) {
        console.error('Error parsing submit history:', e);
        submitHistory.value = [];
      }
    }
  });

  return {
    // State
    honeypot,
    formLoadTimestamp,
    submitHistory,
    
    // Computed
    isRateLimited: isSpamDetected,
    remainingCooldown: spamCooldownRemaining,
    
    // Methods
    recordSubmit,
    isBot,
    containsSpamContent
  };
} 