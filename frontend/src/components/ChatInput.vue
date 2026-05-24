<template>
  <div class="chat-input">
    <div v-if="previewImage" class="image-preview">
      <el-image :src="previewImage" fit="cover" style="width: 100px; height: 100px; border-radius: 8px;" />
      <el-button :icon="Close" circle size="small" @click="clearImage" class="remove-btn" />
    </div>

    <div class="input-row">
      <el-upload
        :show-file-list="false"
        :before-upload="handleImageSelect"
        accept="image/*"
        :disabled="disabled || uploading"
      >
        <el-button :icon="Picture" :loading="uploading" :disabled="disabled">
          {{ uploading ? '上传中...' : '上传图片' }}
        </el-button>
      </el-upload>

      <el-input
        v-model="inputText"
        type="textarea"
        :rows="3"
        placeholder="输入消息... (Ctrl+Enter 发送)"
        :disabled="disabled"
        @keydown.ctrl.enter="handleSend"
      />

      <el-button type="primary" :icon="Promotion" :disabled="disabled || !canSend" @click="handleSend">
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Picture, Promotion, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useImageUpload } from '../composables/useImageUpload'
import type { UploadRawFile } from 'element-plus'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [content: string, imageUrl?: string]
}>()

const inputText = ref('')
const previewImage = ref<string | null>(null)
const uploadedImageUrl = ref<string | null>(null)

const { uploading, uploadImage } = useImageUpload()

const canSend = computed(() => {
  return inputText.value.trim() || uploadedImageUrl.value
})

async function handleImageSelect(file: UploadRawFile) {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return false
  }

  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 10MB')
    return false
  }

  previewImage.value = URL.createObjectURL(file)

  const accessUrl = await uploadImage(file)
  if (accessUrl) {
    uploadedImageUrl.value = accessUrl
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error('图片上传失败')
    clearImage()
  }

  return false
}

function clearImage() {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }
  previewImage.value = null
  uploadedImageUrl.value = null
}

function handleSend() {
  if (!canSend.value) return

  emit('send', inputText.value.trim(), uploadedImageUrl.value || undefined)

  inputText.value = ''
  clearImage()
}
</script>

<style scoped>
.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #dcdfe6;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
}

.input-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-row :deep(.el-textarea) {
  flex: 1;
}
</style>
