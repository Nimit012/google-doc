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
      
      <!-- Step 1: Add Document -->
      <div 
        v-if="currentStep === steps.TEACHER_ADD_DOC || currentStep === steps.TEACHER_PREVIEW"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <TeacherDocPicker 
          @document-confirmed="handleDocumentConfirmed"
        />
      </div>

      <!-- Step 3: Waiting for Student -->
      <div 
        v-if="currentStep === steps.STUDENT_START || currentStep === steps.STUDENT_WORKING || currentStep === steps.STUDENT_COMPLETE"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Student Progress</h2>
        
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
            <span class="text-sm">Assignment submitted and ready for review</span>
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
          <p class="text-sm text-green-700">The student has finished editing and submitted their assignment.</p>
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
          <p class="text-gray-600 mb-6">The entire workflow has been completed successfully.</p>
          <button 
            @click="resetFlow"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Start New Assignment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TeacherDocPicker from '~/components/TaskFlow/TeacherDocPicker.vue'

const { 
  currentStep, 
  selectedDoc, 
  taskData, 
  steps, 
  selectDocument, 
  createStudentPreview, 
  markTeacherReviewed,
  resetFlow,
  getStepInfo,
  getDocumentForReview 
} = useTaskFlow()

const stepInfo = computed(() => getStepInfo())

const handleDocumentConfirmed = (docData) => {
  console.log('Document confirmed for task:', docData)
  selectDocument(docData)
  // Automatically move to student preview step
  setTimeout(() => {
    createStudentPreview()
  }, 1000)
}
  // Handle any additional logic if needed when document is copied from picker


const openDocumentForReview = () => {
  const reviewUrl = getDocumentForReview()
  if (reviewUrl) {
    window.open(reviewUrl, '_blank')
  } else {
    alert('Document URL not available')
  }
}
</script>