<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <AuthScreen
      v-if="!isAuthenticated"
      :api-url="API_URL"
      @authenticated="handleAuthenticated"
    />

    <div v-else>
      <NavBar
        :user="user"
        :pending-tasks-count="pendingTasksCount"
        :completed-tasks-count="completedTasksCount"
        :is-refreshing="isRefreshing"
        @refresh="fetchTasks"
        @logout="logout"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <ChatInterface
              :messages="messages"
              :loading="loading"
              :error="error"
              :user="user"
              @send-message="sendMessage"
            />
          </div>

          <div class="lg:col-span-1 space-y-6">
            <TaskList :tasks="tasks" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AuthScreen from "./components/AuthScreen.vue";
import NavBar from "./components/NavBar.vue";
import ChatInterface from "./components/ChatInterface.vue";
import TaskList from "./components/TaskList.vue";

const API_URL = "http://localhost:8080/api";

const isAuthenticated = ref(false);
const token = ref("");
const user = ref(null);

const messages = ref([]);
const loading = ref(false);
const tasks = ref([]);
const error = ref("");
const isRefreshing = ref(false);

const pendingTasksCount = computed(() => {
  return tasks.value.filter((t) => !t.completed).length;
});

const completedTasksCount = computed(() => {
  return tasks.value.filter((t) => t.completed).length;
});

onMounted(() => {
  const savedToken = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (savedToken && savedUser) {
    token.value = savedToken;
    user.value = JSON.parse(savedUser);
    isAuthenticated.value = true;
    fetchTasks();
  }
});

const handleAuthenticated = async (data) => {
  token.value = data.token;
  user.value = data.user;
  isAuthenticated.value = true;

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  await fetchTasks();
};

const logout = () => {
  token.value = "";
  user.value = null;
  isAuthenticated.value = false;
  tasks.value = [];
  messages.value = [];

  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const fetchTasks = async () => {
  isRefreshing.value = true;
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      tasks.value = data || [];
    } else if (response.status === 401) {
      logout();
    }
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  } finally {
    isRefreshing.value = false;
  }
};

const sendMessage = async (userMessage) => {
  if (loading.value) return;

  loading.value = true;
  error.value = "";

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
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        message: userMessage,
        current_date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    messages.value.push({
      role: "assistant",
      content: data.response,
      timestamp: new Date(),
    });

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
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

* {
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
