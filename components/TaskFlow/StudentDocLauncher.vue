<template>
  <div>
    <!-- Task Information -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">{{ taskTitle }}</h2>
      <p class="text-gray-600 mb-4">{{ taskDescription }}</p>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div class="flex items-center space-x-2 mb-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-medium text-blue-800">Assignment Instructions</span>
        </div>
        <p class="text-sm text-blue-700">
          When you click "Start Assignment", a copy of the document will be created specifically for you. 
          You'll have full editing access to complete your work.
        </p>
      </div>

      <div class="space-y-2 text-sm text-gray-600">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <span>Document Type: Google Docs</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Time Limit: No restriction</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Auto-save: Enabled</span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="text-center">
      <button 
        @click="startAssignment"
        :disabled="isCreatingCopy"
        class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="!isCreatingCopy" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a4 4 0 118 0v2"></path>
        </svg>
        <svg v-else class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isCreatingCopy ? 'Creating Your Copy...' : 'Start Assignment' }}
      </button>
    </div>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="mt-6 p-4 rounded-md" :class="statusMessageClass">
      <div class="flex items-center space-x-2">
        <svg v-if="statusType === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <svg v-else-if="statusType === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span>{{ statusMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  originalDocId: {
    type: String,
    required: true
  },
  taskTitle: {
    type: String,
    default: 'Assignment'
  },
  taskDescription: {
    type: String,
    default: 'Complete the assignment in the provided document.'
  },
  studentEmail: {
    type: String,
    default: 'student@example.com'
  }
})

const emit = defineEmits(['assignment-started', 'copy-created'])

// Component state
const isCreatingCopy = ref(false)
const statusMessage = ref('')
const statusType = ref('') // 'success', 'error', 'info'
const createdDocId = ref(null)

// Google Drive composable
const { createStudentCopy, isAuthenticated, authenticate, initializeGoogleAPIs } = useGoogleDrive()

// Initialize Google APIs when component mounts
onMounted(async () => {
  try {
    await initializeGoogleAPIs()
    console.log('Google APIs initialized in StudentDocLauncher')
  } catch (error) {
    console.error('Failed to initialize Google APIs in StudentDocLauncher:', error)
  }
})

// Load Google APIs scripts
useHead({
  script: [
    {
      src: 'https://accounts.google.com/gsi/client',
      body: true,
      defer: true,
      onload: () => {
        console.log('Google Identity Services loaded in StudentDocLauncher')
        // Re-initialize after script loads
        setTimeout(() => {
          initializeGoogleAPIs()
        }, 100)
      }
    }
  ]
})

// Computed
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

// Methods
const setStatus = (message, type = 'info') => {
  statusMessage.value = message
  statusType.value = type
  
  // Auto-clear success/info messages after 5 seconds
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      clearStatus()
    }, 5000)
  }
}

const clearStatus = () => {
  statusMessage.value = ''
  statusType.value = ''
}

const startAssignment = async () => {
  if (isCreatingCopy.value) return

  isCreatingCopy.value = true
  clearStatus()
  setStatus('Initializing Google Drive connection...', 'info')

  try {
    // Ensure Google APIs are initialized
    await initializeGoogleAPIs()
    
    // Check authentication
    if (!isAuthenticated()) {
      setStatus('Authenticating with Google Drive...', 'info')
      await authenticate()
      
      // Wait a bit for authentication to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (!isAuthenticated()) {
        throw new Error('Authentication failed. Please try again.')
      }
    }

    // Create student copy
    setStatus('Creating document copy and setting permissions...', 'info')
    const result = await createStudentCopy(
      props.originalDocId,
      props.studentEmail,
      props.taskTitle
    )

    createdDocId.value = result.copiedDoc.id
    
    setStatus('Document ready! Opening in new tab...', 'success')
    
    // Open document in new tab
    const docUrl = `https://docs.google.com/document/d/${result.copiedDoc.id}/edit`
    window.open(docUrl, '_blank')

    // Emit events
    emit('copy-created', {
      originalDocId: props.originalDocId,
      copiedDocId: result.copiedDoc.id,
      docUrl: docUrl,
      metadata: result.metadata
    })
    
    emit('assignment-started', {
      copiedDocId: result.copiedDoc.id,
      docUrl: docUrl
    })

    console.log('Assignment started successfully:', result)

  } catch (error) {
    console.error('Failed to start assignment:', error)
    
    let errorMessage = 'Failed to create document copy. Please try again.'
    
    if (error.message.includes('not initialized')) {
      errorMessage = 'Google Drive connection not ready. Please refresh the page and try again.'
    } else if (error.message.includes('Authentication')) {
      errorMessage = 'Authentication failed. Please check your Google account permissions.'
    }
    
    setStatus(errorMessage, 'error')
  } finally {
    isCreatingCopy.value = false
  }
}

// Expose methods for parent component
defineExpose({
  getCreatedDocId: () => createdDocId.value,
  startAssignment
})
</script>