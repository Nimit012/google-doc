<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
      <p class="text-gray-600">Manage assignments and review student work</p>
    </div>

    <!-- Flow Status -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Current Step</h2>
        <span 
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            stepInfo.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ stepInfo.role === 'teacher' ? 'Your Turn' : 'Waiting for Student' }}
        </span>
      </div>
      <h3 class="font-medium text-gray-900 mb-1">{{ stepInfo.title }}</h3>
      <p class="text-sm text-gray-600">{{ stepInfo.description }}</p>
    </div>

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
          <p class="text-gray-600 mb-4">The author is currently setting up the assignment document.</p>
          <p class="text-sm text-gray-500">You'll be able to review student work once they complete their assignments.</p>
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

      <!-- Waiting for Student -->
      <div 
        v-if="currentStep === steps.STUDENT_START || currentStep === steps.STUDENT_WORKING || currentStep === steps.STUDENT_COMPLETE"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Student Progress</h2>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 class="font-medium text-gray-900 mb-2">Assignment Document</h3>
          <p class="text-sm text-gray-600">{{ selectedDoc?.name || 'Assignment document selected by author' }}</p>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div 
              :class="[
                'w-3 h-3 rounded-full',
                currentStep === steps.STUDENT_START ? 'bg-yellow-400' : 'bg-green-500'
              ]"
            ></div>
            <span class="text-sm">
              {{ currentStep === steps.STUDENT_START ? 'Student can now start the assignment' : 'Student has started working' }}
            </span>
          </div>
          
          <div 
            v-if="currentStep === steps.STUDENT_WORKING || currentStep === steps.STUDENT_COMPLETE"
            class="flex items-center space-x-3"
          >
            <div 
              :class="[
                'w-3 h-3 rounded-full',
                currentStep === steps.STUDENT_WORKING ? 'bg-yellow-400' : 'bg-green-500'
              ]"
            ></div>
            <span class="text-sm">
              {{ currentStep === steps.STUDENT_WORKING ? 'Student is currently editing the document' : 'Student has completed the assignment' }}
            </span>
          </div>

          <div 
            v-if="currentStep === steps.STUDENT_COMPLETE"
            class="flex items-center space-x-3"
          >
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sm">Assignment submitted with version saved - ready for your review</span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t">
          <p class="text-sm text-gray-500 mb-2">Switch to student view to continue the demo:</p>
          <NuxtLink 
            to="/student"
            class="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Go to Student Dashboard →
          </NuxtLink>
        </div>
      </div>

      <!-- Step 4: Review Student Work -->
      <div 
        v-if="currentStep === steps.TEACHER_REVIEW"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Review Student Submission</h2>
        <p class="text-gray-600 mb-6">The student has completed their work. Review the document and provide feedback.</p>
        
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div class="flex items-center space-x-2 mb-2">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="font-medium text-green-800">Student Work Completed</span>
          </div>
          <p class="text-sm text-green-700">The student has finished editing and submitted their assignment with a submission version saved.</p>
        </div>

        <div class="flex space-x-4">
          <button 
            @click="openDocumentForReview"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Open Document to Review
          </button>
          <button 
            @click="markReviewed"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Mark as Reviewed
          </button>
        </div>
        
        <!-- Version Creation Notice -->
        <div class="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-xs text-indigo-800">
              <strong>Note:</strong> Marking as reviewed will create a permanent "Review Complete" version in the document history.
            </span>
          </div>
        </div>
      </div>

      <!-- Step 5: Completed -->
      <div 
        v-if="currentStep === steps.COMPLETED"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="text-center py-8">
          <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Assignment Complete!</h3>
          <p class="text-gray-600 mb-6">The entire workflow has been completed successfully with full version history.</p>
          
          <!-- Version History Information -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div class="flex items-center space-x-2 mb-3">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span class="text-sm font-medium text-purple-800">Version History Created</span>
            </div>
            <div class="text-left text-sm text-purple-700">
              <p>📝 <strong>Submission Version:</strong> Created when student submitted work</p>
              <p>🎓 <strong>Review Complete Version:</strong> Created when teacher completed review</p>
              <p>📚 Both versions are permanently saved in document history</p>
            </div>
          </div>

          <div class="flex space-x-4 justify-center">
            <button 
              @click="resetFlow"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Start New Assignment
            </button>
            <button 
              @click="viewVersionHistory"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              View Version History
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { 
  currentStep, 
  selectedDoc, 
  taskData, 
  steps, 
  markTeacherReviewed,
  resetFlow,
  getStepInfo,
  getDocumentForReview 
} = useTaskFlow()

const stepInfo = computed(() => getStepInfo())

const openDocumentForReview = () => {
  const reviewUrl = getDocumentForReview()
  if (reviewUrl) {
    window.open(reviewUrl, '_blank')
  } else {
    alert('Document URL not available')
  }
}

const markReviewed = () => {
  console.log('Creating review completion version and finalizing document...')
  markTeacherReviewed()
}

const viewVersionHistory = () => {
  if (taskData.studentCopyId) {
    const { openVersionHistory } = useGoogleDrive()
    openVersionHistory(taskData.studentCopyId)
  } else {
    alert('Document not available for version history')
  }
}
</script>