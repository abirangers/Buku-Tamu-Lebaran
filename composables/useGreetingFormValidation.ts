import { ref, computed, reactive } from 'vue'

/**
 * Composable untuk validasi form ucapan
 * Mengelola validasi nama, pesan, dan gambar
 */
export function useGreetingFormValidation() {
  // ---------- FORM STATE ----------
  const name = ref('')
  const message = ref('')
  const imageFile = ref<File | null>(null)
  const imagePreview = ref('')
  const isSubmitting = ref(false)
  
  // Menggunakan reactive untuk errors supaya bisa diakses sebagai errors.name di template
  const errors = reactive({
    name: '',
    message: '',
    image: ''
  })

  // ---------- VALIDATION RULES ----------
  const MAX_NAME_LENGTH = 50
  const MIN_MESSAGE_LENGTH = 3
  const MAX_MESSAGE_LENGTH = 500
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const SUSPICIOUS_MIME_TYPES = ['application/javascript', 'text/html', 'application/x-msdownload']

  // ---------- COMPUTED ----------
  const isValid = computed(() => {
    // Hanya validasi jika tidak ada error
    return !errors.name && 
           !errors.message && 
           !errors.image
  })

  const nameCharCount = computed(() => name.value.length)
  const messageCharCount = computed(() => message.value.length)

  // ---------- UPDATE METHODS ----------
  // Fungsi untuk memperbarui nilai name
  const updateName = (newName: string) => {
    name.value = newName
  }
  
  // Fungsi untuk memperbarui nilai message
  const updateMessage = (newMessage: string) => {
    message.value = newMessage
  }

  // ---------- VALIDATION METHODS ----------
  const validateName = (externalValue?: string) => {
    const valueToCheck = externalValue !== undefined ? externalValue : name.value;
    
    // Reset error sebelum validasi
    if (valueToCheck.trim()) {
      errors.name = '';
    }

    if (!valueToCheck.trim()) {
      errors.name = 'Nama tidak boleh kosong';
      return false;
    }

    if (valueToCheck.length > MAX_NAME_LENGTH) {
      errors.name = `Nama tidak boleh lebih dari ${MAX_NAME_LENGTH} karakter`;
      return false;
    }

    // Hapus error jika validasi berhasil
    errors.name = '';
    return true;
  }

  const validateMessage = (externalValue?: string) => {
    const valueToCheck = externalValue !== undefined ? externalValue : message.value;
    
    // Reset error sebelum validasi
    if (valueToCheck.trim()) {
      errors.message = '';
    }

    if (!valueToCheck.trim()) {
      errors.message = 'Pesan tidak boleh kosong';
      return false;
    }

    if (valueToCheck.length < MIN_MESSAGE_LENGTH) {
      errors.message = `Pesan minimal ${MIN_MESSAGE_LENGTH} karakter`;
      return false;
    }

    if (valueToCheck.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Pesan tidak boleh lebih dari ${MAX_MESSAGE_LENGTH} karakter`;
      return false;
    }

    // Hapus error jika validasi berhasil
    errors.message = '';
    return true;
  }

  const validateImage = () => {
    errors.image = '';

    // Jika tidak ada gambar, itu valid (gambar opsional)
    if (!imageFile.value) return true;

    // Validasi ukuran file
    if (imageFile.value.size > MAX_IMAGE_SIZE) {
      errors.image = 'Ukuran gambar tidak boleh lebih dari 5MB';
      return false;
    }

    // Validasi tipe file yang diizinkan
    if (!ALLOWED_MIME_TYPES.includes(imageFile.value.type)) {
      errors.image = 'Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP';
      return false;
    }

    // Cek tipe file yang mencurigakan (keamanan tambahan)
    if (SUSPICIOUS_MIME_TYPES.includes(imageFile.value.type)) {
      errors.image = 'Tipe file tidak diizinkan';
      return false;
    }

    return true;
  }

  const validateAll = (formValues?: { name: string, message: string }) => {
    // Gunakan nilai eksternal jika disediakan
    const nameToValidate = formValues?.name ?? name.value;
    const messageToValidate = formValues?.message ?? message.value;
    
    const nameValid = validateName(nameToValidate);
    const messageValid = validateMessage(messageToValidate);
    const imageValid = validateImage();

    return nameValid && messageValid && imageValid;
  }

  // ---------- IMAGE HANDLING ----------
  const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    
    if (!input.files || input.files.length === 0) {
      imageFile.value = null
      imagePreview.value = ''
      return
    }
    
    const file = input.files[0]
    imageFile.value = file
    
    // Generate preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // Validate after setting
    validateImage()
  }

  const clearImage = () => {
    imageFile.value = null
    imagePreview.value = ''
    errors.image = ''
  }

  const resetForm = () => {
    name.value = ''
    message.value = ''
    clearImage()
    
    // Reset semua error
    errors.name = ''
    errors.message = ''
    errors.image = ''
    
    isSubmitting.value = false
  }

  return {
    // State
    name,
    message,
    imageFile,
    imagePreview,
    isSubmitting,
    errors,
    
    // Computed
    isValid,
    nameCharCount,
    messageCharCount,
    
    // Constants
    MAX_NAME_LENGTH,
    MIN_MESSAGE_LENGTH,
    MAX_MESSAGE_LENGTH,
    MAX_IMAGE_SIZE,
    ALLOWED_MIME_TYPES,
    
    // Methods
    validateName,
    validateMessage,
    validateImage,
    validateAll,
    handleImageUpload,
    clearImage,
    resetForm,
    updateName,
    updateMessage
  }
} 