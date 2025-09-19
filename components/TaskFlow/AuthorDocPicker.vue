<template>
  <div class="space-y-6">
    <!-- Document Selection Step -->
    <div v-if="!confirmed" class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-xl font-semibold mb-4">Add Google Document to your task</h2>
      
      <DocumentPicker 
        ref="pickerRef"
        @document-selected="handleDocumentSelected"
        @document-loading="handleDocumentLoading"
      />
      
      <button 
        @click="openPicker"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        Select Google Doc
      </button>
    </div>

    <!-- Confirmed State -->
    <div v-if="confirmed" class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Assignment Ready</h3>
          <p class="text-sm text-gray-600">{{ selectedDocument?.name }} is ready for students</p>
        </div>
      </div>
      
      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-green-700">
          Students will receive a copy of this document when they start their assignment. 
          The assignment is now available for students to begin work.
        </p>
      </div>

      <!-- Quick actions for confirmed state -->
      <div class="flex space-x-3">
        <button 
          @click="previewDocument"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Preview Document
        </button>
        <button 
          @click="resetSelection"
          class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Choose Different Document
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import DocumentPicker from '../GoogleDrive/DocumentPicker.vue'

const emit = defineEmits(['document-confirmed', 'document-loading'])

const { copyDocument } = useGoogleDrive()


// Component state
const selectedDocument = ref(null)
const confirmed = ref(false)
const pickerRef = ref(null)

const openPicker = () => {
  pickerRef.value?.handleAuthClick()
}

const handleDocumentLoading = (data) => {
  emit('document-loading', { loading: true })

}

// Handle document selected - now creates master copy
const handleDocumentSelected = async (docData) => {
  console.log('Document selected:', docData)
  if(docData) {
    try {
      // Show loading state while creating master copy
      emit('document-loading', { loading: true })
      
         
      const masterCopyName = `Assignment Master - ${docData.name} - ${new Date().toLocaleDateString()}`
      
      // Create master copy with student getting VIEW access only
      const masterCopyResult = await copyDocument(
        docData.id, 
        masterCopyName,
        'student@example.com', // Student email
        'reader'  // View access only for master copy
      )
      
      // Create enhanced document data with both original and master copy info
      const masterDocData = {
        ...docData,
        // Original document info
        originalId: docData.id,
        originalUrl: docData.url,
        originalName: docData.name,
        // Master copy info (this becomes the new primary document)
        id: masterCopyResult.copiedDoc.id,
        url: `https://docs.google.com/document/d/${masterCopyResult.copiedDoc.id}/edit`,
        name: masterCopyResult.copiedDoc.name,
        masterCopyId: masterCopyResult.copiedDoc.id,
        masterCopyUrl: `https://docs.google.com/document/d/${masterCopyResult.copiedDoc.id}/edit`
      }
      
      selectedDocument.value = masterDocData
      confirmed.value = true
      emit('document-confirmed', masterDocData)
      
    } catch (error) {
      console.error('Failed to create master copy:', error)
      alert('Failed to create master copy. Please try again.')
      // Reset loading state
      emit('document-loading', { loading: false })
    }
  }
}

const resetSelection = () => {
  selectedDocument.value = null
  confirmed.value = false
  console.log('🔄 AuthorDocPicker: Reset selection called')
}

const previewDocument = () => {
  if (selectedDocument.value?.url) {
    window.open(selectedDocument.value.url, '_blank')
  }
}

// Expose methods for parent component
defineExpose({
  resetSelection,
  getSelectedDocument: () => selectedDocument.value,
  isConfirmed: () => confirmed.value,
  // Add the triggerPicker method that calls the DocumentPicker's handleAuthClick
  triggerPicker: openPicker
})
</script>