<template>
  <div
    v-if="isOpen"
    @click="$emit('close')"
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
  ></div>

  <div
    :class="[
      'w-80 bg-white border-r flex flex-col transition-transform duration-300 ease-in-out',
      'fixed inset-y-0 left-0 z-50 md:relative md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="p-4 border-b flex justify-between items-center">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Your Tasks</h2>
        <p class="text-sm text-gray-500">{{ pendingTasksCount }} pending</p>
      </div>
      <div class="flex items-center gap-1">
        <button
          @click="$emit('refresh')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh tasks"
        >
          <RefreshCw
            :class="['w-4 h-4 text-gray-600', { 'animate-spin': isRefreshing }]"
          />
        </button>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
        >
          <X class="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <div v-if="tasks.length === 0" class="text-center text-gray-400 mt-8">
        <Circle class="w-12 h-12 mx-auto mb-2" />
        <p class="text-sm">No tasks yet</p>
        <p class="text-xs">Ask the agent to create one!</p>
      </div>

      <div
        v-for="task in tasks"
        :key="task.id"
        :class="[
          'p-3 rounded-lg border',
          task.completed ? 'bg-gray-50 opacity-60' : 'bg-white',
        ]"
      >
        <div class="flex items-start gap-2">
          <CheckCircle2
            v-if="task.completed"
            class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
          />
          <Circle v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'font-medium',
                task.completed ? 'line-through text-gray-500' : 'text-gray-900',
              ]"
            >
              {{ task.title }}
            </p>
            <p v-if="task.description" class="text-sm text-gray-600 mt-1">
              {{ task.description }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <span
                :class="[
                  'text-xs px-2 py-0.5 rounded',
                  getPriorityColor(task.priority),
                ]"
              >
                {{ task.priority }}
              </span>
              <span v-if="task.due_date" class="text-xs text-gray-500">
                Due: {{ task.due_date }}
              </span>
              <span class="text-xs text-gray-400"> #{{ task.id }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t bg-gray-50">
      <p class="text-xs text-center text-gray-500">created by Vinay B</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RefreshCw, Circle, CheckCircle2, X } from "lucide-vue-next";

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["refresh", "close"]);

const pendingTasksCount = computed(() => {
  return props.tasks.filter((t) => !t.completed).length;
});

const getPriorityColor = (priority) => {
  const colors = {
    high: "text-red-600 bg-red-50",
    medium: "text-yellow-600 bg-yellow-50",
    low: "text-green-600 bg-green-50",
  };
  return colors[priority] || "text-gray-600 bg-gray-50";
};
</script>
