<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useFetchList } from "../composables/useFetchList";
import api from "../api";
import ContactModal from "../components/ContactModal.vue";

const route = useRoute();
const expanded = ref<string | null>(null);
const showModal = ref(false);
const staticContent = ref<Record<string, string>>({});
const loadingStatic = ref(false);
const staticContentError = ref<string | null>(null);

// Открыть/закрыть подменю
const toggleExpand = (name: string) => {
  expanded.value = expanded.value === name ? null : name;
};

// Закрытие подменю при клике вне
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".menu-item")) {
    expanded.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

// Меню с API
const { items: menus, fetchItems: fetchMenus, loading } = useFetchList<{
  id: number;
  name: string;
  url: string;
  children?: { id: number; name: string; url: string }[];
}>("/menu/tree");

// Нормализация url
const normalizeUrl = (url?: string) => (url && url !== "" ? `/${url}` : "#");

// Статический контент
const fetchStaticContent = async () => {
  loadingStatic.value = true;
  staticContentError.value = null;
  try {
    const response = await api.post("/static_content", {
      names: [
        { name: "main" },
        { name: "social_networks" },
        { name: "rights" },
        { name: "messenger_icons" }
      ]
    });
    staticContent.value = response.data.data.reduce(
        (acc: Record<string, string>, item: { name: string; content: string }) => {
          acc[item.name] = item.content;
          return acc;
        },
        {}
    );
  } catch (e) {
    staticContentError.value = "Не удалось загрузить контент. Попробуйте позже.";
  } finally {
    loadingStatic.value = false;
  }
};

// Подсветка активного маршрута
const isActive = (url?: string) => route.path === normalizeUrl(url);
const isChildActive = (children?: { url: string }[]) =>
    children?.some((sub) => route.path === normalizeUrl(sub.url));

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
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <div class="container mx-auto flex items-center justify-between px-6 py-4">
        <!-- Левый блок: логотип или пустое место -->
        <div class="flex-shrink-0 w-32 flex items-center justify-start">
          <!-- Можно вставить логотип сюда, сейчас пусто -->
        </div>

        <!-- Меню -->
        <nav class="flex-1 flex justify-center">
          <ul class="flex space-x-4 items-center">
            <!-- Статическая Главная -->
            <li class="relative menu-item flex items-center">
              <RouterLink
                  to="/"
                  class="px-3 py-2 rounded-md transition-colors duration-200 flex items-center"
                  :class="{
                    'bg-gray-200 text-black font-semibold': isActive('/'),
                    'hover:bg-gray-100': !isActive('/')
                  }"
              >
                Главная
              </RouterLink>
            </li>

            <!-- Динамическое меню -->
            <li v-for="item in menus || []" :key="item.id" class="relative menu-item">
              <!-- Если нет дочерних -->
              <RouterLink
                  v-if="!item.children || item.children.length === 0"
                  :to="normalizeUrl(item.url)"
                  class="px-3 py-2 rounded-md transition-colors duration-200 flex items-center"
                  :class="{
                  'bg-gray-200 text-black font-semibold': isActive(item.url),
                  'hover:bg-gray-100': !isActive(item.url)
                }"
              >
                {{ item.name }}
              </RouterLink>

              <!-- С дочерними -->
              <div v-else class="relative">
                <button
                    @click.stop="toggleExpand(item.name)"
                    class="px-3 py-2 rounded-md transition-colors duration-200 flex items-center"
                    :class="{
                    'bg-gray-200 text-black font-semibold': isChildActive(item.children),
                    'hover:bg-gray-100': !isChildActive(item.children)
                  }"
                >
                  {{ item.name }}
                </button>

                <ul
                    v-show="expanded === item.name"
                    class="absolute top-full mt-2 bg-white shadow-lg rounded-md w-48 z-20"
                >
                  <li v-for="sub in item.children || []" :key="sub.id">
                    <RouterLink
                        :to="normalizeUrl(sub.url)"
                        class="block px-4 py-2 rounded-md transition-colors duration-200"
                        :class="{
                        'bg-gray-200 text-black font-semibold': isActive(sub.url),
                        'hover:bg-gray-100': !isActive(sub.url)
                      }"
                    >
                      {{ sub.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Правый блок: кнопки и иконки -->
        <div class="flex items-center space-x-4">
          <button
              @click="openModal"
              class="bg-black text-white px-5 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Связаться
          </button>

          <!-- Messenger Icons -->
          <div v-if="staticContent.messenger_icons" v-html="staticContent.messenger_icons"></div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
      <div
          v-if="staticContentError"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
      >
        {{ staticContentError }}
      </div>

      <div v-if="route.path === '/' && staticContent.main" v-html="staticContent.main" class="prose"></div>

      <RouterView v-else />
    </main>

    <!-- Footer -->
    <footer class="bg-black text-white py-6 px-6 text-center mt-auto">
      <div class="max-w-4xl mx-auto space-y-2">
        <div v-if="staticContent.social_networks" v-html="staticContent.social_networks"></div>
        <div v-if="staticContent.rights" v-html="staticContent.rights"></div>
      </div>
    </footer>

    <!-- Contact Modal -->
    <ContactModal v-if="showModal" @close="closeModal" />
  </div>
</template>

<style scoped>
.prose {
  line-height: 1.7;
  font-size: 1rem;
  color: #333;
}
</style>