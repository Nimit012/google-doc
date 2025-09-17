<template>
    <Teleport to="body">
      <div v-if="props.isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999]">
        <div class="bg-white rounded-xl shadow-2xl p-2 pb-4 w-[70%] sm:w-[60%] md:w-[80%] lg:w-[60%] mx-auto">
          <!-- Header with centered heading and close button in corner -->
          <div class="flex justify-between items-center mb-1 border-b">
            <h3 class="text-2xl font-semibold text-gray-800 text-center flex-1">Document Preview</h3>
            <!-- Close Button positioned in the top-right corner -->
            <button 
              class="text-gray-500 hover:text-gray-800 focus:outline-none transition-colors p-2" 
              @click="closeModal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:space-x-6 sm:items-start">
            <!-- Left Side: Metadata -->
            <div class="flex flex-col my-4 text-sm text-gray-600 sm:max-w-[60%]">
              <p class="truncate"><strong>Name: </strong>{{ props.name }}</p>
              <div class="flex">
                <strong>URL: </strong>
                <a :href="props.url" target="_blank" class="truncate ml-1 text-blue-600 hover:text-blue-800">
                  {{ props.url }}
                </a>
              </div>
              <p class="truncate"><strong>Last Edited: </strong>{{ props.lastEdited }}</p>
              <p class="truncate"><strong>Service ID: </strong> {{ props.serviceId }}</p>
            </div>
            
            <!-- Right Side: Image Container -->
            <div v-if="props.thumbnailLink" class="flex justify-center items-center overflow-hidden bg-gray-50 rounded-lg my-4 sm:max-w-[40%]">
              <img 
                :src="props.thumbnailLink" 
                alt="Document preview" 
                class="w-auto h-auto max-h-[50vh] object-contain"
                referrerpolicy="no-referrer"
              >
            </div>
            <!-- No Preview Text -->
            <div v-else class="text-gray-500 text-center my-4 sm:max-w-[40%]">
              No preview available
            </div>
          </div>
  
          <!-- Copy Document Form (Initially Hidden) -->
          <div v-if="showCopyForm" class="border-t pt-4 mt-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Copy Document & Assign Access</h4>
            
            <div class="space-y-3">
              <!-- New Document Name Input -->
              <div>
                <label for="newDocName" class="block text-sm font-medium text-gray-700 mb-1">
                  New Document Name:
                </label>
                <input
                  id="newDocName"
                  v-model="copyForm.newName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="`Copy of ${props.name}`"
                />
              </div>
              
              <!-- Target User Email Input -->
              <div>
                <label for="targetEmail" class="block text-sm font-medium text-gray-700 mb-1">
                  Grant Edit Access To (Email):
                </label>
                <input
                  id="targetEmail"
                  v-model="copyForm.targetEmail"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>
              
              <!-- Permission Level Selection -->
              <div>
                <label for="permissionLevel" class="block text-sm font-medium text-gray-700 mb-1">
                  Permission Level:
                </label>
                <select
                  id="permissionLevel"
                  v-model="copyForm.permissionLevel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="writer">Edit Access</option>
                  <option value="reader">View Only</option>
                  <option value="commenter">Comment Only</option>
                </select>
              </div>
              
              <!-- Send Notification Checkbox -->
              <div class="flex items-center">
                <input
                  id="sendNotification"
                  v-model="copyForm.sendNotification"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="sendNotification" class="ml-2 block text-sm text-gray-700">
                  Send email notification to user
                </label>
              </div>
            </div>
            
            <!-- Form Action Buttons -->
            <div class="flex justify-end space-x-2 mt-4">
              <button 
                class="bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-4 rounded-md transition-colors" 
                @click="cancelCopy"
              >
                Cancel
              </button>
              <button 
                class="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                @click="executeCopy"
                :disabled="isCopying || !isFormValid"
              >
                <span v-if="isCopying">Copying...</span>
                <span v-else>Copy Document</span>
              </button>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-center mt-4 space-x-2">
            <button 
              class="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-md transition-colors" 
              @click="openInNewTab"
            >
              Open in New Tab
            </button>
            
            <button 
              class="bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-md transition-colors" 
              @click="selectDocument"
            >
              Select This Document
            </button>
            
            <button 
              class="bg-amber-700 hover:bg-amber-800 rounded-lg text-white py-1.5 px-4 transition-colors" 
              @click="toggleCopyForm"
              :disabled="!props.documentId"
            >
              {{ showCopyForm ? 'Hide Copy Options' : 'Copy & Share Document' }}
            </button>
          </div>
  
          <!-- Status Messages -->
          <div v-if="statusMessage" class="mt-4 p-3 rounded-md" :class="statusMessageClass">
            {{ statusMessage }}
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  const props = defineProps({
    isVisible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    thumbnailLink: {
      type: String,
      default: ''
    },
    embedUrl: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    lastEdited: {
      type: String,
      default: ''
    },
    serviceId: {
      type: String,
      default: ''
    },
    documentId: {
      type: String,
      default: ''
    }
  })
  
  // Define the emit function
  const emit = defineEmits(['close', 'copy-document', 'document-selected'])
  
  // Component state
  const showCopyForm = ref(false)
  const isCopying = ref(false)
  const statusMessage = ref('')
  const statusType = ref('') // 'success', 'error', 'info'
  
  // Copy form data
  const copyForm = ref({
    newName: '',
    targetEmail: '',
    permissionLevel: 'writer',
    sendNotification: true
  })
  
  // Computed properties
  const isFormValid = computed(() => {
    return copyForm.value.newName.trim() && 
           copyForm.value.targetEmail.trim() && 
           isValidEmail(copyForm.value.targetEmail)
  })
  
  const statusMessageClass = computed(() => {
    const baseClass = 'text-sm font-medium'
    switch (statusType.value) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-800 border border-green-200`
      case 'error':
        return `${baseClass} bg-red-100 text-red-800 border border-red-200`
      case 'info':
        return `${baseClass} bg-blue-100 text-blue-800 border border-blue-200`
      default:
        return `${baseClass} bg-gray-100 text-gray-800 border border-gray-200`
    }
  })
  
  // Watch for modal visibility changes to reset form
  watch(() => props.isVisible, (newValue) => {
    if (newValue) {
      resetCopyForm()
      clearStatus()
    }
  })
  
  // Methods
  const closeModal = () => {
    showCopyForm.value = false
    emit('close')
  }
  
  const openInNewTab = () => {
    if (props.url) {
      window.open(props.url, '_blank')
    }
  }
  
  const selectDocument = () => {
    // Emit document selection to parent
    const docData = {
      id: props.documentId,
      name: props.name,
      url: props.url,
      embedUrl: props.embedUrl,
      thumbnailLink: props.thumbnailLink,
      lastEdited: props.lastEdited,
      serviceId: props.serviceId
    }
    emit('document-selected', docData)
  }
  
  const toggleCopyForm = () => {
    showCopyForm.value = !showCopyForm.value
    if (showCopyForm.value) {
      resetCopyForm()
      clearStatus()
    }
  }
  
  const resetCopyForm = () => {
    copyForm.value = {
      newName: props.name ? `Copy of ${props.name}` : '',
      targetEmail: '',
      permissionLevel: 'writer',
      sendNotification: true
    }
  }
  
  const cancelCopy = () => {
    showCopyForm.value = false
    resetCopyForm()
    clearStatus()
  }
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const setStatus = (message, type = 'info') => {
    statusMessage.value = message
    statusType.value = type
    
    // Auto-clear success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        clearStatus()
      }, 5000)
    }
  }
  
  const clearStatus = () => {
    statusMessage.value = ''
    statusType.value = ''
  }
  
  const executeCopy = async () => {
    if (!isFormValid.value || isCopying.value) return
  
    isCopying.value = true
    clearStatus()
    setStatus('Starting document copy process...', 'info')
  
    try {
      // Emit the copy request to the parent component
      const copyData = {
        originalDocId: props.documentId,
        newName: copyForm.value.newName.trim(),
        targetEmail: copyForm.value.targetEmail.trim(),
        permissionLevel: copyForm.value.permissionLevel,
        sendNotification: copyForm.value.sendNotification
      }
  
      emit('copy-document', copyData)
      
      // The parent component should handle the actual copying and then call showCopySuccess/showCopyError
      
    } catch (error) {
      console.error('Copy execution error:', error)
      setStatus('Failed to initiate copy process. Please try again.', 'error')
    } finally {
      isCopying.value = false
    }
  }
  
  // Methods to be called by parent component
  const showCopySuccess = (message) => {
    setStatus(message || 'Document copied and shared successfully!', 'success')
    showCopyForm.value = false
    resetCopyForm()
  }
  
  const showCopyError = (message) => {
    setStatus(message || 'Failed to copy document. Please try again.', 'error')
  }
  
  // Expose methods for parent component
  defineExpose({
    showCopySuccess,
    showCopyError
  })
  </script>