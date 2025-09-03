<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useFetchList } from "../composables/useFetchList";

const route = useRoute();
const expanded = ref<string | null>(null);

const toggleExpand = (name: string) => {
  expanded.value = expanded.value === name ? null : name;
};

// Загружаем меню из API
const { items: menus, fetchItems: fetchMenus, loading } = useFetchList<{
  id: number;
  name: string;
  url: string;
  children?: { id: number; name: string; url: string }[];
}>("/menu/tree");

// Приводим данные к формату для RouterLink (если url пустой → "#")
const normalizeUrl = (url?: string) => (url && url !== "" ? `/${url}` : "#");

// Загружаем меню при монтировании
onMounted(async () => {
  try {
    await fetchMenus();
  } catch (e) {
    console.error("Ошибка загрузки меню", e);
  }
});
</script>

<template>
  <header class="bg-white text-black py-4 px-6 flex justify-center items-center">
    <div class="flex items-center space-x-5">
      <nav>
        <ul v-if="menus?.length" class="flex space-x-6">
          <li v-for="item in menus || []" :key="item.id" class="relative">
            <!-- Если пункт без children -->
            <RouterLink
                v-if="!item.children || item.children.length === 0"
                :to="normalizeUrl(item.url)"
                class="hover:text-gray-600 transition-colors duration-200"
                :class="{ 'font-semibold': route.path === normalizeUrl(item.url) }"
            >
              {{ item.name }}
            </RouterLink>

            <!-- Если есть children -->
            <div v-else class="group">
              <button
                  @click="toggleExpand(item.name)"
                  class="hover:text-gray-600 transition-colors duration-200 flex items-center"
              >
                {{ item.name }}
                <span class="ml-1">{{ expanded === item.name ? "▲" : "▼" }}</span>
              </button>

              <ul
                  v-show="expanded === item.name"
                  class="absolute top-full mt-2 bg-white text-black py-2 w-48 shadow-lg rounded-md z-10"
              >
                <li v-for="sub in item.children || []" :key="sub.id">
                  <RouterLink
                      :to="normalizeUrl(sub.url)"
                      class="block px-4 py-2 hover:bg-gray-100"
                      :class="{ 'font-semibold': route.path === normalizeUrl(sub.url) }"
                  >
                    {{ sub.name }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <!-- Заглушка, пока меню грузится -->
        <div v-else-if="loading" class="text-gray-500">Загрузка меню...</div>
        <div v-else class="text-gray-500">Меню не найдено</div>
      </nav>

      <RouterLink
          to="/contacts"
          class="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
      >
        Связаться
      </RouterLink>
    </div>
  </header>

  <main class="bg-gray-100 py-12 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl font-bold text-black mb-4">Заголовок вашего сайта</h1>
      <p class="text-lg text-gray-700 leading-relaxed mb-8">
        Краткое, но ёмкое описание вашей деятельности.
      </p>
    </div>
  </main>

  <footer class="bg-black text-white py-4 px-6 text-center">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-center space-x-4 mb-2">
        <a href="#" class="text-white hover:text-gray-400">Социальная сеть 1</a>
        <a href="#" class="text-white hover:text-gray-400">Социальная сеть 2</a>
      </div>
      <p class="text-sm text-gray-400">
        &copy; 2024 Ваша компания. Все права защищены.
      </p>
    </div>
  </footer>
</template>