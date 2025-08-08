import { writable } from 'svelte/store';
import type { SearchIndexItem, SearchResult } from '$lib/docs/buildSearchIndex.ts';

interface SearchStore {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  documents: SearchIndexItem[];
}

const initialState: SearchStore = {
  isOpen: false,
  query: '',
  results: [],
  isLoading: false,
  documents: []
};

function createSearchStore() {
  const { subscribe, set, update } = writable<SearchStore>(initialState);

  return {
    subscribe,
    
    async initialize(language: string = 'en') {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        // Load search data
        const response = await fetch(`/search-index-${language}.json`);
        if (!response.ok) {
          console.warn(`No search index found for language: ${language}`);
          update(state => ({ ...state, isLoading: false }));
          return;
        }
        
        const documents: SearchIndexItem[] = await response.json();
        
        update(state => ({
          ...state,
          documents,
          isLoading: false
        }));
        
      } catch (error) {
        console.error('Failed to initialize search index:', error);
        update(state => ({ ...state, isLoading: false }));
      }
    },

    open() {
      update(state => ({ ...state, isOpen: true }));
    },

    close() {
      update(state => ({ 
        ...state, 
        isOpen: false, 
        query: '', 
        results: [] 
      }));
    },

    search(query: string) {
      update(state => ({ ...state, query }));
      
      if (!query.trim()) {
        update(state => ({ ...state, results: [] }));
        return;
      }

      update(state => {
        const searchTerm = query.toLowerCase();
        const results: SearchResult[] = [];
        
        for (const doc of state.documents) {
          let score = 0;
          const titleMatch = doc.title.toLowerCase().includes(searchTerm);
          const contentMatch = doc.content.toLowerCase().includes(searchTerm);
          const descriptionMatch = doc.description?.toLowerCase().includes(searchTerm);
          
          if (titleMatch) score += 3;
          if (descriptionMatch) score += 2;
          if (contentMatch) score += 1;
          
          if (score > 0) {
            results.push({
              id: doc.id,
              title: doc.title,
              excerpt: generateExcerpt(doc.content, query),
              path: doc.path
            });
          }
        }
        
        // Sort by score (title matches first)
        results.sort((a, b) => {
          const aScore = a.title.toLowerCase().includes(searchTerm) ? 3 : 1;
          const bScore = b.title.toLowerCase().includes(searchTerm) ? 3 : 1;
          return bScore - aScore;
        });
        
        return { ...state, results: results.slice(0, 10) };
      });
    },

    reset() {
      set(initialState);
    }
  };
}

function generateExcerpt(content: string, query: string): string {
  const words = content.split(/\s+/);
  const queryLower = query.toLowerCase();
  const queryIndex = words.findIndex(word => word.toLowerCase().includes(queryLower));
  
  if (queryIndex === -1) {
    return content.slice(0, 150) + '...';
  }
  
  const start = Math.max(0, queryIndex - 10);
  const end = Math.min(words.length, queryIndex + 20);
  const excerpt = words.slice(start, end).join(' ');
  
  return (start > 0 ? '...' : '') + excerpt + (end < words.length ? '...' : '');
}

export const searchStore = createSearchStore();