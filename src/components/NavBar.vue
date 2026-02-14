<template>
  <nav
    class="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 supports-[backdrop-filter]:bg-white/60"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20"
          >
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <div class="hidden sm:block">
            <h1 class="text-lg font-bold text-gray-900 leading-tight">
              AI Task Manager
            </h1>
            <p class="text-xs text-gray-500 font-medium">
              Welcome back, {{ user?.name?.split(" ")[0] }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="hidden md:flex items-center gap-3 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full"
          >
            <div class="flex items-center gap-1">
              <span class="relative flex h-2 w-2 mr-1">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
                ></span>
              </span>
              <span class="text-xs font-semibold text-gray-700"
                >{{ pendingTasksCount }} Pending</span
              >
            </div>
            <div class="w-px h-3 bg-gray-300"></div>
            <div class="flex items-center gap-1.5">
              <CheckCircle class="w-3.5 h-3.5 text-gray-400" />
              <span class="text-xs font-medium text-gray-500"
                >{{ completedTasksCount }} Done</span
              >
            </div>
          </div>

          <div class="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>

          <button
            @click="$emit('refresh')"
            :class="[
              'p-2 rounded-xl transition-all duration-200 border border-transparent',
              isRefreshing
                ? 'bg-purple-50 text-purple-600 border-purple-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200',
            ]"
            title="Refresh tasks"
          >
            <RefreshCw
              :class="[
                'w-5 h-5 text-gray-600',
                { 'animate-spin': isRefreshing },
              ]"
            />
          </button>

          <button
            @click="$emit('logout')"
            class="p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-transparent transition-all duration-200"
            title="Sign out"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Sparkles, CheckCircle, RefreshCw, LogOut } from "lucide-vue-next";

defineProps({
  user: Object,
  pendingTasksCount: Number,
  completedTasksCount: Number,
  isRefreshing: Boolean,
});

defineEmits(["refresh", "logout"]);
</script>
