<template>
  <div class="flex-1 flex flex-col">
    <!-- Header -->
    <div class="bg-white border-b px-6 py-4 flex items-center gap-3">
      <button
        @click="$emit('toggle-sidebar')"
        class="md:hidden p-1 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <Menu class="w-6 h-6" />
      </button>
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-6 py-4">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-12">
        <CheckCircle2 class="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 class="text-xl font-semibold mb-2">Start Managing Tasks</h2>
        <p class="mb-4">Try these commands:</p>
        <div class="space-y-2">
          <div
            v-for="(example, idx) in exampleCommands"
            :key="idx"
            @click="input = example"
            class="bg-white px-4 py-2 rounded-lg border text-sm inline-block cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {{ example }}
          </div>
        </div>
      </div>

      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['mb-4', msg.role === 'user' ? 'text-right' : 'text-left']"
      >
        <div
          :class="[
            'inline-block max-w-2xl px-4 py-2 rounded-lg',
            msg.role === 'user'
              ? 'bg-blue-600 text-white'
              : msg.role === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-white border text-gray-900',
          ]"
        >
          <p class="whitespace-pre-wrap">{{ msg.content }}</p>
          <p
            :class="[
              'text-xs mt-1',
              msg.role === 'user' ? 'text-blue-200' : 'text-gray-400',
            ]"
          >
            {{ formatTime(msg.timestamp) }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="text-left mb-4">
        <div class="inline-block bg-white border px-4 py-2 rounded-lg">
          <div class="flex items-center gap-2">
            <Loader2 class="w-5 h-5 animate-spin text-blue-600" />
            <span class="text-sm text-gray-600">Agent is thinking...</span>
          </div>
        </div>
      </div>

      <div
        v-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
      >
        <div class="flex items-center gap-2">
          <AlertCircle class="w-5 h-5 text-red-600" />
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="border-t bg-white px-6 py-4">
      <div class="flex gap-2">
        <input
          v-model="input"
          @keypress.enter="handleSend"
          type="text"
          placeholder="Tell me what you need to do..."
          class="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="loading"
        />
        <button
          @click="handleSend"
          :disabled="loading || !input.trim()"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Menu,
} from "lucide-vue-next";

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["send-message", "toggle-sidebar"]);

const input = ref("");
const messagesContainer = ref(null);

const title = import.meta.env.VITE_APP_TITLE || "AI Task Manager";

const exampleCommands = [
  "Add a high priority task to deploy the API by Friday",
  "Show me all my pending tasks",
  "Mark task 1 as complete",
  "Search for tasks about deployment",
];

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const handleSend = () => {
  if (!input.value.trim() || props.loading) return;
  emit("send-message", input.value);
  input.value = "";
};

watch(
  () => props.messages.length,
  () => {
    scrollToBottom();
  }
);
</script>
