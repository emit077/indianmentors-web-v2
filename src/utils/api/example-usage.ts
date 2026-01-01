/**
 * Example usage of the axios API helper
 * This file demonstrates various ways to use the api helper
 */

import { api, useDebouncedSearch, useThrottledSearch, useConcurrentRequestHandler } from './axios';
import URLS from '@/utils/urls';

// ============================================
// Example 1: Basic Usage (Automatic Error Handling)
// ============================================
export async function example1_BasicUsage() {
  try {
    // GET request - errors handled automatically
    const users = await api.get('/users');
    console.log('Users:', users);

    // POST request - errors handled automatically
    const newUser = await api.post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log('New user:', newUser);
  } catch (error) {
    // This catch will still work, but common errors are already handled
    console.error('Unexpected error:', error);
  }
}

// ============================================
// Example 2: Manual Error Handling
// ============================================
export async function example2_ManualErrorHandling() {
  try {
    const user = await api.get('/users/1', {
      skipDefaultErrorHandling: true // Skip automatic error handling
    });
    console.log('User:', user);
  } catch (error: any) {
    // Handle error manually
    if (error.response?.status === 404) {
      console.log('User not found');
    } else if (error.response?.status === 400) {
      // Handle validation errors
      const errors = error.response.data.errors;
      console.log('Validation errors:', errors);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// ============================================
// Example 3: Success Message Handling
// ============================================
export async function example3_SuccessMessage() {
  // Show default success message
  await api.post('/users', { name: 'Jane' }, {
    showSuccessMessage: true
  });

  // Show custom success message
  await api.put('/users/1', { name: 'Jane Updated' }, {
    showSuccessMessage: 'User updated successfully!'
  });
}

// ============================================
// Example 4: Debounced Search (Recommended for Search Inputs)
// ============================================
export function example4_DebouncedSearch() {
  // Create debounced search function
  const searchStudents = api.createDebouncedSearch<any[]>(
    URLS.STUDENT_LIST,
    {
      debounceMs: 300,    // Wait 300ms after typing stops
      minLength: 2,       // Don't search until 2+ characters
    }
  );

  // Use in component:
  /*
  <script setup>
  import { ref, watch } from 'vue';
  
  const searchQuery = ref('');
  const results = ref([]);
  const loading = ref(false);

  watch(searchQuery, async (query) => {
    if (query.length >= 2) {
      loading.value = true;
      try {
        results.value = await searchStudents(query, { page: 1, limit: 20 });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        loading.value = false;
      }
    }
  });
  </script>
  */
}

// ============================================
// Example 5: Using useDebouncedSearch Composable (BEST for Vue)
// ============================================
export function example5_UseDebouncedSearch() {
  // This is the easiest way - handles everything automatically
  const search = useDebouncedSearch<any[]>(URLS.STUDENT_LIST, {
    debounceMs: 300,
    minLength: 2,
    initialQuery: '',
  });

  // Use in template:
  /*
  <template>
    <v-text-field
      v-model="search.query.value"
      label="Search students..."
      :loading="search.loading.value"
    />
    
    <div v-if="search.loading.value">Loading...</div>
    <div v-else-if="search.error.value">Error: {{ search.error.value.message }}</div>
    <div v-else>
      <div v-for="student in search.results.value" :key="student.id">
        {{ student.name }}
      </div>
    </div>
  </template>
  */

  return search;
}

// ============================================
// Example 6: Throttled Search (For Continuous Updates)
// ============================================
export function example6_ThrottledSearch() {
  // Use throttled search for scenarios where you want to limit frequency
  const search = useThrottledSearch<any[]>(URLS.STUDENT_LIST, {
    throttleMs: 1000,  // Max once per second
    leading: true,
    trailing: true,
  });

  return search;
}

// ============================================
// Example 7: Concurrent Request Handling
// ============================================
export async function example7_ConcurrentRequests() {
  const handler = useConcurrentRequestHandler();

  // Only the latest request result will be used
  // Previous requests that complete later will be ignored
  try {
    const result = await handler(() => api.get('/api/data'));
    return result;
  } catch (error: any) {
    if (error.message === 'Request superseded') {
      // This is expected - a newer request took precedence
      console.log('Request was superseded by newer request');
    } else {
      console.error('Error:', error);
    }
  }
}

// ============================================
// Example 8: Search with Additional Parameters
// ============================================
export async function example8_SearchWithParams() {
  const search = useDebouncedSearch<any[]>(URLS.STUDENT_LIST);

  // Search with filters
  await search.search('john', {
    status: 'active',
    city: 'Mumbai',
    page: 1,
    limit: 20
  });

  // Results are in search.results.value
  console.log('Results:', search.results.value);
}

// ============================================
// Example 9: Cancel Search
// ============================================
export function example9_CancelSearch() {
  const search = useDebouncedSearch<any[]>(URLS.STUDENT_LIST);

  // Cancel pending search (useful on component unmount)
  /*
  import { onUnmounted } from 'vue';
  
  onUnmounted(() => {
    search.cancel();
  });
  */

  return search;
}

// ============================================
// Example 10: Reset Search
// ============================================
export function example10_ResetSearch() {
  const search = useDebouncedSearch<any[]>(URLS.STUDENT_LIST);

  // Reset everything: query, results, errors, and cancel pending requests
  const handleReset = () => {
    search.reset();
  };

  return { search, handleReset };
}

// ============================================
// Example 11: Multiple Sequential Requests
// ============================================
export async function example11_SequentialRequests() {
  try {
    const user = await api.get('/users/1');
    const posts = await api.get(`/users/${user.id}/posts`);
    const comments = await api.get(`/users/${user.id}/comments`);
    
    return { user, posts, comments };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ============================================
// Example 12: Parallel Requests
// ============================================
export async function example12_ParallelRequests() {
  try {
    const [users, posts, comments] = await Promise.all([
      api.get('/users'),
      api.get('/posts'),
      api.get('/comments')
    ]);

    return { users, posts, comments };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
