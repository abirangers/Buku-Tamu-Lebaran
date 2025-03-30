export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  
  // Gunakan private config di sini untuk operasi server
  // JANGAN return data sensitif ke client
  
  // Contoh penggunaan safe: menggunakan service key untuk operasi DB
  return { 
    success: true,
    message: "Operasi server berhasil"
  }
}) 