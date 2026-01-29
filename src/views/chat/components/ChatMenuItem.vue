<template>
  <v-list-item :to="{ name: 'Chat' }" :active="isActive">
    <template v-slot:prepend>
      <v-icon>mdi-chat</v-icon>
    </template>
    
    <v-list-item-title>Chat</v-list-item-title>
    
    <template v-slot:append>
      <v-badge
        v-if="unreadCount > 0"
        :content="unreadCount > 99 ? '99+' : unreadCount"
        color="error"
        inline
      ></v-badge>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from '@/stores/chat';

const route = useRoute();
const chatStore = useChatStore();

const isActive = computed(() => route.name === 'Chat');

const unreadCount = computed(() => {
  return chatStore.conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
});

// Load conversations on mount to get unread counts
onMounted(() => {
  if (chatStore.conversations.length === 0) {
    chatStore.loadConversations();
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
