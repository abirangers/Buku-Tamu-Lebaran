// Interface untuk data rate limit
interface RateData {
  count: number;
  timestamps: number[];
}

// Interface untuk hasil pengecekan rate limit
interface RateLimitResult {
  allowed: boolean;
  nextAllowed?: number;
}

export function useRateLimiter() {
  // Gunakan localStorage untuk menyimpan data rate limit
  const checkRateLimit = (): RateLimitResult => {
    const now: number = Date.now();
    const LIMIT_WINDOW: number = 60 * 60 * 1000; // 1 jam dalam milidetik
    const MAX_SUBMISSIONS: number = 5; // Maksimum 5 pengiriman per jam
    
    // Ambil data dari localStorage
    const storedData: string | null = localStorage.getItem('submission_rate');
    let rateData: RateData;

    if (!storedData) {
      rateData = {
        count: 0,
        timestamps: []
      };
    } else {
      rateData = JSON.parse(storedData) as RateData;
      
      // Filter timestamp yang masih dalam window
      rateData.timestamps = rateData.timestamps.filter((time: number): boolean => (now - time) < LIMIT_WINDOW);
      rateData.count = rateData.timestamps.length;
    }
    
    // Cek apakah melebihi batas
    if (rateData.count >= MAX_SUBMISSIONS) {
      return {
        allowed: false,
        nextAllowed: rateData.timestamps[0] + LIMIT_WINDOW
      };
    }
    
    // Update data rate limit
    rateData.timestamps.push(now);
    rateData.count++;
    localStorage.setItem('submission_rate', JSON.stringify(rateData));
    
    return { allowed: true };
  };
  
  return { checkRateLimit };
}
