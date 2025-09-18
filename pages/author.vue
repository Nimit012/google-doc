<template>
    <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Author Dashboard</h1>
        <p class="text-gray-600">Create and setup assignments for students</p>
      </div>
  
      <!-- Flow Status -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Current Step</h2>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              stepInfo.role === 'author' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ stepInfo.role === 'author' ? 'Your Turn' : 'Waiting for Others' }}
          </span>
        </div>
        <h3 class="font-medium text-gray-900 mb-1">{{ stepInfo.title }}</h3>
        <p class="text-sm text-gray-600">{{ stepInfo.description }}</p>
      </div>
  
      <!-- Step Content -->
      <div class="space-y-6">
        
        <!-- Step 1: Add Document & Step 2: Preview -->
        <div 
          v-if="currentStep === steps.AUTHOR_ADD_DOC || currentStep === steps.AUTHOR_PREVIEW"
          class="bg-white rounded-lg shadow-sm border p-6"
        >
          <AuthorDocPicker 
            @document-confirmed="handleDocumentConfirmed"
          />
        </div>
  
        <!-- Step 3+: Waiting for Student and Teacher -->
        <div 
          v-if="currentStep === steps.STUDENT_START || currentStep === steps.STUDENT_WORKING || currentStep === steps.STUDENT_COMPLETE || currentStep === steps.TEACHER_REVIEW"
          class="bg-white rounded-lg shadow-sm border p-6"
        >
          <h2 class="text-xl font-semibold mb-4">Assignment Progress</h2>
          
          <div class="space-y-4">
            <!-- Student Progress -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 class="font-medium text-green-800 mb-2">Student Progress</h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <div 
                    :class="[
                      'w-3 h-3 rounded-full',
                      currentStep === steps.STUDENT_START ? 'bg-yellow-400' : 'bg-green-500'
                    ]"
                  ></div>
                  <span class="text-sm text-green-700">
                    {{ currentStep === steps.STUDENT_START ? 'Student can now start the assignment' : 'Student has started working' }}
                  </span>
                </div>
                
                <div 
                  v-if="currentStep === steps.STUDENT_WORKING || currentStep === steps.STUDENT_COMPLETE || currentStep === steps.TEACHER_REVIEW"
                  class="flex items-center space-x-3"
                >
                  <div 
                    :class="[
                      'w-3 h-3 rounded-full',
                      currentStep === steps.STUDENT_WORKING ? 'bg-yellow-400' : 'bg-green-500'
                    ]"
                  ></div>
                  <span class="text-sm text-green-700">
                    {{ currentStep === steps.STUDENT_WORKING ? 'Student is currently editing the document' : 'Student has completed the assignment' }}
                  </span>
                </div>
  
                <div 
                  v-if="currentStep === steps.STUDENT_COMPLETE || currentStep === steps.TEACHER_REVIEW"
                  class="flex items-center space-x-3"
                >
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  <span class="text-sm text-green-700">Assignment submitted with version saved</span>
                </div>
              </div>
            </div>
  
            <!-- Teacher Progress -->
            <div 
              v-if="currentStep === steps.TEACHER_REVIEW"
              class="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <h3 class="font-medium text-blue-800 mb-2">Teacher Review</h3>
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-sm text-blue-700">Teacher is currently reviewing student work</span>
              </div>
            </div>
          </div>
  
          <div class="mt-6 pt-4 border-t">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 mb-2">Student can continue work:</p>
                <NuxtLink 
                  to="/student"
                  class="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Go to Student Dashboard →
                </NuxtLink>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-2">Teacher can review work:</p>
                <NuxtLink 
                  to="/teacher"
                  class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Go to Teacher Dashboard →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Step 4: Completed -->
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
            
            <!-- Assignment Summary -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div class="flex items-center space-x-2 mb-3">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-sm font-medium text-purple-800">Assignment Summary</span>
              </div>
              <div class="text-left text-sm text-purple-700">
                <p>📝 <strong>Document Created:</strong> {{ selectedDoc?.name || 'Assignment Document' }}</p>
                <p>🎓 <strong>Student Completed:</strong> Work submitted with version saved</p>
                <p>👨‍🏫 <strong>Teacher Reviewed:</strong> Final review completed</p>
                <p>📚 Complete audit trail maintained in document history</p>
              </div>
            </div>
  
            <div class="flex space-x-4 justify-center">
              <button 
                @click="resetFlow"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Create New Assignment
              </button>
              <button 
                @click="viewVersionHistory"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
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
  import AuthorDocPicker from '~/components/TaskFlow/AuthorDocPicker.vue'
  
  const { 
    currentStep, 
    selectedDoc, 
    taskData, 
    steps, 
    selectDocument, 
    createStudentPreview, 
    resetFlow,
    getStepInfo
  } = useTaskFlow()
  
  const stepInfo = computed(() => getStepInfo())
  
  const handleDocumentConfirmed = (docData) => {
    console.log('Author confirmed document for assignment:', docData)
    selectDocument(docData)
    // Automatically move to student start step
    setTimeout(() => {
      createStudentPreview()
    }, 1000)
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