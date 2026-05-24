<template>
  <el-header class="header">
    <div class="header-content">
      <div class="header-left">
        <el-icon :size="28" color="#409eff">
          <Food />
        </el-icon>
        <h1 class="title">AI 私人厨师</h1>
      </div>
      <el-button type="primary" @click="handleNewSession">
        <el-icon><Plus /></el-icon>
        新建会话
      </el-button>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { Food, Plus } from '@element-plus/icons-vue'

const emit = defineEmits<{
  newSession: []
}>()

function handleNewSession() {
  emit('newSession')
}
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>
