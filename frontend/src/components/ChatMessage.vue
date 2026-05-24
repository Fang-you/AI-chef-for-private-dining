<template>
  <div :class="['message', `message-${message.role}`]">
    <div class="message-avatar">
      <el-icon :size="24">
        <User v-if="message.role === 'user'" />
        <ChatDotRound v-else />
      </el-icon>
    </div>
    <div class="message-content">
      <div v-if="message.image_url" class="message-image">
        <el-image :src="message.image_url" fit="cover" :preview-src-list="[message.image_url]" />
      </div>
      <div class="message-text">{{ message.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, ChatDotRound } from '@element-plus/icons-vue'
import type { Message } from '../types/chat'

defineProps<{
  message: Message
}>()
</script>

<style scoped>
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f5;
}

.message-user .message-avatar {
  background: #409eff;
  color: white;
}

.message-assistant .message-avatar {
  background: #67c23a;
  color: white;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-image {
  margin-bottom: 8px;
}

.message-image :deep(.el-image) {
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.message-text {
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-user .message-text {
  background: #409eff;
  color: white;
}

.message-assistant .message-text {
  background: #f4f4f5;
  color: #303133;
}
</style>
