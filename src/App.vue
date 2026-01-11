<!-- App.vue - Main Vue Component -->
<template>
  <div class="flex h-screen bg-gray-50">
    <TaskSidebar
      :tasks="tasks"
      :is-refreshing="isRefreshing"
      :is-open="isSidebarOpen"
      @refresh="fetchTasks"
      @close="isSidebarOpen = false"
    />
    <ChatInterface
      :messages="messages"
      :loading="loading"
      :error="error"
      @send-message="sendMessage"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TaskSidebar from "./components/TaskSidebar.vue";
import ChatInterface from "./components/ChatInterface.vue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const messages = ref([]);
const loading = ref(false);
const tasks = ref([]);
const error = ref("");
const isRefreshing = ref(false);
const isSidebarOpen = ref(false);

const fetchTasks = async () => {
  isRefreshing.value = true;
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (response.ok) {
      const data = await response.json();
      tasks.value = data || [];
    }
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  } finally {
    isRefreshing.value = false;
  }
};

const sendMessage = async (userMessage) => {
  loading.value = true;
  error.value = "";

  // Add user message to UI
  messages.value.push({
    role: "user",
    content: userMessage,
    timestamp: new Date(),
  });

  try {
    const response = await fetch(`${API_URL}/agent/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Agent response:", data);

    // Add agent response to UI
    messages.value.push({
      role: "assistant",
      content: data.response,
      timestamp: new Date(),
    });

    // Update tasks
    tasks.value = data.tasks || [];
  } catch (err) {
    error.value = err.message;
    messages.value.push({
      role: "error",
      content: `Error: ${err.message}`,
      timestamp: new Date(),
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
