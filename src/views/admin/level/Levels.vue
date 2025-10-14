<script setup lang="ts">
import { onMounted } from "vue";
import { useFetchList } from "../../../composables/useFetchList.ts";
import api from "../../../api";

interface Level {
  id?: number;
  level: number;
  percentage: number;
  createdAt?: string;
}

const {
  items: levels,
  fetchItems: fetchLevels,
  loading,
} = useFetchList<Level>("/admin/levels");

// Добавить новый уровень
const addLevel = () => {
  const maxLevel = levels.value.length
      ? Math.max(...levels.value.map((l) => l.level))
      : 0;
  levels.value.push({
    level: maxLevel + 1,
    percentage: 0,
  });
};

// Удалить уровень (с API)
const removeLevel = async (level: Level, index: number) => {
  if (!confirm(`Удалить уровень №${level.level}?`)) return;

  // если уровень уже сохранён в БД (есть id)
  if (level.id) {
    try {
      await api.delete(`/admin/levels/${level.id}`);
      levels.value.splice(index, 1);
      alert(`Уровень №${level.level} удалён`);
    } catch (e: any) {
      console.error(e);
      alert("Ошибка при удалении уровня");
    }
  } else {
    // просто удалить из списка (ещё не сохранён)
    levels.value.splice(index, 1);
  }
};

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
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">Настройки уровней</h2>
      <button
          @click="addLevel"
          class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        + Добавить уровень
      </button>
    </div>

    <div v-if="loading">Загрузка...</div>

    <div v-else class="space-y-4">
      <div
          v-for="(level, index) in levels"
          :key="index"
          class="flex items-center space-x-4"
      >
        <label class="w-48 font-medium">Уровень №{{ level.level }}</label>
        <input
            v-model.number="level.percentage"
            type="number"
            class="border rounded p-2 flex-1"
        />
        <button
            @click="removeLevel(level, index)"
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Удалить
        </button>
      </div>

      <button
          @click="saveAllLevels"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          :disabled="loading"
      >
        Сохранить все уровни
      </button>
    </div>
  </div>
</template>