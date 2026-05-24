<template>
  <el-container class="app-container">
    <Header @new-session="handleNewSession" />

    <el-main class="main-content">
      <div class="chat-container">
        <div v-if="messages.length === 0" class="empty-state">
          <el-icon :size="64" color="#909399">
            <ChatDotRound />
          </el-icon>
          <p>开始与 AI 私人厨师对话</p>
          <p class="hint">上传食材图片，获取美味食谱推荐</p>
        </div>

        <div v-else class="messages-area" ref="messagesContainer">
          <ChatMessage
            v-for="(msg, idx) in messages"
            :key="idx"
            :message="msg"
          />
          <div v-if="isStreaming" class="streaming-indicator">
            <el-icon class="is-loading"><Loading /></el-icon>
            AI 正在思考...
          </div>
        </div>
      </div>
    </el-main>

    <ChatInput
      :disabled="isStreaming"
      @send="handleSend"
    />

    <el-dialog v-model="showNewSessionDialog" title="新建会话" width="400px">
      <p>确定要新建会话吗？当前会话的消息将被清空。</p>
      <template #footer>
        <el-button @click="showNewSessionDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmNewSession">确定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { ChatDotRound, Loading } from '@element-plus/icons-vue'
import Header from './components/Header.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInput from './components/ChatInput.vue'
import { useChat } from './composables/useChat'

const { messages, isStreaming, sendMessage, newSession } = useChat()

const messagesContainer = ref<HTMLElement | null>(null)
const showNewSessionDialog = ref(false)

function handleSend(content: string, imageUrl?: string) {
  sendMessage(content, imageUrl)
}

function handleNewSession() {
  if (messages.value.length > 0) {
    showNewSessionDialog.value = true
  } else {
    newSession()
  }
}

function confirmNewSession() {
  newSession()
  showNewSessionDialog.value = false
}

watch([messages, isStreaming], () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.chat-container {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  padding: 40px;
}

.empty-state p {
  margin: 12px 0 0;
  font-size: 16px;
}

.empty-state .hint {
  font-size: 14px;
  color: #c0c4cc;
}

.messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
  padding: 12px;
}
</style>
