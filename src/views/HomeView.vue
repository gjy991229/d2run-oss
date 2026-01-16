<template>
  <div class="h-full w-full flex flex-col items-center justify-center relative px-4 overflow-y-auto">
    
    <!-- Ambient glow effect -->
    <div 
      class="absolute inset-0 pointer-events-none opacity-30"
      :style="{
        background: `radial-gradient(ellipse at 50% 30%, var(--theme-accent-glow) 0%, transparent 60%)`
      }"
    ></div>

    <!-- Logo Section -->
    <div class="relative mb-6 text-center select-none group">
      <!-- Logo glow -->
      <div 
        class="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        :style="{ background: 'var(--theme-accent-glow)' }"
      ></div>
      
      <!-- Main title -->
      <h1 
        class="relative text-3xl font-bold tracking-[0.15em] uppercase d2-title"
        style="font-family: var(--font-serif);"
      >
        D2Run
      </h1>
      
      <!-- Subtitle -->
      <p 
        class="relative text-[0.5rem] uppercase tracking-[0.3em] mt-0.5 opacity-50"
        :style="{ color: 'var(--theme-accent)' }"
      >
        – Online –
      </p>
    </div>

    <!-- User Profile Capsule -->
    <button
      @click="store.goSettings()"
      class="mb-8 group flex items-center gap-2.5 px-4 py-2 rounded-full d2-glass cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      :class="store.cloudState.isLoggedIn ? 'border-emerald-500/20' : ''"
    >
      <!-- Logged in state -->
      <template v-if="store.cloudState.isLoggedIn && store.cloudState.userInfo">
        <div class="relative">
          <div class="w-6 h-6 rounded-full overflow-hidden border-2" :style="{ borderColor: 'var(--theme-accent)' }">
            <img
              v-if="store.cloudState.userInfo.avatarUrl"
              :src="store.cloudState.userInfo.avatarUrl"
              class="w-full h-full object-cover"
              alt="avatar"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-amber-900/50 to-amber-700/30"></div>
          </div>
          <!-- Online indicator -->
          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black" :style="{ backgroundColor: 'var(--theme-success)' }"></span>
        </div>
        <span class="text-sm font-medium max-w-[7rem] truncate" :style="{ color: 'var(--theme-text)' }">
          {{ store.cloudState.userInfo.nickName }}
        </span>
      </template>
      
      <!-- Guest state -->
      <template v-else>
        <div class="w-6 h-6 rounded-full flex items-center justify-center" :style="{ backgroundColor: 'var(--theme-bg-card)' }">
          <span class="text-xs opacity-50">?</span>
        </div>
        <span class="text-sm opacity-50 group-hover:opacity-80 transition-opacity">
          {{ store.t('CLICK_LOGIN') || '点击登录' }}
        </span>
      </template>
      
      <!-- Arrow indicator -->
      <span class="text-xs opacity-30 group-hover:opacity-60 transition-opacity ml-1">›</span>
    </button>

    <!-- Navigation Menu -->
    <nav class="w-full max-w-[10rem] space-y-2">
      <!-- Primary: Start -->
      <button
        @click="store.goSelection()"
        class="w-full d2-btn-primary py-3 text-sm font-bold tracking-widest uppercase"
      >
        {{ store.t('START') }}
      </button>

      <!-- Secondary buttons -->
      <button
        @click="store.goHistory()"
        class="w-full d2-btn-ghost py-2 text-sm tracking-wide"
      >
        {{ store.t('LOGS') }}
      </button>

      <button
        @click="store.goSettings()"
        class="w-full d2-btn-ghost py-2 text-sm tracking-wide"
      >
        {{ store.t('SETTINGS') }}
      </button>

      <button
        @click="store.goAbout()"
        class="w-full d2-btn-ghost py-2 text-sm tracking-wide"
      >
        {{ store.t('ABOUT') }}
      </button>

      <!-- Divider -->
      <div class="d2-divider my-3"></div>

      <!-- Exit button -->
      <button
        @click="quitApp"
        class="w-full d2-btn-ghost py-2 text-sm tracking-wide opacity-50 hover:opacity-100"
        :style="{ color: 'var(--theme-danger)' }"
      >
        {{ store.t('EXIT') }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRunStore } from '@/stores/runStore';
import { invoke } from '@tauri-apps/api/core';

const store = useRunStore();

/**
 * Quit the application
 */
const quitApp = () => {
  invoke('quit_app');
};
</script>
