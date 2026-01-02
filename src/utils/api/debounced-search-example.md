# How to Use `createDebouncedSearch`

The `createDebouncedSearch` function helps you create a debounced search function that automatically cancels previous requests when a new one is made.

## Basic Usage

```typescript
import { createDebouncedSearch, api } from '@/utils/api/axios';

// Step 1: Create your search function
const searchFunction = async (query: string, signal?: AbortSignal) => {
  // Use the signal to cancel the request if needed
  const response = await api.get('/api/search', {
    params: { q: query },
    signal // Pass the abort signal to cancel previous requests
  });
  
  return response; // Return the search results
};

// Step 2: Create the debounced search function
const debouncedSearch = createDebouncedSearch(searchFunction, 300); // 300ms delay

// Step 3: Use it in your component
```

## Complete Vue Component Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { createDebouncedSearch, api } from '@/utils/api/axios';

// Search query from input
const searchQuery = ref('');
const searchResults = ref([]);
const isLoading = ref(false);
const searchError = ref<string | null>(null);

// Create the search function
const performSearch = async (query: string, signal?: AbortSignal) => {
  if (!query || query.length < 2) {
    searchResults.value = [];
    return [];
  }

  try {
    isLoading.value = true;
    searchError.value = null;
    
    // Make API call with abort signal
    const response = await api.get('/api/students/search', {
      params: { q: query },
      signal // This will cancel if a new search is triggered
    });
    
    return response; // Return results
  } catch (error: any) {
    // Ignore cancellation errors
    if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
      searchError.value = error.message || 'Search failed';
      throw error;
    }
    return [];
  } finally {
    isLoading.value = false;
  }
};

// Create debounced search (300ms delay)
const debouncedSearch = createDebouncedSearch(performSearch, 300);

// Watch for search query changes
watch(searchQuery, async (newQuery) => {
  if (newQuery.length >= 2) {
    try {
      const results = await debouncedSearch(newQuery);
      if (results) {
        searchResults.value = results;
      }
    } catch (error) {
      // Error already handled in performSearch
    }
  } else {
    searchResults.value = [];
  }
});
</script>

<template>
  <div>
    <v-text-field
      v-model="searchQuery"
      label="Search students..."
      :loading="isLoading"
      placeholder="Type at least 2 characters"
    />
    
    <div v-if="isLoading">Searching...</div>
    <div v-else-if="searchError" class="error">{{ searchError }}</div>
    <div v-else-if="searchResults.length > 0">
      <div v-for="result in searchResults" :key="result.id">
        {{ result.name }}
      </div>
    </div>
    <div v-else-if="searchQuery.length >= 2">No results found</div>
  </div>
</template>
```

## With API Helper (Recommended)

```typescript
import { createDebouncedSearch, api } from '@/utils/api/axios';

// Create search function that uses the api helper
const searchStudents = async (query: string, signal?: AbortSignal) => {
  const response = await api.get('/api/students', {
    params: { 
      search: query,
      page: 1,
      limit: 20
    },
    signal // Important: pass the signal to cancel previous requests
  });
  
  return response; // This will be the data from the API
};

// Create debounced version (waits 500ms after typing stops)
const debouncedSearch = createDebouncedSearch(searchStudents, 500);

// Use it
const results = await debouncedSearch('john');
```

## With POST Request

```typescript
const searchWithPost = async (query: string, signal?: AbortSignal) => {
  const response = await api.post('/api/search', {
    query: query,
    filters: { status: 'active' }
  }, {
    signal // Pass signal for cancellation
  });
  
  return response;
};

const debouncedPostSearch = createDebouncedSearch(searchWithPost, 300);
```

## Key Features

1. **Automatic Cancellation**: Previous requests are automatically cancelled when a new search is triggered
2. **Debouncing**: Waits for the specified delay (default 300ms) before executing
3. **Error Handling**: Cancellation errors are automatically ignored
4. **Type Safe**: Fully typed with TypeScript

## Parameters

- `searchFn`: Your search function that takes `(query: string, signal?: AbortSignal) => Promise<T>`
- `delay`: Debounce delay in milliseconds (default: 300)

## Return Value

Returns a debounced function that you can call with the search query.

## Notes

- The `signal` parameter is an `AbortSignal` that you should pass to your API calls
- Cancellation errors (`CanceledError`, `AbortError`) are automatically handled
- The function will wait for the delay period before executing
- If a new search is triggered before the delay completes, the previous one is cancelled

