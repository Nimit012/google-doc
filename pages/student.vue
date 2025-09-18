<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Student View</h1>
      <p class="text-gray-600">Complete tasks and submit</p>
    </div>

    <!-- Flow Status -->
    <!-- <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Current Step</h2>
        <span 
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            stepInfo.role === 'student' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ stepInfo.role === 'student' ? 'Your Turn' : 'Waiting for Others' }}
        </span>
      </div>
      <h3 class="font-medium text-gray-900 mb-1">{{ stepInfo.title }}</h3>
      <p class="text-sm text-gray-600">{{ stepInfo.description }}</p>
    </div> -->

    <!-- Step Content -->
    <div class="space-y-6">

      <!-- Waiting for Author Setup -->
      <div 
        v-if="currentStep === steps.AUTHOR_ADD_DOC || currentStep === steps.AUTHOR_PREVIEW"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Waiting for Author</h3>
          <p class="text-gray-600 mb-4">The author is currently setting up the assignment.</p>
          <p class="text-sm text-gray-500">You'll be able to start once the author completes the document setup.</p>
        </div>

        <div class="mt-6 pt-4 border-t text-center">
          <p class="text-sm text-gray-500 mb-2">Switch to author view to continue the demo:</p>
          <NuxtLink 
            to="/author"
            class="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Go to Author Dashboard →
          </NuxtLink>
        </div>
      </div>

      <!-- Step 1: Start Assignment -->
      <div 
        v-if="currentStep === steps.STUDENT_START"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <StudentDocLauncher
          :original-doc-id="taskData.originalDocId"
          :task-title="taskData.title"
          :task-description="taskData.description"
          :student-email="taskData.studentEmail"
          @assignment-started="handleAssignmentStarted"
          @copy-created="handleCopyCreated"
        />
      </div>

      <!-- Step 2: Working on Assignment -->
      <div 
        v-if="currentStep === steps.STUDENT_WORKING"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Working on Assignment</h2>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span class="font-medium text-blue-800">Document is Open</span>
          </div>
          <p class="text-sm text-blue-700">Your assignment document is now available for editing in a new tab.</p>
        </div>

        <div class="space-y-4 mb-6">
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ taskData.title }} - Student Copy</h3>
                <p class="text-sm text-gray-600">Google Docs • Editing enabled</p>
              </div>
            </div>
            <button 
              @click="openStudentDocument"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Open Document
            </button>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button 
            @click="markComplete"
            :disabled="isMarkingComplete"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isMarkingComplete" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isMarkingComplete ? 'Submitting...' : 'Mark as Complete' }}
          </button>
          <span class="text-sm text-gray-500">
            {{ isMarkingComplete ? 'Transferring to teacher for review...' : 'Click when you\'ve finished your work' }}
          </span>
        </div>

        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Assignment Instructions:</h4>
          <p class="text-sm text-gray-600">{{ taskData.description }}</p>
        </div>
      </div>

      <!-- Step 3: Assignment Submitted -->
      <div 
        v-if="currentStep === steps.STUDENT_COMPLETE || currentStep === steps.TEACHER_REVIEW"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Assignment Submitted!</h3>
          <p class="text-gray-600 mb-6">Your work has been submitted successfully and is now waiting for teacher review.</p>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium text-yellow-800">
                {{ currentStep === steps.STUDENT_COMPLETE ? 'Waiting for teacher review' : 'Teacher is reviewing your work' }}
              </span>
            </div>
          </div>

          <!-- Version Information -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-sm font-medium text-blue-800">Submission Version Created</span>
            </div>
            <p class="text-sm text-blue-700">
              A named version of your document has been saved for your submission record.
            </p>
          </div>

          <p class="text-sm text-gray-500">Your editing access has been removed, but you can still view the document. Your teacher now has editing access for review.</p>
        </div>

        <div class="mt-6 pt-4 border-t text-center">
          <p class="text-sm text-gray-500 mb-2">Switch to teacher view to continue the demo:</p>
          <NuxtLink 
            to="/teacher"
            class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Go to Teacher Dashboard →
          </NuxtLink>
        </div>
      </div>

      <!-- Step 4: Assignment Complete -->
      <div 
        v-if="currentStep === steps.COMPLETED"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="text-center py-8">
          <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Assignment Complete!</h3>
          <p class="text-gray-600 mb-6">Your teacher has reviewed and completed the assignment process.</p>
          <div class="text-left max-w-sm mx-auto mb-6">
            <h4 class="font-medium text-gray-900 mb-2">Process Complete:</h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Work submitted with version saved</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Teacher reviewed with final version saved</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Document archived with full version history</span>
              </div>
            </div>
          </div>
          <button 
            @click="resetFlow"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Try Another Assignment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StudentDocLauncher from '~/components/TaskFlow/StudentDocLauncher.vue'

const { 
  currentStep, 
  taskData, 
  steps, 
  startStudentTask,
  markStudentComplete,
  resetFlow,
  getStepInfo,
  openStudentDocument
} = useTaskFlow()

const stepInfo = computed(() => getStepInfo())

// Loading state for mark complete
const isMarkingComplete = ref(false)

// Debug watcher
watch(currentStep, (newStep, oldStep) => {
  console.log(`🎓 Student component detected step change: ${oldStep} → ${newStep}`)
}, { immediate: true })

// Also watch the raw value
watch(() => currentStep.value, (newVal) => {
  console.log(`🎓 Student component - currentStep.value changed to: ${newVal}`)
}, { immediate: true })

const handleAssignmentStarted = (assignmentData) => {
  console.log('Assignment started:', assignmentData)
  // The StudentDocLauncher has already opened the document
  // Just update our flow state
  startStudentTask(assignmentData)
}

const handleCopyCreated = (copyData) => {
  console.log('Document copy created:', copyData)
  // Store copy information in task flow
  startStudentTask(copyData)
}

const markComplete = async () => {
  if (isMarkingComplete.value) return
  
  isMarkingComplete.value = true
  console.log('Updating permissions: removing edit access, keeping view access...')
  
  try {
    await markStudentComplete()
  } catch (error) {
    console.error('Failed to mark assignment complete:', error)
    // You might want to show an error message to the user here
  } finally {
    isMarkingComplete.value = false
  }
}

// Debug mounted
onMounted(() => {
  console.log('🎓 Student component mounted, currentStep:', currentStep.value)
})
</script>