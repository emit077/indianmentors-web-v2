<template>
  <div class="icons-page">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold mb-2">Icons</h1>
              <p class="text-body-1 text-medium-emphasis">
                Browse and search through all available icons in the Indian Mentors icon library
              </p>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Search and Filter Section -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="searchQuery" label="Search icons..." variant="outlined" clearable hide-details>
            <template v-slot:prepend-inner>
              <svg class="pc-icon" style="width: 20px; height: 20px">
                <use xlink:href="/assets/svg/sprite.svg#custom-search-normal-1" />
              </svg>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="selectedCategory" :items="categories" label="Category" variant="outlined" clearable
            hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="sortBy" :items="sortOptions" label="Sort by" variant="outlined" hide-details />
        </v-col>
      </v-row>

      <!-- Stats -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-alert type="info" variant="tonal" class="mb-4">
            <div class="d-flex align-center">
              <svg class="pc-icon me-2" style="width: 20px; height: 20px">
                <use xlink:href="/assets/svg/sprite.svg#custom-info-circle-outline" />
              </svg>
              <span>Showing {{ filteredIcons.length }} of {{ allIcons.length }} icons</span>
            </div>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Icons Grid -->
      <v-row>
        <v-col v-for="icon in paginatedIcons" :key="icon.id" cols="6" sm="4" md="3" lg="2" xl="2">
          <v-card class="icon-card h-100" variant="outlined" hover @click="copyIconCode(icon.id)">
            <v-card-text class="text-center pa-4">
              <div class="icon-preview mb-3">
                <svg class="icon-svg" width="32" height="32">
                  <use :xlink:href="`/assets/svg/sprite.svg#${icon.id}`" />
                </svg>
              </div>
              <div class="icon-name text-caption font-weight-medium">
                {{ icon.name }}
              </div>
              <div class="icon-id text-caption text-medium-emphasis mt-1">
                {{ icon.id }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <v-row v-if="totalPages > 1">
        <v-col cols="12" class="d-flex justify-center">
          <v-pagination v-model="currentPage" :length="totalPages" :total-visible="7" class="mt-6" />
        </v-col>
      </v-row>

      <!-- Copy Success Snackbar -->
      <v-snackbar v-model="showCopySuccess" color="success" timeout="2000">
        <svg class="pc-icon me-2" style="width: 20px; height: 20px">
          <use xlink:href="/assets/svg/sprite.svg#custom-circle-check-outline" />
        </svg>
        Icon code copied to clipboard!
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Reactive data
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(48);
const showCopySuccess = ref(false);
const sortBy = ref('name');

// All available icons from the SVG sprite
const allIcons = ref([
  { id: 'custom-home', name: 'Home', category: 'navigation' },
  { id: 'custom-gitBook', name: 'GitBook', category: 'development' },
  { id: 'custom-document', name: 'Document', category: 'files' },
  { id: 'custom-document-2', name: 'Document 2', category: 'files' },
  { id: 'custom-user', name: 'User', category: 'users' },
  { id: 'custom-box-1', name: 'Box', category: 'objects' },
  { id: 'custom-sort-outline', name: 'Sort', category: 'actions' },
  { id: 'custom-level', name: 'Level', category: 'ui' },
  { id: 'custom-notification', name: 'Notification', category: 'communication' },
  { id: 'custom-setting-2', name: 'Settings', category: 'system' },
  { id: 'custom-search-normal-1', name: 'Search', category: 'actions' },
  { id: 'custom-layer', name: 'Layer', category: 'design' },
  { id: 'custom-sms', name: 'SMS', category: 'communication' },
  { id: 'custom-document-text', name: 'Document Text', category: 'files' },
  { id: 'custom-user-bold', name: 'User Bold', category: 'users' },
  { id: 'custom-security-safe', name: 'Security', category: 'security' },
  { id: 'custom-notification-outline', name: 'Notification Outline', category: 'communication' },
  { id: 'custom-setting-outline', name: 'Settings Outline', category: 'system' },
  { id: 'custom-share-bold', name: 'Share', category: 'actions' },
  { id: 'custom-lock-outline', name: 'Lock', category: 'security' },
  { id: 'custom-profile-2user-outline', name: 'Profile Users', category: 'users' },
  { id: 'custom-add-outline', name: 'Add', category: 'actions' },
  { id: 'custom-logout-1-outline', name: 'Logout', category: 'authentication' },
  { id: 'custom-star-bold', name: 'Star', category: 'ui' },
  { id: 'custom-airplane', name: 'Airplane', category: 'travel' },
  { id: 'custom-mouse-circle', name: 'Mouse', category: 'devices' },
  { id: 'custom-refresh-2', name: 'Refresh', category: 'actions' },
  { id: 'custom-simcard-2', name: 'Sim Card', category: 'devices' },
  { id: 'custom-facebook', name: 'Facebook', category: 'social' },
  { id: 'custom-google', name: 'Google', category: 'social' },
  { id: 'custom-github', name: 'GitHub', category: 'development' },
  { id: 'custom-sun-1', name: 'Sun', category: 'weather' },
  { id: 'custom-moon', name: 'Moon', category: 'weather' },
  { id: 'custom-mask', name: 'Mask', category: 'ui' },
  { id: 'custom-mask-1-outline', name: 'Mask Outline', category: 'ui' },
  { id: 'custom-bag', name: 'Bag', category: 'objects' },
  { id: 'custom-note-1', name: 'Note', category: 'files' },
  { id: 'custom-video-play', name: 'Video Play', category: 'media' },
  { id: 'custom-image', name: 'Image', category: 'media' },
  { id: 'custom-folder-open', name: 'Folder', category: 'files' },
  { id: 'custom-user-add', name: 'User Add', category: 'users' },
  { id: 'custom-status-up', name: 'Status Up', category: 'analytics' },
  { id: 'custom-notification-status', name: 'Notification Status', category: 'communication' },
  { id: 'custom-crop', name: 'Crop', category: 'design' },
  { id: 'custom-keyboard', name: 'Keyboard', category: 'devices' },
  { id: 'custom-graph', name: 'Graph', category: 'analytics' },
  { id: 'custom-kanban', name: 'Kanban', category: 'project' },
  { id: 'custom-link', name: 'Link', category: 'actions' },
  { id: 'custom-login', name: 'Login', category: 'authentication' },
  { id: 'custom-logout', name: 'Logout', category: 'authentication' },
  { id: 'custom-search-normal', name: 'Search Normal', category: 'actions' },
  { id: 'custom-shapes', name: 'Shapes', category: 'design' },
  { id: 'custom-calendar-1', name: 'Calendar', category: 'time' },
  { id: 'custom-message-2', name: 'Message', category: 'communication' },
  { id: 'custom-shopping-bag', name: 'Shopping Bag', category: 'ecommerce' },
  { id: 'custom-document-filter', name: 'Document Filter', category: 'files' },
  { id: 'custom-direct-inbox', name: 'Inbox', category: 'communication' },
  { id: 'custom-user-square', name: 'User Square', category: 'users' },
  { id: 'custom-shield', name: 'Shield', category: 'security' },
  { id: 'custom-call-calling', name: 'Call', category: 'communication' },
  { id: 'custom-dollar-square', name: 'Dollar', category: 'finance' },
  { id: 'custom-inr-square', name: 'INR (Indian Rupee)', category: 'finance' },
  { id: 'custom-flag', name: 'Flag', category: 'ui' },
  { id: 'custom-data', name: 'Data', category: 'analytics' },
  { id: 'custom-presentation-chart', name: 'Presentation Chart', category: 'analytics' },
  { id: 'custom-cpu-charge', name: 'CPU Charge', category: 'devices' },
  { id: 'custom-text-block', name: 'Text Block', category: 'content' },
  { id: 'custom-row-vertical', name: 'Row Vertical', category: 'layout' },
  { id: 'custom-document-upload', name: 'Document Upload', category: 'files' },
  { id: 'custom-password-check', name: 'Password Check', category: 'security' },
  { id: 'custom-24-support', name: '24/7 Support', category: 'support' },
  { id: 'custom-fatrows', name: 'Fat Rows', category: 'layout' },
  { id: 'custom-element-plus', name: 'Element Plus', category: 'ui' },
  { id: 'custom-add-item', name: 'Add Item', category: 'actions' },
  { id: 'custom-clipboard', name: 'Clipboard', category: 'actions' },
  { id: 'custom-story', name: 'Story', category: 'content' },
  { id: 'custom-text-align-justify-center', name: 'Text Align Center', category: 'content' },
  { id: 'custom-flash', name: 'Flash', category: 'ui' },
  { id: 'custom-global', name: 'Global', category: 'world' },
  { id: 'custom-play', name: 'Play', category: 'media' },
  { id: 'custom-multi-users', name: 'Multi Users', category: 'users' },
  { id: 'custom-calculator', name: 'Calculator', category: 'tools' },
  { id: 'custom-filter', name: 'Filter', category: 'actions' },
  { id: 'custom-search', name: 'Search', category: 'actions' },
  { id: 'custom-shopping-cart', name: 'Shopping Cart', category: 'ecommerce' },
  { id: 'custom-add-cart', name: 'Add Cart', category: 'ecommerce' },
  { id: 'custom-eye', name: 'Eye', category: 'actions' },
  { id: 'custom-edit-outline', name: 'Edit', category: 'actions' },
  { id: 'custom-trash', name: 'Trash', category: 'actions' },
  { id: 'custom-zoom-in', name: 'Zoom In', category: 'actions' },
  { id: 'custom-zoom-out', name: 'Zoom Out', category: 'actions' },
  { id: 'custom-reload', name: 'Reload', category: 'actions' },
  { id: 'e-commerce-cart', name: 'E-commerce Cart', category: 'ecommerce' },
  { id: 'custom-code', name: 'Code', category: 'development' },
  { id: 'custom-link1', name: 'Link 1', category: 'actions' },
  { id: 'custom-link2', name: 'Link 2', category: 'actions' },
  { id: 'custom-plus', name: 'Plus', category: 'actions' },
  { id: 'custom-mic-off', name: 'Mic Off', category: 'media' },
  { id: 'custom-home-outline', name: 'Home Outline', category: 'navigation' },
  { id: 'custom-smile-fill', name: 'Smile Fill', category: 'emotions' },
  { id: 'custom-navigation-outline', name: 'Navigation', category: 'navigation' },
  { id: 'custom-circle-plus-outline', name: 'Circle Plus', category: 'actions' },
  { id: 'custom-send-outline', name: 'Send', category: 'communication' },
  { id: 'custom-close', name: 'Close', category: 'actions' },
  { id: 'custom-smile-outline', name: 'Smile Outline', category: 'emotions' },
  { id: 'custom-heart-fill', name: 'Heart Fill', category: 'emotions' },
  { id: 'custom-heart-outline', name: 'Heart Outline', category: 'emotions' },
  { id: 'custom-speaker-outline', name: 'Speaker', category: 'media' },
  { id: 'custom-sound-outline', name: 'Sound', category: 'media' },
  { id: 'custom-mail-outline', name: 'Mail Outline', category: 'communication' },
  { id: 'custom-user-fill', name: 'User Fill', category: 'users' },
  { id: 'custom-user-outline', name: 'User Outline', category: 'users' },
  { id: 'custom-mail-fill', name: 'Mail Fill', category: 'communication' },
  { id: 'custom-setting-fill', name: 'Settings Fill', category: 'system' },
  { id: 'custom-database-outline', name: 'Database', category: 'data' },
  { id: 'custom-circle-check-outline', name: 'Circle Check', category: 'actions' },
  { id: 'custom-warning-outline', name: 'Warning', category: 'alerts' },
  { id: 'custom-info-circle-outline', name: 'Info Circle', category: 'alerts' },
  { id: 'custom-minus-square-outline', name: 'Minus Square', category: 'actions' },
  { id: 'custom-trash-fill', name: 'Trash Fill', category: 'actions' },
  { id: 'custom-circle-play-outline', name: 'Circle Play', category: 'media' },
  { id: 'custom-layout-outline', name: 'Layout', category: 'layout' },
  { id: 'custom-menu-outline', name: 'Menu', category: 'navigation' },
  { id: 'custom-window', name: 'Window', category: 'system' },
  { id: 'custom-chevron-right', name: 'Chevron Right', category: 'navigation' },
  { id: 'custom-translation', name: 'Translation', category: 'world' },
  { id: 'custom-gift-fill', name: 'Gift', category: 'objects' },
  { id: 'custom-message-fill', name: 'Message Fill', category: 'communication' },
  { id: 'custom-message-note', name: 'Message Note', category: 'communication' },
  { id: 'custom-logout-1', name: 'Logout 1', category: 'authentication' },
  { id: 'custom-setting-outline-1', name: 'Settings Outline 1', category: 'system' },
  { id: 'custom-edit', name: 'Edit', category: 'actions' },
  { id: 'custom-user-1', name: 'User 1', category: 'users' },
  { id: 'custom-users', name: 'Users', category: 'users' },
  { id: 'custom-wallet', name: 'Wallet', category: 'finance' },
  { id: 'custom-support', name: 'Support', category: 'support' },
  { id: 'custom-lock', name: 'Lock', category: 'security' },
  { id: 'custom-comment', name: 'Comment', category: 'communication' },
  { id: 'custom-history', name: 'History', category: 'time' },
  { id: 'custom-home-trend', name: 'Home Trend', category: 'analytics' },
  { id: 'custom-chat', name: 'Chat', category: 'communication' },
  { id: 'custom-invoice', name: 'Invoice', category: 'finance' },
  { id: 'custom-user-circle-add', name: 'User Circle Add', category: 'users' },
  { id: 'custom-table', name: 'Table', category: 'data' },
  { id: 'custom-maintenance', name: 'Maintenance', category: 'system' },
  { id: 'custom-shield-tick', name: 'Shield Tick', category: 'security' },
  { id: 'custom-sample', name: 'Sample', category: 'content' },
  { id: 'custom-level-1', name: 'Level 1', category: 'ui' },
  { id: 'custom-disabled', name: 'Disabled', category: 'ui' },
  { id: 'custom-info-circle', name: 'Info Circle', category: 'alerts' },
  { id: 'custom-roadmap', name: 'Roadmap', category: 'project' },
  { id: 'custom-application', name: 'Application', category: 'system' },
  { id: 'custom-forms', name: 'Forms', category: 'content' },
  { id: 'custom-items', name: 'Items', category: 'content' },
  { id: 'custom-chevron-outline', name: 'Chevron', category: 'navigation' },
  { id: 'custom-checked', name: 'Checked', category: 'actions' },
  { id: 'custom-eye-invisible', name: 'Eye Invisible', category: 'actions' },
  { id: 'custom-home-circle', name: 'Home Circle', category: 'navigation' },
  { id: 'custom-square-check-outline', name: 'Square Check', category: 'actions' },
  { id: 'custom-line', name: 'Line', category: 'ui' },
  { id: 'custom-lock-2', name: 'Lock 2', category: 'security' },
  { id: 'custom-link3', name: 'Link 3', category: 'actions' },
  { id: 'custom-profile-outline', name: 'Profile Outline', category: 'users' },
  { id: 'custom-calendar', name: 'Calendar', category: 'time' },
  { id: 'custom-copy', name: 'Copy', category: 'actions' },
  { id: 'custom-scissor', name: 'Scissor', category: 'tools' },
  { id: 'custom-graph-outline', name: 'Graph Outline', category: 'analytics' },
  { id: 'custom-calendar-outline', name: 'Calendar Outline', category: 'time' },
  { id: 'custom-document-text-outline', name: 'Document Text Outline', category: 'files' },
  { id: 'custom-facebook-fill', name: 'Facebook Fill', category: 'social' },
  { id: 'custom-dribble-fill', name: 'Dribbble Fill', category: 'social' },
  { id: 'custom-apple-fill', name: 'Apple Fill', category: 'social' },
  { id: 'custom-youtube-fill', name: 'YouTube Fill', category: 'social' },
  { id: 'custom-rise-outline', name: 'Rise', category: 'analytics' },
  { id: 'custom-fall-outline', name: 'Fall', category: 'analytics' },
  { id: 'custom-more-outline', name: 'More', category: 'actions' },
  { id: 'custom-chevron-up', name: 'Chevron Up', category: 'navigation' },
  { id: 'custom-lock-outline-2', name: 'Lock Outline 2', category: 'security' },
  { id: 'custom-cloud-outline', name: 'Cloud', category: 'weather' },
  { id: 'custom-bidirectional', name: 'Bidirectional', category: 'actions' },
  { id: 'custom-dollar-circle-fill', name: 'Dollar Circle Fill', category: 'finance' },
  { id: 'custom-calendar-plus', name: 'Calendar Plus', category: 'time' },
  { id: 'custom-calendar-check', name: 'Calendar Check', category: 'time' },
  { id: 'custom-goal-outline', name: 'Goal', category: 'project' },
  { id: 'custom-clock-outline', name: 'Clock', category: 'time' },
  { id: 'custom-send-outline-1', name: 'Send Outline 1', category: 'communication' },
  { id: 'custom-folder-outline', name: 'Folder Outline', category: 'files' },
  { id: 'custom-google-outline', name: 'Google Outline', category: 'social' },
  { id: 'custom-copied-outline', name: 'Copied', category: 'actions' },
  { id: 'custom-rating-star-fill', name: 'Rating Star Fill', category: 'ui' },
  { id: 'custom-star-outline', name: 'Star Outline', category: 'ui' },
  { id: 'custom-fall-down-outline', name: 'Fall Down', category: 'analytics' },
  { id: 'custom-list-outline', name: 'List', category: 'content' },
  { id: 'custom-right-circle-fill', name: 'Right Circle Fill', category: 'actions' },
  { id: 'custom-shopping-cart-fill', name: 'Shopping Cart Fill', category: 'ecommerce' },
  { id: 'custom-file-text-fill', name: 'File Text Fill', category: 'files' },
  { id: 'custom-wallet-outline', name: 'Wallet Outline', category: 'finance' },
  { id: 'custom-page-outline', name: 'Page', category: 'files' },
  { id: 'custom-cloud-outline-1', name: 'Cloud Outline 1', category: 'weather' },
  { id: 'custom-dollar-circle-outline', name: 'Dollar Circle Outline', category: 'finance' },
  { id: 'custom-full-screen-outline', name: 'Full Screen', category: 'actions' },
  { id: 'custom-home-trending-outline', name: 'Home Trending', category: 'analytics' },
  { id: 'custom-spent-outline', name: 'Spent', category: 'finance' },
  { id: 'custom-hexagon-outline', name: 'Hexagon', category: 'shapes' },
  { id: 'custom-chevron-down', name: 'Chevron Down', category: 'navigation' },
  { id: 'custom-chevron-up-fill', name: 'Chevron Up Fill', category: 'navigation' },
  { id: 'custom-report-fill', name: 'Report Fill', category: 'files' },
  { id: 'custom-dollar-fill', name: 'Dollar Fill', category: 'finance' },
  { id: 'custom-pending-fill', name: 'Pending Fill', category: 'ui' },
  { id: 'custom-close-circle-fill', name: 'Close Circle Fill', category: 'actions' },
  { id: 'custom-shopping-bag-fill', name: 'Shopping Bag Fill', category: 'ecommerce' },
  { id: 'custom-setup-outline', name: 'Setup Outline', category: 'system' },
  { id: 'custom-printer-outline', name: 'Printer', category: 'devices' },
  { id: 'custom-share-outline', name: 'Share Outline', category: 'actions' },
  { id: 'custom-chevron-up-fill-2', name: 'Chevron Up Fill 2', category: 'navigation' },
  { id: 'custom-chevron-down-fill-2', name: 'Chevron Down Fill 2', category: 'navigation' },
  { id: 'custom-user-right-outline', name: 'User Right', category: 'users' },
  { id: 'custom-user-story-outline', name: 'User Story', category: 'project' },
  { id: 'custom-mobile-outline', name: 'Mobile', category: 'devices' },
  { id: 'custom-payment-outline', name: 'Payment', category: 'finance' },
  { id: 'custom-file-outline-2', name: 'File Outline 2', category: 'files' },
  { id: 'custom-translation-outlie', name: 'Translation Outline', category: 'world' },
  { id: 'custom-check-circle-fill', name: 'Check Circle Fill', category: 'actions' },
  { id: 'custom-away-fill', name: 'Away Fill', category: 'ui' },
  { id: 'custom-disturb-fill', name: 'Disturb Fill', category: 'ui' },
  { id: 'custom-setup', name: 'Setup', category: 'system' },
  { id: 'custom-phone-outline', name: 'Phone', category: 'communication' },
  { id: 'custom-camera-outline', name: 'Camera', category: 'media' },
  { id: 'custom-reply-outline', name: 'Reply', category: 'communication' },
  { id: 'custom-play-outline', name: 'Play Outline', category: 'media' },
  { id: 'custom-paper-clip-outline', name: 'Paper Clip', category: 'actions' },
  { id: 'custom-picture-outline', name: 'Picture', category: 'media' },
  { id: 'custom-mobile-outline-2', name: 'Mobile Outline 2', category: 'devices' },
  { id: 'custom-folder-open-outline', name: 'Folder Open Outline', category: 'files' },
  { id: 'custom-document-outline-1', name: 'Document Outline 1', category: 'files' },
  { id: 'custom-message-outline', name: 'Message Outline', category: 'communication' },
  { id: 'custom-building-outline', name: 'Building', category: 'objects' },
  { id: 'custom-danger-outline', name: 'Danger', category: 'alerts' },
  { id: 'custom-birthday-outline', name: 'Birthday', category: 'events' },
  { id: 'custom-inbox-outline', name: 'Inbox Outline', category: 'communication' },
  { id: 'custom-folder-minus-outline', name: 'Folder Minus', category: 'files' },
  { id: 'custom-bookmark-outline', name: 'Bookmark', category: 'actions' },
  { id: 'custom-tag-outline', name: 'Tag Outline', category: 'ui' },
  { id: 'custom-tag-fill', name: 'Tag Fill', category: 'ui' },
  { id: 'custom-paper-clip-2', name: 'Paper Clip 2', category: 'actions' },
  { id: 'custom-forward-outline', name: 'Forward', category: 'communication' },
  { id: 'custom-download-outline', name: 'Download', category: 'actions' },
  { id: 'custom-upload-outline', name: 'Upload', category: 'actions' },
  { id: 'custom-note-outline', name: 'Note Outline', category: 'files' },
  { id: 'custom-star', name: 'Star', category: 'ui' },
  { id: 'custom-translate', name: 'Translate', category: 'world' },
  { id: 'custom-aim-fill', name: 'Aim Fill', category: 'ui' },
  { id: 'custom-alert-fill', name: 'Alert Fill', category: 'alerts' },
  { id: 'custom-alert-outline', name: 'Alert Outline', category: 'alerts' },
  { id: 'custom-align-center', name: 'Align Center', category: 'content' },
  { id: 'custom-align-justify', name: 'Align Justify', category: 'content' },
  { id: 'custom-align-left', name: 'Align Left', category: 'content' },
  { id: 'custom-align-right', name: 'Align Right', category: 'content' },
  { id: 'custom-arrow-right', name: 'Arrow Right', category: 'navigation' },
  { id: 'custom-bold', name: 'Bold', category: 'content' },
  { id: 'custom-bug-fill', name: 'Bug Fill', category: 'development' },
  { id: 'custom-bug-outline', name: 'Bug Outline', category: 'development' },
  { id: 'custom-camera-fill', name: 'Camera Fill', category: 'media' },
  { id: 'custom-check-square-fill', name: 'Check Square Fill', category: 'actions' },
  { id: 'custom-checkbox-marked-circle-outline', name: 'Checkbox Circle', category: 'actions' },
  { id: 'custom-chevron-down-2', name: 'Chevron Down 2', category: 'navigation' },
  { id: 'custom-circle-info-fill', name: 'Circle Info Fill', category: 'alerts' },
  { id: 'custom-close-circle-outline', name: 'Close Circle Outline', category: 'actions' },
  { id: 'custom-close-square-fill', name: 'Close Square Fill', category: 'actions' },
  { id: 'custom-clock-variant', name: 'Clock Variant', category: 'time' },
  { id: 'custom-coffee-outline', name: 'Coffee', category: 'objects' },
  { id: 'custom-color', name: 'Color', category: 'design' },
  { id: 'custom-colorpick', name: 'Color Pick', category: 'design' },
  { id: 'custom-credit-outline', name: 'Credit', category: 'finance' },
  { id: 'custom-crown', name: 'Crown', category: 'objects' },
  { id: 'custom-desktop-outline', name: 'Desktop', category: 'devices' },
  { id: 'custom-dribble-outline', name: 'Dribbble Outline', category: 'social' },
  { id: 'custom-element-outline', name: 'Element Outline', category: 'ui' },
  { id: 'custom-facebook-outline', name: 'Facebook Outline', category: 'social' },
  { id: 'custom-file-text-outline', name: 'File Text Outline', category: 'files' },
  { id: 'custom-filter-fill', name: 'Filter Fill', category: 'actions' },
  { id: 'custom-gift-outline', name: 'Gift Outline', category: 'objects' },
  { id: 'custom-hierarchy-outline', name: 'Hierarchy', category: 'ui' },
  { id: 'custom-instagram-outline', name: 'Instagram', category: 'social' },
  { id: 'custom-italic', name: 'Italic', category: 'content' },
  { id: 'custom-key-outline', name: 'Key', category: 'security' },
  { id: 'custom-like-outline', name: 'Like', category: 'emotions' },
  { id: 'custom-message-dot-outline', name: 'Message Dot', category: 'communication' },
  { id: 'custom-page-outline-1', name: 'Page Outline 1', category: 'files' },
  { id: 'custom-phone-outline-1', name: 'Phone Outline 1', category: 'communication' },
  { id: 'custom-register', name: 'Register', category: 'authentication' },
  { id: 'custom-retweet-outline', name: 'Retweet', category: 'social' },
  { id: 'custom-setting-outline-2', name: 'Settings Outline 2', category: 'system' },
  { id: 'custom-shadow', name: 'Shadow', category: 'design' },
  { id: 'custom-shopping-cart-bulk', name: 'Shopping Cart Bulk', category: 'ecommerce' },
  { id: 'custom-slash-outline', name: 'Slash', category: 'ui' },
  { id: 'custom-status-outline', name: 'Status Outline', category: 'ui' },
  { id: 'custom-typography', name: 'Typography', category: 'content' },
  { id: 'custom-underline', name: 'Underline', category: 'content' },
  { id: 'custom-undo-outline', name: 'Undo', category: 'actions' },
  { id: 'custom-upgrade', name: 'Upgrade', category: 'actions' },
  { id: 'custom-upload-outline-1', name: 'Upload Outline 1', category: 'actions' },
  { id: 'custom-user-add-outline', name: 'User Add Outline', category: 'users' },
  { id: 'custom-video-outline', name: 'Video Outline', category: 'media' },
  { id: 'custom-warning-fill', name: 'Warning Fill', category: 'alerts' }
]);

// Categories for filtering
const categories = computed(() => {
  const cats = [...new Set(allIcons.value.map((icon) => icon.category))];
  return cats.sort().map((cat) => ({ title: cat.charAt(0).toUpperCase() + cat.slice(1), value: cat }));
});

// Sort options
const sortOptions = [
  { title: 'Name (A-Z)', value: 'name' },
  { title: 'Name (Z-A)', value: 'name-desc' },
  { id: 'category', title: 'Category', value: 'category' }
];

// Filtered icons based on search and category
const filteredIcons = computed(() => {
  let filtered = allIcons.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((icon) => icon.name.toLowerCase().includes(query) || icon.id.toLowerCase().includes(query));
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter((icon) => icon.category === selectedCategory.value);
  }

  // Sort icons
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return filtered;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredIcons.value.length / itemsPerPage.value));

const paginatedIcons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredIcons.value.slice(start, end);
});

// Methods
const copyIconCode = async (iconId: string) => {
  const iconCode = `<v-icon>${iconId}</v-icon>`;

  try {
    await navigator.clipboard.writeText(iconCode);
    showCopySuccess.value = true;
  } catch (err) {
    console.error('Failed to copy icon code:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = iconCode;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showCopySuccess.value = true;
  }
};

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1;
};

// Watch for filter changes to reset pagination
watch([searchQuery, selectedCategory, sortBy], resetPagination);
</script>

<style scoped>
.icons-page {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.icon-card {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid rgb(var(--v-theme-outline-variant));
}

.icon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgb(var(--v-theme-primary));
}

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.icon-svg {
  color: rgb(var(--v-theme-on-surface));
  transition: color 0.2s ease-in-out;
}

.icon-card:hover .icon-svg {
  color: rgb(var(--v-theme-primary));
}

.icon-name {
  word-break: break-word;
  line-height: 1.2;
}

.icon-id {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 10px;
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .icon-preview {
    height: 50px;
  }

  .icon-svg {
    width: 24px;
    height: 24px;
  }
}
</style>
