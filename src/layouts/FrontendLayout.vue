<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useFetchList } from "../composables/useFetchList";
import api from "../api";

const route = useRoute();
const expanded = ref<string | null>(null);
const staticContent = ref<Record<string, string>>({});
const loadingStatic = ref(false);

const toggleExpand = (name: string) => {
  expanded.value = expanded.value === name ? null : name;
};

// меню
const { items: menus, fetchItems: fetchMenus, loading } = useFetchList<{
  id: number;
  name: string;
  url: string;
  children?: { id: number; name: string; url: string }[];
}>("/menu/tree");

const normalizeUrl = (url?: string) => (url && url !== "" ? `/${url}` : "#");

// загрузка статичного контента
const fetchStaticContent = async () => {
  loadingStatic.value = true;
  try {
    const response = await api.post("/static_content", {
      names: [{ name: "main" }, { name: "social_networks" }, { name: "rights" }],
    });

    // нормализуем массив в объект { name: content }
    staticContent.value = response.data.data.reduce(
        (acc: Record<string, string>, item: { name: string; content: string }) => {
          acc[item.name] = item.content;
          return acc;
        },
        {}
    );
  } catch (e) {
    console.error("Ошибка загрузки статического контента", e);
  } finally {
    loadingStatic.value = false;
  }
};

onMounted(async () => {
  try {
    await fetchMenus();
    await fetchStaticContent();
  } catch (e) {
    console.error("Ошибка загрузки", e);
  }
});
</script>

<template>
  <header class="bg-white text-black py-4 px-6 flex justify-center items-center">
    <div class="flex items-center space-x-5">
      <nav>
        <ul v-if="menus?.length" class="flex space-x-6">
          <li v-for="item in menus || []" :key="item.id" class="relative">
            <RouterLink
                v-if="!item.children || item.children.length === 0"
                :to="normalizeUrl(item.url)"
                class="hover:text-gray-600 transition-colors duration-200"
                :class="{ 'font-semibold': route.path === normalizeUrl(item.url) }"
            >
              {{ item.name }}
            </RouterLink>

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
    <!-- если главная -->
    <div
        v-if="route.path === '/' && staticContent.main"
        v-html="staticContent.main"
        class="prose"
    ></div>

    <!-- если не главная -->
    <RouterView v-else />
  </main>

  <footer class="bg-black text-white py-4 px-6 text-center">
    <div class="max-w-4xl mx-auto">
      <!-- соцсети -->
      <div v-if="staticContent.social_networks" v-html="staticContent.social_networks"></div>

      <!-- права -->
      <div v-if="staticContent.rights" v-html="staticContent.rights"></div>
    </div>
  </footer>
</template>

<style scoped>
.prose {
  line-height: 1.7;
  font-size: 1rem;
  color: #333;
}
</style>