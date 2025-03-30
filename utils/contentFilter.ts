// Interface untuk hasil pengecekan konten
interface ContentCheckResult {
  isSpam: boolean;
  reasons: string[];
}

export function createContentFilter() {
  // Daftar kata-kata terlarang (bisa diperluas)
  const blockedWords: string[] = [
    'judi', 'casino', 'poker', 'slot', 
    'viagra', 'obat', 'kredit', 'pinjaman',
    'togel', 'sex', 'xxx', 'porn',
    // Tambahkan kata lain sesuai kebutuhan
  ];
  
  // Deteksi link berlebihan
  const hasExcessiveLinks = (text: string): boolean => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex) || [];
    return matches.length > 2; // Lebih dari 2 link dianggap berlebihan
  };
  
  // Deteksi karakter berulang
  const hasRepeatedChars = (text: string): boolean => {
    return /(.)\1{5,}/.test(text); // 5+ karakter berulang
  };
  
  // Cek kata terlarang
  const hasBlockedWords = (text: string): boolean => {
    const lowercaseText = text.toLowerCase();
    return blockedWords.some(word => lowercaseText.includes(word));
  };
  
  // Filter utama
  const checkContent = (text: string): ContentCheckResult => {
    if (!text) return { isSpam: false, reasons: [] };
    
    const reasons: string[] = [];
    
    if (hasBlockedWords(text)) reasons.push('kata terlarang');
    if (hasExcessiveLinks(text)) reasons.push('terlalu banyak link');
    if (hasRepeatedChars(text)) reasons.push('karakter berulang');
    
    return {
      isSpam: reasons.length > 0,
      reasons: reasons
    };
  };
  
  return { checkContent };
}
