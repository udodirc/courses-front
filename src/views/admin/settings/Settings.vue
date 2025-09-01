<script setup lang="ts">
import { onMounted } from "vue";
import { useFetchList } from "../../../composables/useFetchList.ts";

interface Setting {
  id: number;
  name: string;
  key: string;
  value: string;
}

const {
  items: settings,
  fetchItems: fetchSettings,
  updateItem,
  loading,
} = useFetchList<Setting>("/admin/settings");

const saveSetting = async (setting: Setting) => {
  await updateItem(setting.id, {
    name: setting.name,
    key: setting.key,
    value: setting.value,
  });
};

onMounted(fetchSettings);
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">Настройки</h2>

    <div v-if="loading">Загрузка...</div>

    <div v-else class="space-y-4">
      <div
          v-for="setting in settings"
          :key="setting.id"
          class="flex items-center space-x-4"
      >
        <label class="w-48 font-medium">{{ setting.name }}</label>
        <input
            v-model="setting.value"
            type="text"
            class="border rounded p-2 flex-1"
        />
        <button
            @click="saveSetting(setting)"
            class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            :disabled="loading"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>