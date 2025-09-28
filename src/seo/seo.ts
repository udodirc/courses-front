import { reactive, watch } from 'vue';

export interface SEOState {
    title: string;
    meta_description: string;
    meta_keywords: string;
    og_title: string;
    og_description: string;
    og_keywords: string;
    og_image: string;
    og_type: string;
    og_url: string;
    canonical_url: string;
    robots: string;
}

const seoState = reactive<SEOState>({
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

function updateTag(type: 'name' | 'property' | 'rel', key: string, content: string) {
    let tagName = type === 'rel' ? 'link' : 'meta';
    let selector = type === 'rel' ? `link[rel="${key}"]` : `meta[${type}="${key}"]`;

    let element = document.querySelector(selector) as HTMLElement | null;

    if (!element) {
        element = document.createElement(tagName);
        element.setAttribute(type, key);
        document.head.appendChild(element);
    }

    if (type === 'rel') element.setAttribute('href', content);
    else element.setAttribute('content', content);
}

watch(
    () => seoState,
    (newState) => {
        document.title = newState.title;

        updateTag('name', 'description', newState.meta_description);
        updateTag('name', 'keywords', newState.meta_keywords);
        updateTag('name', 'robots', newState.robots);

        updateTag('property', 'og:title', newState.og_title);
        updateTag('property', 'og:description', newState.og_description);
        updateTag('property', 'og:keywords', newState.og_keywords);
        updateTag('property', 'og:image', newState.og_image);
        updateTag('property', 'og:type', newState.og_type);
        updateTag('property', 'og:url', newState.og_url);

        updateTag('rel', 'canonical', newState.canonical_url);
    },
    { immediate: true, deep: true }
);

export default seoState;