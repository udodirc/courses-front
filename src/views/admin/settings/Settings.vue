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

// определяем, является ли значение булевым
const isBooleanValue = (value: string) => {
  return value === "true" || value === "false";
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

        <!-- если true/false — показываем переключатель -->
        <template v-if="isBooleanValue(setting.value)">
          <label class="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                class="sr-only peer"
                v-model="setting.value"
                true-value="true"
                false-value="false"
            />
            <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all"
            >
              <span
                  class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"
              ></span>
            </div>
          </label>
        </template>

        <!-- иначе обычный текстовый input -->
        <template v-else>
          <input
              v-model="setting.value"
              type="text"
              class="border rounded p-2 flex-1"
          />
        </template>

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