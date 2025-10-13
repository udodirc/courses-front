<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetchList } from "../../../composables/useFetchList.ts";
import api from "../../../api"; // если есть общий axios instance

interface Level {
  id: number;
  level: number;
  percentage: number;
  createdAt: string;
}

const {
  items: levels,
  fetchItems: fetchLevels,
  loading,
} = useFetchList<Level>("/admin/levels");

// Собираем данные в формат для бэка и отправляем
const saveAllLevels = async () => {
  const payload = {
    levels: levels.value.map((l) => ({ [l.level]: l.percentage })),
  };

  try {
    await api.post("/admin/levels/percentage", payload);
    alert("Уровни успешно сохранены!");
  } catch (e: any) {
    console.error(e);
    alert("Ошибка при сохранении уровней");
  }
};

onMounted(fetchLevels);
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Настройки уровней</h2>

    <div v-if="loading">Загрузка...</div>

    <div v-else class="space-y-4">
      <div
          v-for="level in levels"
          :key="level.id"
          class="flex items-center space-x-4"
      >
        <label class="w-48 font-medium">Уровень №{{ level.level }}</label>
        <input
            v-model.number="level.percentage"
            type="number"
            class="border rounded p-2 flex-1"
        />
      </div>

      <button
          @click="saveAllLevels"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          :disabled="loading"
      >
        💾 Сохранить все уровни
      </button>
    </div>
  </div>
</template>