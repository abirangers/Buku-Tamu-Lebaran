<template>
  <div class="greeting-form-container">
    <UCard
      class="shadow-md border-2 border-primary-50 dark:border-primary-950 overflow-hidden"
    >
      <div
        class="flex items-center space-x-3 mb-5 px-3 py-3 bg-primary-50 dark:bg-primary-900/30 -mx-4 -mt-4 rounded-t-xl"
      >
        <UIcon
          name="i-heroicons-pencil-square"
          class="text-primary-500 dark:text-primary-400 h-6 w-6"
        />
        <h3
          class="text-lg font-semibold text-primary-700 dark:text-primary-300"
        >
          Kirim Ucapan Anda
        </h3>
      </div>

      <UForm
        class="space-y-6"
        :schema="greetingSchema"
        :state="form"
        @submit="submitForm"
      >
        <UFormField label="Nama Anda">
          <UInput
            v-model="form.name"
            placeholder="Masukkan nama Anda"
            size="lg"
            class="w-full transition-all focus:ring-2 focus:ring-primary-500/50"
            icon="i-heroicons-user-circle"
            required
            autocomplete="name"
            @blur="validateName(form.name)"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            {{ nameCharCount }}/{{ MAX_NAME_LENGTH }} karakter
          </p>
        </UFormField>

        <UFormField label="Pesan Ucapan Lebaran">
          <UTextarea
            v-model="form.message"
            placeholder="Ketik ucapan Lebaran Anda di sini..."
            :rows="4"
            size="lg"
            class="w-full transition-all focus:ring-2 focus:ring-primary-500/50"
            required
            @blur="validateMessage(form.message)"
          />
          <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
          <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            {{ messageCharCount }}/{{ MAX_MESSAGE_LENGTH }} karakter
          </p>
        </UFormField>

        <!-- Honeypot field (Tersembunyi dari pengguna, tapi terlihat oleh bot) -->
        <div class="hidden" aria-hidden="true">
          <label>
            Jangan isi field ini (Honeypot)
            <input
              type="text"
              v-model="honeypot"
              tabindex="-1"
              autocomplete="off"
            />
          </label>
        </div>

        <UFormField
          label="Unggah Gambar (Opsional)"
          help="Maksimum 5MB. Format: JPG, PNG, GIF, WEBP"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-center w-full">
              <label
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-50 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <div
                  class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                  <UIcon
                    name="i-heroicons-photo"
                    class="w-8 h-8 mb-3 text-neutral-400"
                  />
                  <p
                    class="mb-2 text-sm text-neutral-500 dark:text-neutral-400"
                  >
                    <span class="font-semibold">Klik untuk pilih gambar</span>
                    atau seret dan lepas
                  </p>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400">
                    JPG, PNG, GIF atau WEBP (Maks. 5MB)
                  </p>
                </div>
                <UInput
                  ref="fileInputRef"
                  type="file"
                  :accept="ALLOWED_MIME_TYPES.join(',')"
                  class="hidden"
                  @change="handleImageUpload"
                />
              </label>
            </div>

            <p v-if="errors.image" class="text-red-500 text-sm mt-1">{{ errors.image }}</p>

            <Transition name="fade" mode="out-in">
              <div v-if="imagePreview">
                <div
                  class="w-fit mt-4 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                >
                  <div class="relative group">
                    <div class="transition-opacity duration-200 group-hover:opacity-75">
                      <NuxtImg
                        :src="imagePreview"
                        alt="Pratinjau gambar" 
                        class="max-h-40 h-auto w-auto rounded-md object-cover"
                      />
                    </div>
                    
                    <UButton
                      type="button"
                      color="error"
                      variant="solid"
                      size="sm"
                      icon="i-heroicons-trash"
                      @click="clearImage"
                      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hover:bg-red-450 cursor-pointer"
                    >
                      Hapus
                    </UButton>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting || isRateLimited"
          icon="i-heroicons-paper-airplane"
          class="cursor-pointer mt-8 transform hover:translate-y-[-2px] transition-transform"
        >
          <span v-if="isSubmitting">Mengirim...</span>
          <span v-else-if="isRateLimited">
            Terlalu banyak pengiriman, tunggu {{ remainingCooldown }} detik
          </span>
          <span v-else>Kirim Ucapan</span>
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted } from "vue";
import * as v from "valibot";
import { useGreetingFormValidation } from '~/composables/useGreetingFormValidation';
import { useGreetingFormSecurity } from '~/composables/useGreetingFormSecurity';

/**
 * GreetingForm Component
 * 
 * Komponen untuk mengirim ucapan Lebaran
 * Menggunakan composables untuk validasi dan keamanan
 */

// Skema validasi untuk form
const greetingSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Nama tidak boleh kosong."),
    v.maxLength(50, "Nama tidak boleh lebih dari 50 karakter.")
  ),
  message: v.pipe(
    v.string(),
    v.minLength(1, "Pesan tidak boleh kosong."),
    v.maxLength(500, "Pesan tidak boleh lebih dari 500 karakter.")
  ),
});

// Data reaktif untuk form yang digunakan dengan UForm
const form = reactive({
  name: "",
  message: "",
});

// Composable untuk validasi form
const { 
  errors, 
  imageFile, 
  imagePreview, 
  isSubmitting,
  nameCharCount,
  messageCharCount,
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
  ALLOWED_MIME_TYPES,
  validateName,
  validateMessage,
  validateAll,
  handleImageUpload,
  clearImage,
  resetForm,
  updateName,
  updateMessage
} = useGreetingFormValidation();

// Menggunakan watch untuk memvalidasi dan update counter character saat input berubah
watch(() => form.name, (newVal) => {
  if (newVal.trim()) {
    errors.name = '';
  }
  
  updateName(newVal);
});

watch(() => form.message, (newVal) => {
  if (newVal.trim()) {
    errors.message = '';
  }
  
  updateMessage(newVal);
});

// Composable untuk fitur keamanan
const {
  honeypot,
  isRateLimited,
  remainingCooldown,
  recordSubmit,
  isBot,
  containsSpamContent
} = useGreetingFormSecurity();

// Integrasi dengan Supabase
const { uploadImage, addGreeting } = useSupabase();
const toast = useToast();
const fileInputRef = ref<HTMLInputElement | null>(null);

// Handler submit form
const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // Validasi semua input dengan nilai dari form
    if (!validateAll(form)) {
      isSubmitting.value = false;
      return;
    }

    // 2. Deteksi Bot
    if (isBot()) {
      // Tunda tanggapan untuk membuat bot berpikir submit berhasil
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.add({
        title: "Terima kasih",
        description: "Ucapan Anda telah diterima!",
        icon: "i-heroicons-check-circle",
        color: "success",
      });
      
      resetForm();
      isSubmitting.value = false;
      return;
    }

    // 3. Deteksi Spam Konten
    if (containsSpamContent(form.name) || containsSpamContent(form.message)) {
      toast.add({
        title: "Konten tidak diizinkan",
        description: "Mohon hindari kata-kata yang tidak pantas atau bersifat spam.",
        icon: "i-heroicons-exclamation-triangle",
        color: "warning",
      });
      
      isSubmitting.value = false;
      return;
    }

    // 4. Upload gambar jika ada
    let imageUrl: string | null = null;
    if (imageFile.value) {
      imageUrl = await uploadImage(imageFile.value);
      if (!imageUrl) {
        toast.add({
          title: "Peringatan",
          description: "Gagal mengunggah gambar, tapi ucapan tetap akan disimpan",
          icon: "i-heroicons-exclamation-triangle",
          color: "warning",
        });
      }
    }

    // 5. Tambahkan ucapan ke database Supabase
    const { success, error } = await addGreeting({
      name: form.name,
      message: form.message,
      image: imageUrl,
    });

    if (!success) {
      toast.add({
        title: "Gagal menyimpan ucapan",
        description: error || "Terjadi kesalahan yang tidak diketahui.",
        icon: "i-heroicons-exclamation-circle",
        color: "error",
      });
      isSubmitting.value = false;
      return;
    }

    // Sukses: Tampilkan pesan sukses
    toast.add({
      title: "Berhasil",
      description: "Ucapan Anda telah berhasil dikirim",
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    // Catat riwayat submit untuk deteksi spam
    recordSubmit();

    // Reset form dan input file setelah berhasil submit
    resetForm();
    form.name = "";
    form.message = "";
    
    // Perbarui juga nilai di composable
    updateName("");
    updateMessage("");

    // -- PICU EVENT UNTUK REFRESH FEED --
    window.dispatchEvent(new Event('greeting-added'));
    // ------------------------------------
    
  } catch (err) {
    console.error("Error submitting form:", err);
    toast.add({
      title: "Terjadi kesalahan",
      description: "Gagal mengirim ucapan. Silakan coba lagi nanti.",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Inisialisasi nilai saat komponen dimuat
onMounted(() => {
  // Sinkronisasi nilai awal
  updateName(form.name);
  updateMessage(form.message);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 