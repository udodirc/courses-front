// src/seo.js
import { reactive, watch } from 'vue';

const seoState = reactive({
    title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_keywords: '',
    og_image: '',
    og_type: 'website',
    og_url: '',
    canonical_url: '',
    robots: 'index, follow',
});

/**
 * A utility function to find or create and then update meta/link tags.
 * @param {string} type - 'name', 'property', or 'rel'.
 * @param {string} key - The value of the key (e.g., 'description', 'og:title', 'canonical').
 * @param {string} content - The content to be set.
 */
function updateTag(type, key, content) {
    let selector;
    let tagName = 'meta';

    if (type === 'rel') {
        selector = `link[${type}="${key}"]`;
        tagName = 'link';
    } else {
        selector = `${tagName}[${type}="${key}"]`;
    }

    let element = document.querySelector(selector);

    // If the element doesn't exist, create it.
    if (!element) {
        element = document.createElement(tagName);
        element.setAttribute(type, key);
        document.head.appendChild(element);
    }

    // Update the element's content/href.
    if (type === 'rel') {
        element.setAttribute('href', content);
    } else {
        element.setAttribute('content', content);
    }
}

// Watch for changes and update the DOM
watch(
    () => seoState,
    (newState) => {
        // Обновляем title
        document.title = newState.title;

        // Обновляем стандартные мета-теги
        updateTag('name', 'description', newState.meta_description);
        updateTag('name', 'keywords', newState.meta_keywords);
        updateTag('name', 'robots', newState.robots);

        // Обновляем Open Graph теги
        updateTag('property', 'og:title', newState.og_title);
        updateTag('property', 'og:description', newState.og_description);
        updateTag('property', 'og:keywords', newState.og_keywords);
        updateTag('property', 'og:image', newState.og_image);
        updateTag('property', 'og:type', newState.og_type);
        updateTag('property', 'og:url', newState.og_url);

        // Обновляем canonical URL
        updateTag('rel', 'canonical', newState.canonical_url);
    },
    { immediate: true, deep: true }
);

export default seoState;