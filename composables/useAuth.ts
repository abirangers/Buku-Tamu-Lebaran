// Composable untuk mengelola autentikasi aplikasi
export const useAuth = () => {
  const { client } = useSupabase();
  const router = useRouter();
  const toast = useToast();
  
  // Ambil session pengguna secara reaktif
  const { data: session, refresh: refreshSession } = useAsyncData('auth-session', async () => {
    const { data } = await client.auth.getSession();
    return data.session;
  });
  
  // Computed state untuk cek status login
  const isLoggedIn = computed(() => session.value !== null);
  
  // Fungsi untuk logout
  const logout = async () => {
    try {
      const { error } = await client.auth.signOut();
      
      if (error) throw error;
      
      // Refresh session state setelah logout berhasil
      await refreshSession();
      
      // Tampilkan pesan sukses
      toast.add({
        title: 'Berhasil Logout',
        description: 'Anda telah berhasil keluar dari sistem',
        color: 'success',
        icon: 'i-heroicons-check-circle'
      });
      
      // Kembali ke halaman utama
      router.push('/');
    } catch (error) {
      console.error('Error saat logout:', error);
      
      // Tampilkan pesan error
      toast.add({
        title: 'Gagal Logout',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan saat mencoba keluar',
        color: 'error',
        icon: 'i-heroicons-exclamation-circle'
      });
    }
  };
  
  // Fungsi untuk cek role/akses user (bisa dikembangkan sesuai kebutuhan)
  const hasAdminAccess = computed(() => {
    // Pastikan user sudah login
    if (!session.value || !session.value.user) return false;
    
    // Logika cek admin bisa disesuaikan dengan kebutuhan aplikasi
    // Contoh: cek user email atau cek claim/role dari auth provider
    return session.value.user.email?.endsWith('@admin.com') || false;
  });
  
  return {
    session,
    isLoggedIn,
    hasAdminAccess,
    logout,
    refreshSession
  };
}; 