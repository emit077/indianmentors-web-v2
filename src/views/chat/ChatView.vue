<template>
  <v-container fluid class="chat-container pa-0">
    <!-- WebSocket Status Banner -->
    <!-- <div class="alert-banner text-info border-info" v-if="!chatStore.websocketAvailable && chatStore.websocketEnabled">
      <v-icon size="small" class="mr-2">mdi-information</v-icon>
      <span class="text-caption">
        Live chat unavailable. Using REST API mode - click refresh to see new messages.
      </span>
    </div> -->

    <v-banner v-if="!chatStore.websocketAvailable && chatStore.websocketEnabled" class="bg-info font-weight-medium"
      lines="one" style="flex: unset !important;" :icon="mdiInformation" color="info"
      text="Live chat unavailable. Using REST API mode - click refresh to see new messages." :stacked="false">
    </v-banner>

    <v-row no-gutters class="chat-row"
      :class="{ 'with-alert': !chatStore.websocketAvailable && chatStore.websocketEnabled }">
      <!-- Conversations List Sidebar -->
      <v-col cols="12" md="4" lg="3" class="conversations-sidebar">
        <div class="sidebar-container">
          <!-- Fixed Header -->
          <div class="sidebar-header">
            <v-card-title class="px-4 py-3 border-b">
              <div class="d-flex align-center justify-space-between w-100">
                <h3 class="text-h5">Messages</h3>
                <div class="d-flex gap-2">
                  <v-btn icon="mdi-refresh" variant="text" size="small" @click="refreshConversations"
                    :loading="loadingConversations" title="Refresh conversations"></v-btn>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn icon="mdi-plus" v-bind="props" variant="text" size="small"></v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="openNewChatDialog('one_to_one')">
                        <v-list-item-title>New Chat</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openNewChatDialog('group')">
                        <v-list-item-title>New Group</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </v-card-title>

            <!-- Search -->
            <div class="px-4 py-2 border-b">
              <v-text-field v-model="searchQuery" placeholder="Search conversations..." variant="outlined"
                density="compact" hide-details clearable>
                <template v-slot:prepend-inner>
                  <div class="text-lightText d-flex align-center">
                    <SvgSprite name="custom-search" style="width: 16px; height: 16px" />
                  </div>
                </template></v-text-field>
            </div>
          </div>
          <v-divider></v-divider>

          <!-- Scrollable Conversations List -->
          <div class="sidebar-content">
            <v-list v-if="!loadingConversations && filteredConversations.length > 0" class="pa-0">
              <v-list-item v-for="conversation in filteredConversations" :key="conversation.id"
                :active="selectedConversation?.id === conversation.id" @click="selectConversation(conversation)"
                class="pa-2">
                <template v-slot:prepend>
                  <v-avatar :color="conversation.conversation_type === 'group' ? 'primary' : 'secondary'">
                    <v-icon v-if="conversation.conversation_type === 'group'">mdi-account-group</v-icon>
                    <span v-else>{{ getConversationInitials(conversation) }}</span>
                  </v-avatar>
                </template>

                <v-list-item-title class="text-body-1 font-weight-medium opacity-70">{{
                  getConversationName(conversation)
                  }}
                  <div class="text-caption">{{ formatTime(conversation.last_message?.created_at) }}</div>


                </v-list-item-title>
                <!-- <v-list-item-subtitle v-if="conversation.last_message">
                  {{ conversation.last_message.content }}
                </v-list-item-subtitle> -->

                <template v-slot:append>
                  <div class="d-flex flex-column align-end ">
                    <v-badge v-if="conversation.unread_count > 0" :content="conversation.unread_count" color="primary"
                      inline class="mt-1"></v-badge>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <div v-else-if="loadingConversations" class="d-flex justify-center align-center pa-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>

            <div v-else class="d-flex flex-column align-center justify-center pa-8 text-center">
              <v-icon size="64" color="grey-lighten-1">mdi-chat-outline</v-icon>
              <p class="mt-4 text-grey">No conversations yet</p>
              <v-btn color="primary" variant="outlined" @click="openNewChatDialog('one_to_one')" class="mt-2">
                Start a Conversation
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Chat Area -->
      <v-col cols="12" md="8" lg="9" class="chat-area">
        <div v-if="selectedConversation" class="chat-container-inner">
          <!-- Fixed Chat Header -->
          <div class="chat-header">
            <v-card-title class="px-4 py-3 border-b">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-avatar :color="selectedConversation.conversation_type === 'group' ? 'primary' : 'secondary'"
                    class="mr-3">
                    <v-icon v-if="selectedConversation.conversation_type === 'group'">mdi-account-group</v-icon>
                    <span v-else>{{ getConversationInitials(selectedConversation) }}</span>
                  </v-avatar>
                  <div>
                    <h4 class="text-h6">{{ getConversationName(selectedConversation) }}</h4>
                    <small class="text-caption text-grey">
                      {{ selectedConversation.conversation_type === 'group'
                        ? `${selectedConversation.participants?.length || 0} members`
                        : 'Online'
                      }}
                    </small>
                  </div>
                </div>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text" size="small"></v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-if="selectedConversation.conversation_type === 'group'" @click="viewGroupInfo">
                      <v-list-item-title>Group Info</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="clearChat">
                      <v-list-item-title>Clear Chat</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </v-card-title>
          </div>

          <!-- Scrollable Messages Area -->
          <div ref="messagesContainer" class="chat-messages">
            <div v-if="loadingMessages" class="d-flex justify-center align-center" style="height: 100%;">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>

            <div v-else-if="messages.length === 0" class="d-flex flex-column align-center justify-center text-center"
              style="height: 100%;">
              <v-icon size="64" color="grey-lighten-1">mdi-message-outline</v-icon>
              <p class="mt-4 text-grey">No messages yet. Start the conversation!</p>
            </div>

            <div v-else class="messages-list pa-4">
              <!-- Load More Button -->
              <div v-if="chatStore.hasMoreMessages" class="text-center mb-4">
                <v-btn variant="outlined" size="small" color="primary" :loading="loadingMoreMessages"
                  @click="loadMoreMessages" prepend-icon="mdi-chevron-up">
                  Load Earlier Messages
                </v-btn>
              </div>

              <div v-for="(message, index) in messages" :key="message.id"
                :class="['message-wrapper', message.sender.id === currentUserId ? 'message-sent' : 'message-received']">
                <div class="message-bubble">
                  <div v-if="selectedConversation.conversation_type === 'group' && message.sender.id !== currentUserId"
                    class="message-sender">
                    {{ message.sender.name }}
                  </div>
                  <div class="message-content">{{ message.content }}</div>
                  <div class="message-time">
                    {{ formatTime(message.created_at) }}
                    <!-- Delivery/Read Status (only for sent messages) -->
                    <span v-if="message.sender.id === currentUserId" class="message-status ml-1">
                      <!-- Read (blue double tick) -->
                      <v-icon v-if="message.is_read" size="16" color="blue">mdi-check-all</v-icon>
                      <!-- Delivered (grey double tick) -->
                      <v-icon v-else-if="message.is_delivered" size="16" color="grey">mdi-check-all</v-icon>
                      <!-- Sent (single tick) -->
                      <v-icon v-else size="16" color="grey">mdi-check</v-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Message Input -->
          <div class="chat-footer">
            <div class="px-4 py-3 border-t">
              <v-text-field v-model="newMessage" placeholder="Type a message..." variant="outlined"
                density="comfortable" hide-details @keydown.enter.prevent="sendMessage" @input="handleTyping">
                <template v-slot:append-inner>
                  <v-btn :icon="mdiSend" color="primary" :disabled="!newMessage.trim()" @click="sendMessage"
                    class="ml-2" size="small"></v-btn>
                </template>
              </v-text-field>
            </div>
          </div>
        </div>

        <!-- No Conversation Selected -->
        <div v-else class="no-conversation-selected">
          <div class="text-center">
            <v-icon size="120" color="grey-lighten-2">mdi-chat-processing-outline</v-icon>
            <h3 class="text-h5 mt-4 text-grey">Select a conversation to start messaging</h3>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- New Chat Dialog -->
    <v-dialog v-model="newChatDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ newChatType === 'group' ? 'Create Group Chat' : 'Start New Chat' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-if="newChatType === 'group'" v-model="newGroupName" label="Group Name" variant="outlined"
            class="mb-4"></v-text-field>

          <v-autocomplete v-model="selectedUsers" :items="availableUsers" :loading="loadingUsers" item-title="name"
            item-value="id" label="Select Users" variant="outlined" :multiple="newChatType === 'group'" chips
            closable-chips></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="newChatDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="createConversation" :disabled="!canCreateConversation">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { useUserSearch } from '@/composables/useChat';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { mdiSend, mdiInformation } from '@mdi/js';

// Stores 
const authStore = useAuthStore();
const chatStore = useChatStore();

// Composables
const { users: availableUsers, loading: loadingUsers, searchUsers } = useUserSearch();

// Refs
const searchQuery = ref('');
const selectedConversation = ref<any>(null);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const newChatDialog = ref(false);
const newChatType = ref<'one_to_one' | 'group'>('one_to_one');
const newGroupName = ref('');
const selectedUsers = ref<any[]>([]);
const loadingConversations = ref(false);
const loadingMessages = ref(false);
const loadingMoreMessages = ref(false);

// Computed
const currentUserId = computed(() => authStore.user?.id || authStore.user?.user_id);

const conversations = computed(() => chatStore.conversations);

const messages = computed(() => chatStore.messages);

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value;
  const query = searchQuery.value.toLowerCase();
  return conversations.value.filter((conv: any) =>
    getConversationName(conv).toLowerCase().includes(query)
  );
});

const canCreateConversation = computed(() => {
  if (newChatType.value === 'group') {
    return newGroupName.value.trim() && selectedUsers.value.length >= 2;
  }
  return selectedUsers.value.length === 1;
});

// Methods
const getConversationName = (conversation: any) => {
  if (conversation.conversation_type === 'group') {
    return conversation.name || 'Group Chat';
  }
  // For 1-1 chat, find the other user
  const otherUser = conversation.participants?.find((p: any) => p.id !== currentUserId.value);
  return otherUser?.name || 'Unknown User';
};

const getConversationInitials = (conversation: any) => {
  const name = getConversationName(conversation);
  return name.substring(0, 2).toUpperCase();
};

const formatTime = (timestamp: string) => {
  if (!timestamp) return '';
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (e) {
    return '';
  }
};

const selectConversation = async (conversation: any) => {
  selectedConversation.value = conversation;
  loadingMessages.value = true;
  await chatStore.loadMessages(conversation.id);
  loadingMessages.value = false;
  await nextTick();
  scrollToBottom();
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return;

  const content = newMessage.value.trim();
  newMessage.value = '';

  await chatStore.sendMessage(selectedConversation.value.id, content);
  await nextTick();
  scrollToBottom();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

const loadMoreMessages = async () => {
  if (!selectedConversation.value || loadingMoreMessages.value) return;

  loadingMoreMessages.value = true;

  try {
    // Save current scroll position
    const container = messagesContainer.value;
    const previousScrollHeight = container?.scrollHeight || 0;

    // Load more messages
    await chatStore.loadMoreMessages(selectedConversation.value.id);

    // Restore scroll position (accounting for new content height)
    await nextTick();
    if (container) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeight;
      container.scrollTop = scrollDiff;
    }
  } catch (error) {
    console.error('Failed to load more messages:', error);
  } finally {
    loadingMoreMessages.value = false;
  }
};

const openNewChatDialog = async (type: 'one_to_one' | 'group') => {
  newChatType.value = type;
  newChatDialog.value = true;
  newGroupName.value = '';
  selectedUsers.value = [];
  await loadAvailableUsers();
};

const loadAvailableUsers = async () => {
  try {
    await searchUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

const createConversation = async () => {
  try {
    const payload: any = {
      conversation_type: newChatType.value
    };

    if (newChatType.value === 'group') {
      payload.name = newGroupName.value;
      payload.participant_ids = selectedUsers.value;
    } else {
      payload.other_user_id = selectedUsers.value[0];
    }

    const conversation = await chatStore.createConversation(payload);
    newChatDialog.value = false;

    // Select the newly created conversation
    if (conversation) {
      await selectConversation(conversation);
    }
  } catch (error) {
    console.error('Failed to create conversation:', error);
  }
};

const viewGroupInfo = () => {
  // TODO: Implement group info dialog
  console.log('View group info');
};

const clearChat = () => {
  // TODO: Implement clear chat
  console.log('Clear chat');
};

// Typing indicator
let typingTimeout: NodeJS.Timeout | null = null;
const handleTyping = () => {
  if (selectedConversation.value) {
    chatStore.sendTypingIndicator(selectedConversation.value.id, true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    typingTimeout = setTimeout(() => {
      if (selectedConversation.value) {
        chatStore.sendTypingIndicator(selectedConversation.value.id, false);
      }
    }, 3000);
  }
};

// Refresh conversations
const refreshConversations = async () => {
  loadingConversations.value = true;
  try {
    await chatStore.loadConversations();
  } catch (error) {
    console.error('Failed to refresh conversations:', error);
  } finally {
    loadingConversations.value = false;
  }
};

// Get route
const route = useRoute();

// Lifecycle
onMounted(async () => {
  loadingConversations.value = true;
  await chatStore.loadConversations();
  loadingConversations.value = false;

  // Check if there's a conversation_id in query params
  if (route.query.conversation_id) {
    const conversationId = parseInt(route.query.conversation_id as string);
    const conversation = conversations.value.find(c => c.id === conversationId);
    if (conversation) {
      await selectConversation(conversation);
    }
  }
});

onUnmounted(() => {
  chatStore.disconnectAll();
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
});

// Watch for new messages to scroll to bottom
watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom());
});
</script>

<style scoped lang="scss">
.chat-container {
  height: calc(100vh - 124px);
  max-height: calc(100vh - 124px);
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
}


.chat-row {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

// Conversations Sidebar
.conversations-sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
}

.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  flex-shrink: 0;
  background: white;
  z-index: 1;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

// Chat Area
.chat-area {
  height: 100%;
}

.chat-container-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  flex-shrink: 0;
  background: white;
  z-index: 1;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background-image: url('@/assets/images/chat/chat-bg.png');
  background-size: 400px;
  background-position: center center;
  background-repeat: repeat;
  background-attachment: scroll;
  background-size: cover;
}

.messages-list {
  min-height: 100%;
}

.chat-footer {
  flex-shrink: 0;
  background: white;
  z-index: 1;
}

.no-conversation-selected {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

// Borders
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}



.message-wrapper {
  margin-bottom: 16px;
  display: flex;

  &.message-sent {
    justify-content: flex-end;

    .message-bubble {
      background-color: #1976d2;
      color: white;
      border-radius: 18px 18px 4px 18px;
    }
  }

  &.message-received {
    justify-content: flex-start;

    .message-bubble {
      background-color: white;
      color: #000;
      border-radius: 18px 18px 18px 4px;
    }
  }
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.8;
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.message-status {
  display: inline-flex;
  align-items: center;
}

// Smooth scrolling
.sidebar-content,
.chat-messages {
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

@media (max-width: 960px) {
  .conversations-sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .chat-container {
    height: calc(100vh - 56px);
  }
}
</style>
