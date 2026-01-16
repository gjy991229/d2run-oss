<template>
  <div class="flex flex-col h-full w-full">
    <main class="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col">
      <!-- Content area -->
      <div class="flex-1 flex flex-col items-center justify-center space-y-5">
        
        <!-- Logo Section -->
        <div class="text-center select-none">
          <h1 
            class="text-3xl font-bold tracking-[0.15em] uppercase d2-title"
            style="font-family: var(--font-serif);"
          >
            D2Run
          </h1>
          <p 
            class="text-[0.5rem] uppercase tracking-[0.3em] mt-0.5 opacity-50"
            :style="{ color: 'var(--theme-accent)' }"
          >
            – Online –
          </p>
        </div>

        <!-- Description -->
        <p class="text-xs text-center max-w-[200px] opacity-60 leading-relaxed">
          {{ store.t('APP_DESC') }}
        </p>

        <!-- Version -->
        <span class="d2-badge text-[0.6rem] font-mono">v0.1.0</span>

        <!-- Info Cards -->
        <div class="w-full max-w-[220px] space-y-3">
          <!-- Divider -->
          <div class="d2-divider"></div>

          <!-- Developer -->
          <div class="space-y-1">
            <p class="d2-label text-[0.55rem]">{{ store.t('DEV') }}</p>
            <p class="text-sm font-medium pl-2">lllxxxlll</p>
          </div>

          <!-- Contact -->
          <div class="space-y-1">
            <p class="d2-label text-[0.55rem]">{{ store.t('CONTACT') }}</p>
            <p class="text-xs font-mono opacity-80 pl-2">QQ: 980102315</p>
          </div>

          <!-- GitHub -->
          <div class="space-y-1">
            <p class="d2-label text-[0.55rem]">GitHub</p>
            <button
              @click="openGitHub()"
              class="text-xs pl-2 opacity-80 hover:opacity-100 transition-opacity text-left break-all"
              :style="{ color: 'var(--theme-info)' }"
            >
              github.com/gjy991229/d2run
            </button>
          </div>

          <!-- Donation -->
          <div class="space-y-1">
            <p class="d2-label text-[0.55rem]">☕ {{ store.t('DONATE') }}</p>
            <button
              @click="toggleDonateQR()"
              class="text-xs pl-2 underline underline-offset-2 transition-colors"
              :style="{ color: 'var(--theme-accent)' }"
            >
              {{ showDonateQR ? store.t('DONATE_HIDE') : store.t('DONATE_SHOW') }}
            </button>
          </div>
        </div>
      </div>
    </main>


  <!-- Donate QR Code Modal -->
  <Teleport to="body">
    <Transition name="fade-slide">
      <div
        v-if="showDonateQR"
        class="fixed inset-0 z-[999] flex items-center justify-center"
        :style="{ backgroundColor: 'var(--theme-bg-overlay)' }"
        @click.self="showDonateQR = false"
      >
        <div 
          class="d2-card p-5 rounded-xl max-w-[280px] animate-scale-in"
          :style="{ 
            borderColor: 'var(--theme-border-accent)',
            boxShadow: '0 0 40px var(--theme-accent-glow)'
          }"
        >
          <!-- Header -->
          <h3 
            class="text-center text-sm font-bold uppercase tracking-wider mb-4"
            :style="{ color: 'var(--theme-accent)' }"
          >
            {{ store.t('DONATE_THANKS') }}
          </h3>

          <!-- QR Code Display -->
          <div class="flex justify-center mb-4">
            <img
              v-if="currentPayment === 'wechat'"
              src="/src/assets/vx.jpg"
              alt="WeChat QR Code"
              class="w-48 h-48 rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
              :style="{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }"
              @click="handleQRClose()"
            />
            <img
              v-else
              src="/src/assets/zfb.png"
              alt="Alipay QR Code"
              class="w-48 h-48 rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
              :style="{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }"
              @click="handleQRClose()"
            />
          </div>

          <!-- Payment Toggle -->
          <div class="flex gap-2 justify-center mb-4">
            <button
              @click="currentPayment = 'wechat'"
              class="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              :class="currentPayment === 'wechat' ? 'shadow-lg' : 'opacity-60 hover:opacity-100'"
              :style="currentPayment === 'wechat' ? {
                backgroundColor: '#22c55e',
                color: 'white',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
              } : {
                backgroundColor: 'var(--theme-bg-card)'
              }"
            >
              微信
            </button>
            <button
              @click="currentPayment = 'alipay'"
              class="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              :class="currentPayment === 'alipay' ? 'shadow-lg' : 'opacity-60 hover:opacity-100'"
              :style="currentPayment === 'alipay' ? {
                backgroundColor: '#3b82f6',
                color: 'white',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
              } : {
                backgroundColor: 'var(--theme-bg-card)'
              }"
            >
              支付宝
            </button>
          </div>

          <!-- Close hint -->
          <p class="text-center text-[0.6rem] opacity-40">
            {{ store.t('DONATE_CLOSE_TIP') }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Thank You Toast -->
  <Teleport to="body">
    <Transition name="fade-slide">
      <div
        v-if="showThankYou"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-[1000]"
      >
        <div 
          class="px-6 py-3 rounded-lg text-sm font-bold shadow-lg"
          :style="{
            backgroundColor: 'var(--theme-success)',
            color: 'white',
            boxShadow: '0 4px 20px var(--theme-success-glow)'
          }"
        >
          感谢支持！
        </div>
      </div>
    </Transition>
  </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRunStore } from '@/stores/runStore';
import { invoke } from '@tauri-apps/api/core';

const store = useRunStore();
const showDonateQR = ref(false);
const currentPayment = ref<'wechat' | 'alipay'>('wechat');
const showThankYou = ref(false);

/**
 * Toggle donation QR code modal visibility
 * Shows a thank you message when opening
 */
function toggleDonateQR() {
  if (!showDonateQR.value) {
    // Show thank you toast when opening
    showThankYou.value = true;
    setTimeout(() => {
      showThankYou.value = false;
    }, 1500);
  }
  showDonateQR.value = !showDonateQR.value;
}

/**
 * Handle QR code click to close - hidden easter egg to unlock premium theme
 */
function handleQRClose() {
  showDonateQR.value = false;
  
  // Easter egg: unlock premium theme when closing QR code
  if (!store.premiumUnlocked) {
    store.unlockPremium();
  }
}

/**
 * Open GitHub repository in browser
 */
function openGitHub() {
  invoke('open_github').catch(() => {
    window.open('https://github.com/gjy991229/d2run', '_blank');
  });
}
</script>
