<!-- 
  ParticleBackground.vue - Komponen untuk menampilkan efek partikel bergerak di latar belakang
  Menggunakan canvas untuk menggambar dan menganimasi partikel
-->
<template>
  <div class="particle-container">
    <canvas 
      ref="particleCanvas" 
      class="particles-canvas"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Canvas reference
const particleCanvas = ref<HTMLCanvasElement | null>(null);

// Partikel properties
interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  type: 'star' | 'crescent' | 'dot';
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  glowing: boolean;
  glowDuration: number;
  glowTimer: number;
}

let particles: Particle[] = [];
let animationFrameId: number | null = null;
let ctx: CanvasRenderingContext2D | null = null;

// Setup dan resize handler
const initCanvas = () => {
  const canvas = particleCanvas.value;
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  resizeCanvas();

  // Create initial particles
  createParticles();

  // Start animation
  animate();
};

// Resize canvas when window size changes
const resizeCanvas = () => {
  const canvas = particleCanvas.value;
  if (!canvas || !canvas.parentElement) return;

  const { width, height } = canvas.parentElement.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
};

// Create initial particles
const createParticles = () => {
  const canvas = particleCanvas.value;
  if (!canvas) return;

  // Clear existing particles
  particles = [];

  // Jumlah partikel sesuai dengan ukuran canvas
  const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
  
  // Colors for Eid/Lebaran theme
  const colors = ['#ffffff', '#f1c40f', '#2ecc71', '#3498db', '#e74c3c'];
  const types: ('star' | 'crescent' | 'dot')[] = ['star', 'crescent', 'dot'];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      type: types[Math.floor(Math.random() * types.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      opacity: Math.random() * 0.5 + 0.3,
      glowing: false,
      glowDuration: 60, // Frames
      glowTimer: 0
    });
  }
};

// Draw star shape
const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(
      Math.cos((i * 2 * Math.PI) / 5) * size,
      Math.sin((i * 2 * Math.PI) / 5) * size
    );
    ctx.lineTo(
      Math.cos(((i * 2 + 1) * Math.PI) / 5) * (size / 2),
      Math.sin(((i * 2 + 1) * Math.PI) / 5) * (size / 2)
    );
  }
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
};

// Draw crescent shape
const drawCrescent = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(size * 0.4, 0, size * 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  
  ctx.restore();
};

// Animation loop
const animate = () => {
  if (!ctx || !particleCanvas.value) return;
  
  ctx.clearRect(0, 0, particleCanvas.value.width, particleCanvas.value.height);
  
  particles.forEach(p => {
    // Update position
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    
    // Handle boundaries
    if (p.x < 0) p.x = particleCanvas.value!.width;
    if (p.x > particleCanvas.value!.width) p.x = 0;
    if (p.y < 0) p.y = particleCanvas.value!.height;
    if (p.y > particleCanvas.value!.height) p.y = 0;
    
    // Handle glowing effect
    if (p.glowing) {
      p.glowTimer++;
      p.opacity = 0.8 + Math.sin(p.glowTimer * 0.1) * 0.2;
      
      if (p.glowTimer >= p.glowDuration) {
        p.glowing = false;
        p.glowTimer = 0;
        p.opacity = Math.random() * 0.5 + 0.3;
      }
    }
    
    // Draw particle
    if (ctx) {
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      
      if (p.type === 'star') {
        drawStar(ctx, p.x, p.y, p.size * 2, p.rotation);
      } else if (p.type === 'crescent') {
        drawCrescent(ctx, p.x, p.y, p.size * 2, p.rotation);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
    }
  });
  
  animationFrameId = requestAnimationFrame(animate);
};

// Fungsi untuk membuat partikel bercahaya saat diklik di dekatnya
const handleClick = (e: MouseEvent) => {
  const canvas = particleCanvas.value;
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  particles.forEach(p => {
    const distance = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
    if (distance < 50) {
      p.glowing = true;
      p.glowTimer = 0;
    }
  });
};

// Lifecycle hooks
onMounted(() => {
  initCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('click', handleClick);
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', resizeCanvas);
  window.removeEventListener('click', handleClick);
});
</script>

<style scoped>
.particle-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
</style> 