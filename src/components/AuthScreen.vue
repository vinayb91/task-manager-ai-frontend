<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles class="w-8 h-8 text-white" />
        </div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2"
        >
          AI Task Manager
        </h1>
        <p class="text-gray-600">Manage your tasks with AI assistance</p>
      </div>

      <div
        class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8"
      >
        <div class="flex gap-2 mb-6">
          <button
            @click="authMode = 'login'"
            :class="[
              'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              authMode === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            Login
          </button>
          <button
            @click="authMode = 'register'"
            :class="[
              'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              authMode === 'register'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            Register
          </button>
        </div>

        <div class="space-y-4">
          <div v-if="authMode === 'register'">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Name</label
            >
            <input
              v-model="authForm.name"
              type="text"
              placeholder="John Doe"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Email</label
            >
            <input
              v-model="authForm.email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Password</label
            >
            <input
              v-model="authForm.password"
              type="password"
              placeholder="••••••••"
              @keypress.enter="handleAuth"
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="min-h-6 flex items-center justify-center">
            <p v-if="authError" class="text-sm text-red-600">{{ authError }}</p>
          </div>

          <button
            @click="handleAuth"
            :disabled="authLoading"
            class="w-full h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center"
          >
            <span v-if="!authLoading">{{
              authMode === "login" ? "Login" : "Create Account"
            }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <Loader2 class="w-5 h-5 animate-spin" />
              Processing...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Sparkles, Loader2 } from "lucide-vue-next";

const props = defineProps({
  apiUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["authenticated"]);

const authMode = ref("login");
const authForm = ref({
  name: "",
  email: "",
  password: "",
});
const authError = ref("");
const authLoading = ref(false);

watch(authMode, () => {
  authError.value = "";
});

const handleAuth = async () => {
  authLoading.value = true;

  try {
    const endpoint =
      authMode.value === "login" ? "/auth/login" : "/auth/register";
    const body =
      authMode.value === "login"
        ? { email: authForm.value.email, password: authForm.value.password }
        : authForm.value;

    const response = await fetch(`${props.apiUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Authentication failed");
    }

    const data = await response.json();
    emit("authenticated", data);
  } catch (err) {
    authError.value = err.message;
  } finally {
    authLoading.value = false;
  }
};
</script>
