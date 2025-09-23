<template>
  <div class="space-y-6">
    <!-- Document Selection Step -->
    <div v-if="!selectedDocument" class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-xl font-semibold mb-4">Select Google Document</h2>
      <p class="text-gray-600 mb-6">Choose a Google Doc from your Drive to use as the task template.</p>
      
      <DocumentPicker 
        ref="pickerRef"
        @document-selected="handleDocumentSelected"
      />
      
      <button 
        @click="openPicker"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        Select Google Doc
      </button>
    </div>

    <!-- Document Confirmation Step -->
    <div v-if="selectedDocument && !confirmed" class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-xl font-semibold mb-4">Confirm Document Selection</h2>
      
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 class="font-medium text-gray-900 mb-2">Selected Document</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Name:</span>
            <span class="text-gray-900">{{ selectedDocument.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Type:</span>
            <span class="text-gray-900">Google Docs</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Last Modified:</span>
            <span class="text-gray-900">{{ selectedDocument.lastEditedDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">ID:</span>
            <span class="text-gray-900 font-mono text-xs">{{ selectedDocument.id }}</span>
          </div>
        </div>
      </div>

      <!-- Preview thumbnail if available -->
      <div v-if="selectedDocument.thumbnailLink" class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Document Preview:</h4>
        <div class="bg-gray-50 rounded-lg p-4 flex justify-center">
          <img 
            :src="selectedDocument.thumbnailLink" 
            alt="Document preview" 
            class="max-h-48 object-contain rounded"
            referrerpolicy="no-referrer"
          >
        </div>
      </div>

      <div class="flex space-x-4">
        <button 
          @click="confirmSelection"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Confirm & Use This Document
        </button>
        <button 
          @click="resetSelection"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Choose Different Document
        </button>
        <button 
          @click="previewDocument"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          Preview Document
        </button>
      </div>
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
          <h3 class="text-lg font-semibold text-gray-900">Document Ready</h3>
          <p class="text-sm text-gray-600">{{ selectedDocument.name }} is ready for student tasks</p>
        </div>
      </div>
      
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-sm text-green-700">
          Students will receive a copy of this document when they start their task. 
          You can now proceed to create the student preview.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import DocumentPicker from '../GoogleDrive/DocumentPicker.vue'

const emit = defineEmits(['document-confirmed'])

// Component state
const selectedDocument = ref(null)
const confirmed = ref(false)
const pickerRef = ref(null)

const openPicker = () => {
  pickerRef.value?.handleAuthClick()
}

const handleDocumentSelected = (docData) => {
  console.log('📄 Document selected directly from picker:', docData)
  // Immediately set the document and show confirmation step
  selectedDocument.value = docData
  confirmed.value = false
}

const confirmSelection = () => {
  if (selectedDocument.value) {
    confirmed.value = true
    console.log('✅ Document confirmed:', selectedDocument.value)
    emit('document-confirmed', selectedDocument.value)
  }
}

const resetSelection = () => {
  selectedDocument.value = null
  confirmed.value = false
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
  isConfirmed: () => confirmed.value
})
</script>