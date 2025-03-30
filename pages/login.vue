<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
        <!-- Illustration atau decorative element -->
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
            <div class="absolute top-5 right-20 w-32 h-32 rounded-full bg-primary-300/20 dark:bg-primary-700/10"></div>
            <div class="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-primary-400/10 dark:bg-primary-600/10"></div>
            <div class="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-amber-300/20 dark:bg-amber-700/10"></div>
        </div>
        
        <!-- Card login dengan efek gradient subtle -->
        <div class="w-full max-w-md relative overflow-hidden z-10">
            <!-- Card utama -->
            <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-neutral-100 dark:border-neutral-700 transform transition-all hover:shadow-xl">
                <!-- Logo dan header -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-4">
                        <UIcon name="i-heroicons-user-circle" class="text-2xl text-primary-500 dark:text-primary-400" />
                    </div>
                    <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">
                        Masuk ke Akun Admin
                    </h1>
                    <p class="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">
                        Login untuk mengelola ucapan dan konten
                    </p>
                </div>

                <!-- Notifikasi sukses -->
                <Transition name="fade-slide-y">
                    <div v-if="isSubmitted" class="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                        <div class="flex items-center">
                            <UIcon name="i-heroicons-check-circle" class="h-5 w-5 text-green-500 mr-2" />
                            <p class="text-green-700 dark:text-green-300">
                                Anda berhasil masuk ke akun.
                            </p>
                        </div>
                    </div>
                </Transition>

                <!-- Form login dengan efek transisi -->
                <form @submit.prevent="handleSubmit" class="space-y-5">
                    <div class="space-y-1">
                        <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Email
                        </label>
                        <UInput 
                            id="email" 
                            v-model="email" 
                            type="email" 
                            placeholder="Masukkan email Anda" 
                            size="lg"
                            icon="i-heroicons-envelope"
                            class="w-full transition-all focus:ring-2 focus:ring-primary-500/50" 
                        />
                    </div>

                    <div class="space-y-1">
                        <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <UInput 
                            id="password" 
                            v-model="password" 
                            type="password" 
                            placeholder="Masukkan password Anda"
                            icon="i-heroicons-lock-closed"
                            size="lg" 
                            class="w-full transition-all focus:ring-2 focus:ring-primary-500/50" 
                        />
                    </div>

                    <UButton 
                        type="submit" 
                        block
                        color="primary"
                        :loading="isLoading"
                        :disabled="isLoading || !email || !password"
                        class="mt-8 transform hover:translate-y-[-2px] transition-transform"
                    >
                        <span v-if="!isLoading">Masuk</span>
                        <span v-else>Memproses...</span>
                    </UButton>
                </form>

                <!-- Divider dengan ornamen -->
                <div class="my-6 w-full flex items-center">
                    <div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
                    <UIcon name="i-heroicons-star" class="h-4 w-4 mx-3 text-primary-500" />
                    <div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
                </div>

                <!-- Link kembali ke beranda -->
                <div class="text-center">
                    <NuxtLink to="/" class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline">
                        <UIcon name="i-heroicons-home" class="mr-1 h-4 w-4" />
                        Kembali ke Beranda
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
    middleware: 'guest',
    layout: 'auth'  // Menggunakan layout auth yang tidak memiliki header dan footer
});

// State untuk form login
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);

// Akses Supabase client
const { client } = useSupabase();
const router = useRouter();
const toast = useToast();

// Fungsi untuk menangani submit form
const handleSubmit = async () => {
    try {
        isLoading.value = true;

        // Login dengan email dan password
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });

        if (error) throw error;

        // Login berhasil
        isSubmitted.value = true;
        email.value = '';
        password.value = '';

        toast.add({
            title: 'Login Berhasil',
            description: 'Selamat datang kembali!',
            icon: 'i-heroicons-check-circle',
            color: 'success'
        });

        setTimeout(() => {
            router.push('/');
        }, 1000);

    } catch (error) {
        console.error('Gagal login:', error);

        // Tampilkan pesan error yang lebih deskriptif
        let errorMessage = 'Email atau password salah';

        // Pesan error yang lebih spesifik berdasarkan tipe error dari Supabase
        if (error.message) {
            if (error.message.includes('Invalid login credentials')) {
                errorMessage = 'Email atau password salah';
            } else if (error.message.includes('Email not confirmed')) {
                errorMessage = 'Email belum dikonfirmasi';
            } else {
                errorMessage = `Kesalahan: ${error.message}`;
            }
        }

        // Tampilkan notifikasi error
        toast.add({
            title: 'Gagal Login',
            description: errorMessage,
            color: 'error',
            icon: 'i-heroicons-exclamation-circle'
        });
    } finally {
        isLoading.value = false;
    }
};

</script>

<style scoped>
/* Fade slide transition */
.fade-slide-y-enter-active,
.fade-slide-y-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-y-enter-from,
.fade-slide-y-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
