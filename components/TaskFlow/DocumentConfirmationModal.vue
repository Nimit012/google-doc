<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 overflow-y-auto"
      @keydown.esc="closeModal"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="closeModal"
      ></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div 
          class="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Confirm
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Review and confirm your document selection
                </p>
              </div>
              <button
                @click="closeModal"
                class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="bg-white px-6 py-4 max-h-96 overflow-y-auto">
            <!-- Document Info -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 class="font-medium text-gray-900 mb-3">Selected Document Metadata (fetch using Google api's)</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Name:</span>
                  <span class="text-gray-900 font-medium">{{ document.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="text-gray-900">Google Docs</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Last Modified:</span>
                  <span class="text-gray-900">{{ document.lastEditedDate }}</span>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div v-if="document.thumbnailLink" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              <div class="bg-gray-50 rounded-lg p-4 flex justify-center">
                <img 
                  :src="document.thumbnailLink" 
                  alt="Document preview" 
                  class="max-h-48 object-contain rounded"
                  referrerpolicy="no-referrer"
                >
              </div>
            </div>

            <!-- Info -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex justify-between">
              <div class="flex space-x-3">
                <!-- <button
                  @click="previewDocument"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button> -->
                <button
                  @click="selectDifferent"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Choose Different
                </button>
              </div>
              <button
                @click="confirmDocument"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  document: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'confirm', 'select-different'])

// Prevent body scroll when modal is open
watchEffect(() => {
  if (process.client) {
    if (props.show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

const closeModal = () => {
  emit('close')
}

const confirmDocument = () => {
  emit('confirm', props.document)
}

const selectDifferent = () => {
  emit('select-different')
}

const previewDocument = () => {
  if (props.document?.url) {
    window.open(props.document.url, '_blank')
  }
}

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>