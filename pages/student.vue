<template>
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p class="text-gray-600">Access your assignments and submit completed work</p>
      </div>
  
      <!-- Flow Status -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Current Step</h2>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              stepInfo.role === 'student' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ stepInfo.role === 'student' ? 'Your Turn' : 'Waiting for Teacher' }}
          </span>
        </div>
        <h3 class="font-medium text-gray-900 mb-1">{{ stepInfo.title }}</h3>
        <p class="text-sm text-gray-600">{{ stepInfo.description }}</p>
      </div>
  
      <!-- Step Content -->
      <div class="space-y-6">
  
        <!-- Waiting for Teacher Setup -->
        <div 
          v-if="currentStep === steps.TEACHER_ADD_DOC || currentStep === steps.TEACHER_PREVIEW"
          class="bg-white rounded-lg shadow-sm border p-6"
        >
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Waiting for Teacher</h3>
            <p class="text-gray-600 mb-4">Your teacher is currently setting up the assignment.</p>
            <p class="text-sm text-gray-500">You'll be able to start once the teacher completes the setup.</p>
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
  
        <!-- Step 1: Start Assignment -->
        <div 
          v-if="currentStep === steps.STUDENT_START"
          class="bg-white rounded-lg shadow-sm border p-6"
        >
          <h2 class="text-xl font-semibold mb-4">Start Assignment</h2>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="font-medium text-green-800">Assignment Ready</span>
            </div>
            <p class="text-sm text-green-700">Your teacher has prepared an assignment for you to complete.</p>
          </div>
  
          <div class="space-y-4 mb-6">
            <div class="border rounded-lg p-4">
              <h3 class="font-medium text-gray-900 mb-2">{{ taskData.title }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ taskData.description }}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>📄 Google Docs</span>
                <span>⏱️ No time limit</span>
              </div>
            </div>
          </div>
  
          <button 
            @click="startAssignment"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a4 4 0 118 0v2"></path>
            </svg>
            Start Working
          </button>
          
          <div class="mt-4 text-sm text-gray-500">
            <p>📝 A copy of the document will be created for you to edit</p>
            <p>🔒 The document will open in a new tab with editing permissions</p>
          </div>
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
                @click="openDocumentToEdit"
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
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mark as Complete
            </button>
            <span class="text-sm text-gray-500">Click when you've finished your work</span>
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
  
            <p class="text-sm text-gray-500">You no longer have editing access to the document. Your teacher will review and provide feedback.</p>
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
              <h4 class="font-medium text-gray-900 mb-2">Final Status:</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Work submitted</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Teacher reviewed</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Process complete</span>
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
  const { 
    currentStep, 
    taskData, 
    steps, 
    startStudentTask,
    markStudentComplete,
    resetFlow,
    getStepInfo 
  } = useTaskFlow()
  
  const stepInfo = computed(() => getStepInfo())
  
  const startAssignment = () => {
    console.log('Creating document copy and granting student access...')
    // This will later integrate with Google Drive API to:
    // 1. Create a copy of the document
    // 2. Grant editing access to student
    // 3. Set admin as owner
    alert('Document copy created! Opening in new tab...')
    
    // Simulate opening document in new tab
    setTimeout(() => {
      startStudentTask()
    }, 1000)
  }
  
  const openDocumentToEdit = () => {
    console.log('Opening document for editing...')
    alert('Document would open in new tab for editing')
  }
  
  const markComplete = () => {
    console.log('Removing student editing access and transferring to teacher...')
    // This will later integrate with Google Drive API to:
    // 1. Remove editing access from student
    // 2. Grant editing access to teacher
    alert('Assignment submitted! Editing access removed.')
    markStudentComplete()
  }
  </script>