/**
 * Middleware untuk halaman yang hanya boleh diakses oleh tamu (guest)
 * 
 * Middleware ini akan memeriksa apakah pengguna sudah login.
 * Jika sudah login, pengguna akan diarahkan ke halaman beranda.
 * Jika belum login, pengguna dapat mengakses halaman tersebut.
 */
export default defineNuxtRouteMiddleware(async () => {
  // Mendapatkan klien Supabase
  const { client } = useSupabase();
  
  try {
    // Memeriksa sesi pengguna saat ini
    const { data } = await client.auth.getSession();
    
    console.log(data);
    // Jika pengguna sudah login (sesi ada), arahkan ke halaman beranda
    if (data.session) {
      // Arahkan ke halaman beranda
      return navigateTo('/');
    }
  } catch (error) {
    // Jika terjadi kesalahan, catat ke konsol
    console.error('Kesalahan saat memeriksa status login:', error);
  }
  
  // Jika pengguna belum login, lanjutkan ke halaman yang diminta
  return;
});
