/**
 * Middleware untuk halaman yang memerlukan autentikasi
 * 
 * Middleware ini akan memeriksa apakah pengguna sudah login.
 * Jika belum login, pengguna akan diarahkan ke halaman login.
 * Jika sudah login, pengguna dapat mengakses halaman tersebut.
 */
export default defineNuxtRouteMiddleware(async () => {
  // Mendapatkan klien Supabase
  const { client } = useSupabase();
  
  try {
    // Memeriksa sesi pengguna saat ini
    const { data } = await client.auth.getSession();
    
    // Jika pengguna belum login (tidak ada sesi), arahkan ke halaman login
    if (!data.session) {
      // Tampilkan notifikasi bahwa pengguna perlu login
      useToast().add({
        title: 'Akses Ditolak',
        description: 'Anda harus login untuk mengakses halaman ini',
        color: 'warning'
      });
      
      // Arahkan ke halaman login
      return navigateTo('/login');
    }
  } catch (error) {
    // Jika terjadi kesalahan, catat ke konsol
    console.error('Kesalahan saat memeriksa status login:', error);
    
    // Tampilkan notifikasi error
    useToast().add({
      title: 'Terjadi Kesalahan',
      description: 'Gagal memverifikasi status login Anda',
      color: 'error'
    });
    
    // Arahkan ke halaman login untuk berjaga-jaga
    return navigateTo('/login');
  }
  
  // Jika pengguna sudah login, lanjutkan ke halaman yang diminta
  return;
});
