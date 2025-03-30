import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'
import type { Greeting } from '~/types'

// Gunakan tipe yang dihasilkan oleh Supabase
type DbGreeting = Database['public']['Tables']['greetings']['Row']
type SupabaseClient = ReturnType<typeof createClient<Database>>

// Daftar kata yang dilarang dalam bentuk terenkripsi Base64
const FORBIDDEN_WORDS_ENCODED = [
  "a29udG9s", "bWVtZWs=", "bmdlbnRvdA==", "anVkaQ==", "dG9nZWw=", "Ym9rZXA=", "cG9ybm8=", 
  "c2V4", "eHh4", "cGFzc3dvcmQ=", "dmlhZ3Jh", "Y2lhbGlz",
  "YW5qaW5n", "dG9sb2w=", "Ym9kb2g=", "Z29ibG9r", "YmFuZ3NhdA==", "YmFiaQ==", "bW9ueWV0", 
  "c2lhbGFu", "a2VwYXJhdA==", "YmFqaW5nYW4=", "YXN1", "a2FtcHJldA==", "c2V0YW4=", "aWJsaXM=",
  "bGFrbmF0", "YnJlbmdzZWs=", "a3VueXVr", "YmVnbw==", "aWRpb3Q=", "ZHVuZ3U=", "dG9sb2w=",
  "YmVyZW5nc2Vr", "dGFp", "dGFoaQ==", "a290b3Jhbg==", "YmFjb3Q=", "bmdhY2VuZw==", "bmdld2U=",
  "aXRpbA==", "ZW50b3Q=", "cGVjdW4=", "YmVuY29uZw==", "YmFuY2k=", "bWFobw==", "aG9tbw==", "Z2F5",
  "bGVzYmk=", "bGVzYmlhbg==", "bG9udGU=", "bGFjdXI=", "amFibGF5", "cGVyZWs=", "c3VuZGFs",
  "c2Vrcw==", "a29uZG9t", "ZGlsZG8=", "dmlicmF0b3I=", "bWFzdHVyYmFzaQ==", "Y29saQ==", "Y29sbWVr",
  "c2Vwb25n", "ZGVzYWg=", "bWw=", "bWFsaW5n", "a29ydXBzaQ==", "bWVuY3VyaQ==", "cGVuaXB1YW4=",
  "c2NhbQ==", "cGhpc2hpbmc=", "aGFja2Vy", "cmV0YXM=", "bWFsd2FyZQ==", "dmlydXM=", "dHJvamFu",
  "cmFuc29td2FyZQ==", "c3B5d2FyZQ==", "YWR3YXJl", "c3Bpb25hc2U=", "dGVyb3Jpc21l", "Ym9t",
  "Z3JhbmF0", "cGlzdG9s", "c2VuYXBhbg==", "cGVsdXJ1", "YW11bmlzaQ==", "bmFya29iYQ==", "Z2FuamE=",
  "c2FidQ==", "ZWtzdGFzaQ==", "a29rYWlu", "aGVyb2lu", "bW9yZmlu", "b3BpdW0=", "Y2FuZHU=",
  "c2hhYnU=", "cGlsIGtvcGxv", "ZG9waW5n", "b2JhdCB0ZXJsYXJhbmc=", "anVhbCBvYmF0",
  "QWpn", "YWpn", "YUpn", "YWpH", "a250bA==", "a250b2w=",
  "ajRuY2swaw==", "ajRuYzBr", "ajRuY3Vr", "amFuY29r", "amFuY3Vr", "amFuYzBr", "amFuYzBr",
  "dDBsMGw=", "dDBsMDE=", "dG9sMGw=", "dDBsb2w=", "dDAxbzE=", "dDAxMDE=", "dDAxb2w=",
  "azBudDBs", "azBudG9s", "a29udDBs", "azBudDAx", "a29udDAx", "azBudDBs",
  "bTNtM2s=", "bTNtZWs=", "bWVtM2s=", "bTNtM2s=", "bWVtZWs=", "bTNtM3E=", "bWVtM3E=", "bTNtZXE=",
  "bmczbnQwdA==", "bmdlbnQwdA==", "bmczbntot", "bmdlbnQwZA==", "bmczbntBZA==", "bmdlbnRvZA==",
  "cDNsNGN1cg==", "cGVsYWN1cg==", "cDNsYWN1cg==", "cGVsNGN1cg==", "cDNsNGN1cg==", "cGVsNGMwcg==",
  "NHN1", "NHMw", "YXMw", "YTV1", "YTUw", "YXMw", "YTV1", "NHN1", "NHMw",
  "YjRiMQ==", "YjRiaQ==", "YmFiMQ==", "YjRiMQ==", "YjRiaQ==", "YmFiMQ==", "YjRiMQ==", "YjRiaQ==",
  "YjRuZ3M0dA==", "YmFuZ3M0dA==", "YjRuZ3NhdA==", "YmFuZ3M0dA==", "YjRuZ3M0dA==", "YjRuZ3NhdA==",
  "ZzBibDBr", "ZzBibG9r", "Z29ibDBr", "ZzBibDBr", "ZzBibG9r", "Z29ibDBr", "ZzBibDBr",
  "ajNtYjB0", "ajNtYm90", "amVtYjB0", "ajNtYjB0", "ajNtYm90", "amVtYjB0", "ajNtYjB0",
  "dDRp", "dDQx", "dGEx", "dDRp", "dDQx", "dGEx", "dDRp", "dDQx", "dGEx",
  "YjBrM3A=", "YjBrZXA=", "Ym9rM3A=", "YjBrM3A=", "YjBrZXA=", "Ym9rM3A=", "YjBrM3A=",
  "NG5qMW5n", "NG5qaW5n", "YW5qMW5n", "NG5qMW5n", "NG5qaW5n", "YW5qMW5n", "NG5qMW5n",
  "azRtcDN0", "azRtcHJldA==", "a2FtcHIzdA==", "azRtcHIzdA==", "azRtcHJldA==", "a2FtcHIzdA==",
  "cDNyZWs=", "cGVyM2s=", "cDNyM2s=", "cDNyZWs=", "cGVyM2s=", "cDNyM2s=", "cDNyZWs=",
  "czN0NG4=", "czN0YW4=", "c2V0NG4=", "czN0NG4=", "czN0YW4=", "c2V0NG4=", "czN0NG4=",
  "YjNnbw==", "YjNnMA==", "YmVnMA==", "YjNnbw==", "YjNnMA==", "YmVnMA==", "YjNnbw==", "YjNnMA==",
  "MWJsMXM=", "MWJsaXM=", "aWJsMXM=", "MWJsMXM=", "MWJsaXM=", "aWJsMXM=", "MWJsMXM=",
  "YjRuYzE=", "YjRuY2k=", "YmFuYzE=", "YjRuYzE=", "YjRuY2k=", "YmFuYzE=", "YjRuYzE=",
  "bDBudDM=", "bDBudGU=", "bG9udDM=", "bDBudDM=", "bDBudGU=", "bG9udDM=", "bDBudDM=",
  "ajRibDR5", "ajRibGF5", "amFibDR5", "ajRibDR5", "ajRibGF5", "amFibDR5", "ajRibDR5",
  "czNrcw==", "czNrNQ==", "c2VrNQ==", "czNrcw==", "czNrNQ==", "c2VrNQ==", "czNrcw==", "czNrNQ==",
  "azBuZDBt", "azBuZG9t", "a29uZDBt", "azBuZDBt", "azBuZG9t", "a29uZDBt", "azBuZDBt",
  "YzBsMQ==", "YzBsaQ==", "Y29sMQ==", "YzBsMQ==", "YzBsaQ==", "Y29sMQ==", "YzBsMQ==", "YzBsaQ==",
  "bTRsMW5n", "bTRsaW5n", "bWFsMW5n", "bTRsMW5n", "bTRsaW5n", "bWFsMW5n", "bTRsMW5n",
  "c2M0bQ==", "c2M0bQ==", "c2M0bQ==", "c2M0bQ==", "c2M0bQ==", "c2M0bQ==", "c2M0bQ==", "c2M0bQ==",
  "aDRjazNy", "aDRja2Vy", "aGFjazNy", "aDRjazNy", "aDRja2Vy", "aGFjazNy", "aDRjazNy",
  "djFydTU=", "djFydXM=", "dmlydTU=", "djFydTU=", "djFydXM=", "dmlydTU=", "djFydTU=",
  "bjRyazBiNA==", "bjRya29iYQ==", "bmFyazBiNA==", "bjRyazBiNA==", "bjRya29iYQ==", "bmFyazBiNA==",
  "ZzRuajQ=", "ZzRuamE=", "Z2FuajQ=", "ZzRuajQ=", "ZzRuamE=", "Z2FuajQ=", "ZzRuajQ=",
  "czRidQ==", "czRiMA==", "c2FiMA==", "czRidQ==", "czRiMA==", "c2FiMA==", "czRidQ==", "czRiMA==",
  "M2tzdDRzMQ==", "M2tzdGFzaQ==", "ZWtzdDRzMQ==", "M2tzdDRzMQ==", "M2tzdGFzaQ==", "ZWtzdDRzMQ==",
  "azBrNDFu", "azBrYWlu", "a29rNDFu", "azBrNDFu", "azBrYWlu", "a29rNDFu", "azBrNDFu",
  "aDNyMDFu", "aDNyb2lu", "aGVyMDFu", "aDNyMDFu", "aDNyb2lu", "aGVyMDFu", "aDNyMDFu",
  "MHAxdW0=", "MHBpdW0=", "b3AxdW0=", "MHAxdW0=", "MHBpdW0=", "b3AxdW0=", "MHAxdW0=",
  "YzRuZHU=", "YzRuZDA=", "Y2FuZDA=", "YzRuZHU=", "YzRuZDA=", "Y2FuZDA=", "YzRuZHU=",
  "c2g0YnU=", "c2g0YjA=", "c2hhYjA=", "c2g0YnU=", "c2g0YjA=", "c2hhYjA=", "c2g0YnU=",
  "ZDBwMW5n", "ZDBwaW5n", "ZG9wMW5n", "ZDBwMW5n", "ZDBwaW5n", "ZG9wMW5n", "ZDBwMW5n"
];

/**
 * Fungsi untuk mendekode array Base64
 * 
 * @param encodedWords Array dari string yang dienkode dengan Base64
 * @returns Array dari string yang sudah didekode
 */
function decodeBase64Array(encodedWords: string[]): string[] {
  const decodedWords: string[] = [];
  
  for (const encodedWord of encodedWords) {
    try {
      const decoded = atob(encodedWord);
      decodedWords.push(decoded);
    } catch {
      console.error(`Gagal mendekode: "${encodedWord}"`);
    }
  }
  
  return decodedWords;
}

// Variabel untuk menyimpan kata terlarang yang sudah didekode (lazy loading)
let FORBIDDEN_WORDS: string[] | null = null;

/**
 * Set untuk URL pendek mencurigakan untuk optimasi pencarian O(1)
 */
const SUSPICIOUS_URL_DOMAINS = new Set([
  'bit.ly', 'goo.gl', 'tinyurl.com', 't.co', 'is.gd', 'ow.ly'
]);

/**
 * Fungsi untuk memeriksa konten berbahaya
 * 
 * @param text Teks yang akan diperiksa
 * @returns true jika konten mengandung kata terlarang, URL mencurigakan atau terlalu banyak URL
 */
const containsProhibitedContent = (text: string): boolean => {
  if (!text) return false;
  
  // Dekode kata terlarang hanya sekali saat pertama kali dibutuhkan
  if (!FORBIDDEN_WORDS) {
    FORBIDDEN_WORDS = decodeBase64Array(FORBIDDEN_WORDS_ENCODED);
  }
  
  const lowercaseText = text.toLowerCase();
  
  // 1. Cek kata-kata terlarang dengan metode yang lebih efisien
  if (FORBIDDEN_WORDS.some(word => lowercaseText.includes(word.toLowerCase()))) {
    console.log('Konten terlarang terdeteksi');
    return true;
  }
  
  // 2. Cek URL yang mencurigakan dengan metode yang lebih efisien
  const urlMatches = lowercaseText.match(/(?:https?:\/\/)?(?:www\.)?([^/\s]+)/g);
  if (urlMatches) {
    // Hitung total URL
    if (urlMatches.length > 3) {
      console.log('Terlalu banyak URL terdeteksi');
      return true;
    }
    
    // Cek domain mencurigakan dengan pencarian O(1) menggunakan Set
    for (const url of urlMatches) {
      // Ekstrak domain dari URL
      const domainMatch = url.match(/(?:https?:\/\/)?(?:www\.)?([^/\s]+)/);
      if (domainMatch && domainMatch[1]) {
        const domain = domainMatch[1];
        
        if (SUSPICIOUS_URL_DOMAINS.has(domain)) {
          console.log('URL mencurigakan terdeteksi');
          return true;
        }
      }
    }
  }
  
  return false;
};

// Variabel untuk menyimpan instance Supabase client secara global
let supabaseClient: SupabaseClient | null = null;

/**
 * Interface hasil untuk pesan kesalahan dan sukses
 */
interface OperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Composable untuk operasi Supabase
 * Menggunakan pola singleton untuk client Supabase
 */
export const useSupabase = () => {
  // Ambil konfigurasi runtime
  const runtimeConfig = useRuntimeConfig();
  
  // Inisialisasi client Supabase dengan pola singleton
  if (!supabaseClient) {
    const supabaseUrl = runtimeConfig.public.supabaseUrl;
    const supabaseKey = runtimeConfig.public.supabaseKey;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL atau Key tidak ditemukan di konfigurasi runtime!');
    }
    
    supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
  }
  
  // Gunakan client yang sudah dibuat
  const client = supabaseClient;
  
  /**
   * Fungsi untuk mengambil daftar ucapan
   * @returns Object berisi data ucapan dan error jika ada
   */
  const getGreetings = async (): Promise<{ data: Greeting[], error: string | null }> => {
    try {
      const { data, error } = await client
        .from('greetings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Konversi data ke format aplikasi
      return { 
        data: (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          message: item.message,
          image: item.image_url,
          timestamp: new Date(item.created_at)
        })), 
        error: null 
      };
    } catch (err: unknown) {
      console.error('Error fetching greetings:', err);
      return { 
        data: [], 
        error: 'Gagal memuat ucapan' 
      };
    }
  };

  /**
   * Fungsi untuk menambahkan ucapan baru dengan validasi
   * 
   * @param greetingData Data ucapan yang akan ditambahkan
   * @returns Object yang menunjukkan status operasi
   */
  const addGreeting = async (greetingData: Greeting & { captchaToken?: string }): Promise<OperationResult> => {
    try {
      // 1. Filter konten terlarang
      if (containsProhibitedContent(greetingData.name) || 
          containsProhibitedContent(greetingData.message)) {
        return {
          success: false,
          error: 'Konten tidak diizinkan. Mohon periksa kembali pesan Anda.'
        };
      }
      
      // 2. Validasi panjang konten
      if (greetingData.name.length > 100 || greetingData.message.length > 2000) {
        return {
          success: false,
          error: 'Pesan terlalu panjang. Nama maksimal 100 karakter dan pesan maksimal 2000 karakter.'
        };
      }
      
      // 3. Simpan data ke database
      const { data, error } = await client
        .from('greetings')
        .insert([{
          name: greetingData.name,
          message: greetingData.message,
          image_url: greetingData.image || null,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      // 4. Trigger event untuk pembaruan UI
      window.dispatchEvent(new Event('greeting-added'));
      
      return { success: true, data };
    } catch (error: unknown) {
      console.error('Error adding greeting:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Gagal menambahkan ucapan' 
      };
    }
  };

  /**
   * Fungsi untuk upload gambar dengan validasi
   * 
   * @param file File gambar yang akan diupload
   * @returns URL publik dari gambar yang diupload, atau null jika gagal
   */
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // 1. Validasi tipe file
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validMimeTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        return null;
      }
      
      // 2. Validasi ukuran file (max 5MB untuk performa)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        return null;
      }
      
      // 3. Upload file ke storage bucket
      const bucketName = 'greeting-images';
      let fileExt = file.name.split('.').pop() || '';
      
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExt.toLowerCase())) {
        fileExt = 'jpg';
      }
      
      // Gunakan timestamp dan random string untuk mencegah collision
      const randomStr = Math.random().toString(36).substring(2, 10);
      const filePath = `greeting_${Date.now()}_${randomStr}.${fileExt.toLowerCase()}`;
      
      const { error } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: publicURL } = client.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      return publicURL.publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
  };

  /**
   * Fungsi untuk menghapus ucapan
   * 
   * @param id ID ucapan yang akan dihapus
   * @returns Object yang menunjukkan status operasi
   */
  const deleteGreeting = async (id: string): Promise<OperationResult> => {
    try {
      const { error } = await client
        .from('greetings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Trigger event refresh
      window.dispatchEvent(new Event('greeting-deleted'));
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Error deleting greeting:', err);
      return { 
        success: false, 
        error: 'Gagal menghapus ucapan' 
      };
    }
  };

  return {
    client,
    getGreetings,
    addGreeting,
    uploadImage,
    deleteGreeting,
  };
}; 