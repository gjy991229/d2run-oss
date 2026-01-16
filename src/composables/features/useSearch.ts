/**
 * Search functionality composable
 *
 * Handles item search for drop recording, including fuzzy matching
 * and search result navigation.
 */

import { ref, type Ref } from 'vue';
import type { ItemIndex } from '../../shared/types';
import { ITEMS } from '../../shared/data';
import { SEARCH_RESULTS_LIMIT, SEARCH_QUERY_MAX_LENGTH } from '../../shared/constants';
import { sanitizeInput } from '../../shared/utils';

/** Search state and methods interface */
export interface UseSearchReturn {
    /** Whether search panel is open */
    isSearchOpen: Ref<boolean>;
    /** Current search query */
    searchQuery: Ref<string>;
    /** Filtered search results */
    searchResults: Ref<ItemIndex[]>;
    /** Currently selected result index */
    searchIndex: Ref<number>;
    /** Selected quality for custom items */
    selectedQuality: Ref<'1' | '2' | '3'>;
    /** Open search panel and reset state */
    openSearch: () => void;
    /** Close search panel */
    closeSearch: () => void;
    /** Perform search with query */
    performSearch: (q: string) => void;
    /** Navigate search results up/down */
    navigateSearch: (dir: 1 | -1) => void;
    /** Create custom item with name and quality */
    createCustomItem: (
        name: string,
        quality: string | undefined,
        t: (key: string) => string,
        onItemCreated: (itemId: string) => void
    ) => void;
    /** Confirm selected drop item */
    confirmDrop: (
        item: ItemIndex | undefined,
        onItemConfirmed: (itemId: string) => void
    ) => void;
}

/**
 * Create search composable instance
 */
export function useSearch(): UseSearchReturn {
    const isSearchOpen = ref(false);
    const searchQuery = ref('');
    const searchResults = ref<ItemIndex[]>([]);
    const searchIndex = ref(0);
    const selectedQuality = ref<'1' | '2' | '3'>('1');

    function openSearch() {
        isSearchOpen.value = true;
        searchQuery.value = '';
        searchResults.value = [];
        searchIndex.value = 0;
    }

    function closeSearch() {
        isSearchOpen.value = false;
    }

    /** Search items by name with fuzzy matching */
    function performSearch(q: string) {
        const safeQ = q.slice(0, SEARCH_QUERY_MAX_LENGTH);
        searchQuery.value = safeQ;
        searchIndex.value = 0;
        if (!safeQ) {
            searchResults.value = [];
            return;
        }
        const lower = safeQ.toLowerCase();
        searchResults.value = ITEMS.filter(
            (i) => i.name.toLowerCase().includes(lower) || i.name_zh.includes(lower)
        ).slice(0, SEARCH_RESULTS_LIMIT);
    }

    /** Navigate search results */
    function navigateSearch(dir: 1 | -1) {
        if (searchResults.value.length === 0) return;
        let idx = searchIndex.value + dir;
        if (idx < 0) idx = searchResults.value.length - 1;
        if (idx >= searchResults.value.length) idx = 0;
        searchIndex.value = idx;
    }

    /** Create custom item with name and quality */
    function createCustomItem(
        name: string,
        quality: string | undefined,
        t: (key: string) => string,
        onItemCreated: (itemId: string) => void
    ) {
        const safeName = sanitizeInput(name);
        if (!safeName) {
            alert(t('INPUT_INVALID'));
            return;
        }
        const q = quality || selectedQuality.value;
        const customId = `custom:${safeName}:${q}`;
        onItemCreated(customId);
        closeSearch();
    }

    /** Confirm selected drop item or create custom item */
    function confirmDrop(
        item: ItemIndex | undefined,
        onItemConfirmed: (itemId: string) => void
    ) {
        const target = item || searchResults.value[searchIndex.value];
        if (target) {
            onItemConfirmed(target._id);
        }
        closeSearch();
    }

    return {
        isSearchOpen,
        searchQuery,
        searchResults,
        searchIndex,
        selectedQuality,
        openSearch,
        closeSearch,
        performSearch,
        navigateSearch,
        createCustomItem,
        confirmDrop
    };
}
