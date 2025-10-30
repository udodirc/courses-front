<!-- components/MainLayout.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useFetchList } from "../composables/useFetchList";
import { useStaticContent } from "../composables/useStaticContent";
import ContactModal from "../components/ContactModal.vue";
import PartnerLoginModal from "../components/PartnerLoginModal.vue";

const route = useRoute();

// === Состояния ===
const expanded = ref<string | null>(null);
const menuOpen = ref(false);

const showModal = ref(false);
const showLoginModal = ref(false);

const settings = ref<Record<string, string | boolean>>({});
const loadingSettings = ref(false);
const settingsError = ref<string | null>(null);
const isSendMessage = ref(false);

// --- Статический контент ---
const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

// --- Меню с API ---
const { items: menus, fetchItems: fetchMenus } = useFetchList<{
  id: number;
  name: string;
  url: string;
  children?: { id: number; name: string; url: string }[];
}>("/menu/tree");

const normalizeUrl = (url?: string) => (url && url !== "" ? `/${url}` : "#");

// --- Настройки ---
const fetchSettings = async () => {
  loadingSettings.value = true;
  settingsError.value = null;
  try {
    const response = await api.post("/settings", { keys: [{ key: "send_message" }] });

    settings.value = response.data.data.reduce(
        (acc: Record<string, string | boolean>, item: { key: string; value: string }) => {
          let value: string | boolean = item.value;
          if (item.value === "true") value = true;
          else if (item.value === "false") value = false;
          acc[item.key] = value;
          return acc;
        },
        {}
    );

    isSendMessage.value = Boolean(settings.value["send_message"]);
  } catch (e) {
    settingsError.value = "Не удалось загрузить настройки. Попробуйте позже.";
  } finally {
    loadingSettings.value = false;
  }
};

// --- Меню ---
const toggleExpand = (name: string) => {
  expanded.value = expanded.value === name ? null : name;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".menu-item") && !target.closest(".burger-button")) {
    expanded.value = null;
  }
};

// --- Модалки ---
const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

const openLoginModal = () => (showLoginModal.value = true);
const closeLoginModal = () => (showLoginModal.value = false);

// --- Подсветка активного маршрута ---
const isActive = (url?: string) => route.path === normalizeUrl(url);
const isChildActive = (children?: { url: string }[]) =>
    children?.some((sub) => route.path === normalizeUrl(sub.url));

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  await Promise.all([
    fetchMenus(),
    fetchStaticContent(["main", "messenger_icons", "rights"]),
    fetchSettings(),
  ]);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">

    <!-- Header -->
    <header class="bg-white shadow-md relative">
      <div class="container mx-auto flex items-center justify-between px-6 py-4">
        <!-- Мобильная версия -->
        <div class="flex items-center space-x-4 flex-grow justify-center md:hidden">
          <button
              v-if="isSendMessage && !loadingSettings"
              @click="openModal"
              class="bg-black text-white px-3 py-1 text-sm rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Связаться
          </button>

          <button
              @click="openLoginModal"
              class="text-sm font-semibold text-gray-800 hover:text-black transition-colors duration-200"
          >
            Вход
          </button>

          <div v-if="staticContent.messenger_icons" v-html="staticContent.messenger_icons"></div>
        </div>

        <!-- Бургер -->
        <button
            class="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none burger-button"
            @click="menuOpen = !menuOpen"
        >
          <span class="block h-0.5 bg-black rounded transition-transform duration-300" :class="{ 'rotate-45 translate-y-2': menuOpen }"></span>
          <span class="block h-0.5 bg-black rounded transition-opacity duration-300" :class="{ 'opacity-0': menuOpen }"></span>
          <span class="block h-0.5 bg-black rounded transition-transform duration-300" :class="{ '-rotate-45 -translate-y-2': menuOpen }"></span>
        </button>

        <!-- Меню -->
        <nav
            class="main-menu md:flex flex-1 justify-center absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none z-20"
            :class="{ hidden: !menuOpen, flex: menuOpen }"
        >
          <ul class="flex flex-col md:flex-row md:space-x-6 items-start md:items-center p-4 md:p-0">
            <li class="relative menu-item w-full md:w-auto">
              <RouterLink
                  to="/"
                  class="block px-4 py-2 rounded-md transition-colors duration-200"
                  :class="{ 'bg-gray-200 text-black font-semibold': isActive('/'), 'hover:bg-gray-100': !isActive('/') }"
              >
                Главная
              </RouterLink>
            </li>

            <li
                v-for="item in menus || []"
                :key="item.id"
                class="relative menu-item w-full md:w-auto"
            >
              <RouterLink
                  v-if="!item.children?.length"
                  :to="normalizeUrl(item.url)"
                  class="block px-4 py-2 rounded-md transition-colors duration-200"
                  :class="{ 'bg-gray-200 text-black font-semibold': isActive(item.url), 'hover:bg-gray-100': !isActive(item.url) }"
              >
                {{ item.name }}
              </RouterLink>

              <div v-else class="relative w-full md:w-auto">
                <button
                    @click.stop="toggleExpand(item.name)"
                    class="block w-full px-4 py-2 rounded-md transition-colors duration-200 text-left md:text-center"
                    :class="{ 'bg-gray-200 text-black font-semibold': isChildActive(item.children), 'hover:bg-gray-100': !isChildActive(item.children) }"
                >
                  {{ item.name }}
                </button>

                <ul
                    v-show="expanded === item.name"
                    class="md:absolute md:top-full mt-2 bg-white shadow-lg rounded-md w-full md:w-48 z-20 child-menu"
                >
                  <li v-for="sub in item.children || []" :key="sub.id">
                    <RouterLink
                        :to="normalizeUrl(sub.url)"
                        class="block px-4 py-2 rounded-md transition-colors duration-200"
                        :class="{ 'bg-gray-200 text-black font-semibold': isActive(sub.url), 'hover:bg-gray-100': !isActive(sub.url) }"
                    >
                      {{ sub.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Десктоп -->
        <div class="hidden md:flex items-center space-x-4">
          <button
              v-if="isSendMessage && !loadingSettings"
              @click="openModal"
              class="bg-black text-white px-5 py-2 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Связаться
          </button>

          <button
              @click="openLoginModal"
              class="text-sm font-semibold text-gray-800 hover:text-black transition-colors duration-200"
          >
            Вход
          </button>

          <div v-if="staticContent.messenger_icons" v-html="staticContent.messenger_icons"></div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
      <div
          v-if="staticContentError"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
      >
        {{ staticContentError }}
      </div>

      <div
          v-if="route.path === '/' && staticContent.main"
          v-html="staticContent.main"
          class="prose mb-12"
      ></div>

      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-black text-white py-6 px-6 text-center mt-auto">
      <div class="max-w-4xl mx-auto space-y-2">
        <div v-if="staticContent.social_networks" v-html="staticContent.social_networks"></div>
        <div v-if="staticContent.rights" v-html="staticContent.rights"></div>
      </div>
    </footer>

    <ContactModal v-if="showModal" @close="closeModal" />
    <PartnerLoginModal v-if="showLoginModal" @close="closeLoginModal" />
  </div>
</template>