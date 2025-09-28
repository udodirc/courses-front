declare global {
    const lucide: {
        createIcons: () => void;
    };
    interface Window {
        initialProjectData?: {
            name: string;
            content: string;
            url: string;
            title: string;
            meta_description: string;
            meta_keywords: string;
            og_title: string;
            og_description: string;
            og_keywords: string;
            og_image?: string;
            og_type: string;
            og_url: string;
            canonical_url: string;
            robots: string;
            images?: string[];
            image_url?: string;
            image_og_url?: string;
            main_page: number | null;
        };
    }
}

export {};