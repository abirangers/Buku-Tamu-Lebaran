import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'
import type { Greeting } from '~/types'

// Gunakan tipe yang dihasilkan oleh Supabase
type SupabaseClient = ReturnType<typeof createClient<Database>>

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
   * Fungsi untuk menambahkan ucapan baru
   * 
   * @param greetingData Data ucapan yang akan ditambahkan
   * @returns Object yang menunjukkan status operasi
   */
  const addGreeting = async (greetingData: {
    name: string;
    message: string;
    image: string | null;
  }): Promise<OperationResult> => {
    try {
      // Validasi panjang konten
      if (greetingData.name.length > 100 || greetingData.message.length > 2000) {
        return {
          success: false,
          error: 'Pesan terlalu panjang. Nama maksimal 100 karakter dan pesan maksimal 2000 karakter.'
        };
      }
      
      // Simpan data ke database
      const { data, error } = await client
        .from('greetings')
        .insert([{
          name: greetingData.name,
          message: greetingData.message,
          image_url: greetingData.image,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      // Trigger event untuk pembaruan UI
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
          cacheControl: '31536000', // 1 tahun caching
          upsert: true
        });
      
      if (error) throw error;
      
      const { data } = client.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // // Buat thumbnail saat upload
      // const thumbnailPath = `thumb_${filePath}`;
      // // ...implementasi resize dan kompresi thumbnail
      
      return data.publicUrl;
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