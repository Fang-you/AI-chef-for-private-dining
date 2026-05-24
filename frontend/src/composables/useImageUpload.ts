import { ref } from 'vue'
import { chatApi } from '../api/chat'

export function useImageUpload() {
  const uploading = ref(false)
  const uploadError = ref<string | null>(null)

  async function uploadImage(file: File): Promise<string | null> {
    uploading.value = true
    uploadError.value = null

    try {
      const { uploadUrl, contentType, accessUrl } = await chatApi.getPresignUrl(file.name)
      await chatApi.uploadToOSS(uploadUrl, file, contentType)
      return accessUrl
    } catch (error) {
      uploadError.value = error instanceof Error ? error.message : '上传失败'
      return null
    } finally {
      uploading.value = false
    }
  }

  return { uploading, uploadError, uploadImage }
}
