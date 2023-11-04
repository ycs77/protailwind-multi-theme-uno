<template>
  <div :data-theme="activeTheme">
    <div class="mx-auto mt-20 max-w-4xl px-8">
      <h1 class="text-2xl font-bold">Multi-theme Tailwind CSS plugin</h1>

      <div class="mt-8 space-x-4">
        <button
          v-for="theme in themesList"
          :key="theme"
          @click="activeTheme = theme"
          :data-theme="theme"
          className="rounded bg-multi-base hover:bg-opacity-75 px-5 py-2 text-multi-base font-semibold shadow transition-colors duration-75"
        >
          {{ theme }}
        </button>
      </div>

      <div class="mt-6 text-lg text-gray-500">
        Current theme: <b class="text-multi-base">{{ activeTheme }}</b>
      </div>

      <div class="mt-8 grid grid-cols-2 gap-4">
        <div class="bg-multi-base rounded-xl p-8 shadow-xl transition duration-200 theme-forest:scale-[1.1]">
          <p class="text-multi-base transition-colors duration-200">
            <strong>Base</strong> text and background colors.
          </p>
        </div>
        <div class="bg-multi-inverted rounded-xl p-8 shadow-xl transition duration-200 theme-aqua:rotate-[10deg]">
          <p class="text-multi-inverted transition-colors duration-200">
            <strong>Inverted</strong> text and background colors.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTheme = ref('default')
const themesList = ['default', 'swiss', 'forest', 'aqua']
</script>
