<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Author View</h1>
      <p class="text-gray-600">Create and author tasks</p>
    </div>

    <!-- Step Content -->
    <div class="space-y-6">
      
      <!-- Step 1: Initial Content with Add Block (when no document selected) -->
      <div 
        v-if="currentStep === steps.AUTHOR_ADD_DOC && !showDropdown && !showActivitySelector && !selectedDoc"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="mb-6">
          <h3 class="text-sm text-gray-500 mb-2">Segment 1: Study Guide</h3>
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <h2 class="text-lg font-medium text-gray-900 mb-3">Block 1: Rich Text</h2>
            <blockquote class="text-gray-800 leading-relaxed">
              "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."
            </blockquote>
          </div>
          
          <!-- Add Block Button -->
          <div class="relative">
            <button 
              @click="toggleDropdown"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Block
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Dropdown Menu -->
      <div 
        v-if="currentStep === steps.AUTHOR_ADD_DOC && showDropdown && !showActivitySelector && !selectedDoc"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="mb-6">
          <h3 class="text-sm text-gray-500 mb-2">Segment 1: Study Guide</h3>
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <h2 class="text-lg font-medium text-gray-900 mb-3">Block 1: Rich Text</h2>
            <blockquote class="text-gray-800 leading-relaxed">
              "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."
            </blockquote>
          </div>
          
          <!-- Add Block Dropdown -->
          <div class="relative">
            <button 
              @click="toggleDropdown"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Block
              <svg class="w-4 h-4 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div class="py-1">
                <button 
                  @click="selectRichText"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                  </svg>
                  Rich Text
                </button>
                <button 
                  @click="selectActivity"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Activity
                </button>
                <button 
                  @click="selectVideo"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h2m4 0h2M9 7a3 3 0 00-3 3v8a2 2 0 002 2h8a2 2 0 002-2V10a3 3 0 00-3-3H9z"></path>
                  </svg>
                  Video
                </button>
                <div class="border-t border-gray-100 my-1"></div>
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-500 cursor-default">
                  <span class="text-xs">more...</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Activity Selector -->
      <div 
        v-if="currentStep === steps.AUTHOR_ADD_DOC && showActivitySelector && !selectedDoc"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="mb-6">
          <h3 class="text-sm text-gray-500 mb-2">Segment 1: Study Guide</h3>
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <h2 class="text-lg font-medium text-gray-900 mb-3">Block 1: Rich Text</h2>
            <blockquote class="text-gray-800 leading-relaxed">
              "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."
            </blockquote>
          </div>
          
          <!-- Activity Selection -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Block 2: Activity</h3>
            
            <div class="bg-gray-50 rounded-lg p-6">
              <p class="text-sm text-gray-600 mb-4">Select the type of activity you wish to insert here.</p>
              
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <!-- Quiz Section -->
                <div class="text-center">
                  <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide">Quiz:</p>
                  <div class="space-y-2">
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <div class="text-sm font-medium text-gray-400">Multiple Choice</div>
                      <div class="text-xs text-gray-400">MC</div>
                    </button>
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <div class="text-sm font-medium text-gray-400">True/False</div>
                      <div class="text-xs text-gray-400">T/F</div>
                    </button>
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <div class="text-sm font-medium text-gray-400">Fill in the Blanks</div>
                      <div class="text-xs text-gray-400">F</div>
                    </button>
                  </div>
                </div>
                
                <!-- Open Ended Section -->
                <div class="text-center">
                  <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide">Open Ended:</p>
                  <div class="space-y-2">
                    <button 
                      @click="selectGoogleDocument"
                      class="w-full p-3 border-2 border-purple-500 bg-purple-50 rounded-lg hover:bg-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <div class="text-sm font-medium text-purple-700">Shared Document</div>
                      <svg class="w-6 h-6 mx-auto mt-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <div class="text-sm font-medium text-gray-400">Document Template</div>
                      <svg class="w-6 h-6 mx-auto mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                
                  </div>
                </div>
                
                <!-- Third Party Section -->
                <div class="text-center">
                  <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide">Third Party:</p>
                  <div class="space-y-2">
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <div class="text-sm font-medium text-gray-400">Articulate</div>
                      <svg class="w-6 h-6 mx-auto mt-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                    <button class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center">
                <button 
                  @click="cancelActivitySelection"
                  class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Document Preview (using existing AuthorDocPicker logic) -->
      <div 
        v-if="(currentStep === steps.AUTHOR_ADD_DOC || currentStep === steps.AUTHOR_PREVIEW) && selectedDoc"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="mb-6">
          <h3 class="text-sm text-gray-500 mb-2">Segment 1: Study Guide</h3>
          <div class="bg-gray-50 rounded-lg p-6 mb-4">
            <h2 class="text-lg font-medium text-gray-900 mb-3">Block 1: Rich Text</h2>
            <blockquote class="text-gray-800 leading-relaxed">
              "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."
            </blockquote>
          </div>
          
          <!-- Document Preview -->
          <div class="px-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Block 2: Activity - Google Document</h3>
            
            <!-- Document Preview Card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <div class="flex items-start space-x-4 mb-4">
                <!-- Document Thumbnail -->
                <div class="flex-shrink-0">
                  <h4 class="mb-2">Using the materials included, complete the activities in the Google Document below</h4>
                  <div v-if="selectedDoc.thumbnailLink " class="w-[10rem] h-[12rem] border border-gray-200 rounded overflow-hidden">
                    <image 
                      :src="selectedDoc.thumbnailLink"
                      :title="selectedDoc.name"
                      class="w-full h-full border-0"
                      frameborder="0"
                    />
                  </div>
                  <div v-else class="w-20 h-24 bg-blue-50 border border-blue-200 rounded flex items-center justify-center">
                    <svg class="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                </div>
      
              </div>

              <!-- Document Actions -->
              <div class="border-t border-gray-200 pt-4">
                <div class="flex items-center justify-between">
                  <div class="flex space-x-3">
                    <a 
                      :href="selectedDoc.url" 
                      target="_blank"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Open Document
                    </a>
                    <button 
                      @click="changeDocument"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Change Document
                    </button>
                    <button 
                      @click="makeAvailableToStudent"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Make Available to Student
                    </button>
                  </div>
                  
                  <!-- Status indicator -->
                  <div class="flex items-center text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Ready for students
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden AuthorDocPicker for actual functionality -->
      <div style="display: none;">
        <AuthorDocPicker 
          ref="authorDocPickerRef"
          @document-confirmed="handleDocumentConfirmed"
        />
      </div>

      <!-- Rest of the existing flow states... -->
      <!-- Step 3+: Waiting for Student and Teacher -->
      <div 
        v-if="currentStep === steps.STUDENT_START || currentStep === steps.STUDENT_WORKING || currentStep === steps.STUDENT_COMPLETE || currentStep === steps.TEACHER_REVIEW"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Task Progress</h2>
        
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
                  {{ currentStep === steps.STUDENT_START ? 'Student can now start the task' : 'Student has started working' }}
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
            <div v-if="currentStep === steps.STUDENT_START" >
              <p class="text-sm text-gray-500 mb-2">Student can continue work:</p>
              <NuxtLink 
                to="/student"
                class="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Go to Student Dashboard →
              </NuxtLink>
            </div>
            <div v-if="currentStep === steps.TEACHER_REVIEW">
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
  clearDocumentSelection, 
  createStudentPreview, 
  resetFlow,
  getStepInfo
} = useTaskFlow()

// New UI state
const showDropdown = ref(false)
const showActivitySelector = ref(false)
const authorDocPickerRef = ref(null)

const stepInfo = computed(() => getStepInfo())

// UI interaction methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectRichText = () => {
  // This would add a rich text block - for now just close dropdown
  showDropdown.value = false
  alert('Rich Text blocks not yet implemented')
}

const selectActivity = () => {
  showDropdown.value = false
  showActivitySelector.value = true
}

const selectVideo = () => {
  showDropdown.value = false
  alert('Video blocks not yet implemented')
}

const selectGoogleDocument = () => {
  // Trigger the hidden AuthorDocPicker to open Google Drive picker
  if (authorDocPickerRef.value) {
    // Use the exposed method to trigger picker
    authorDocPickerRef.value.triggerPicker()
  }
}

const cancelActivitySelection = () => {
  showActivitySelector.value = false
  showDropdown.value = false
}

const changeDocument = () => {
  // Reset the AuthorDocPicker component first
  if (authorDocPickerRef.value) {
    authorDocPickerRef.value.resetSelection()
  }
  
  // Clear document selection in useTaskFlow (this will set currentStep back to AUTHOR_ADD_DOC)
  clearDocumentSelection()
  
  // Reset UI state to show activity selector again
  showActivitySelector.value = true
  showDropdown.value = false
}

// NEW METHOD: Make assignment available to student
const makeAvailableToStudent = () => {
  createStudentPreview()
}

// Handle document confirmation from AuthorDocPicker
const handleDocumentConfirmed = (docData) => {
  if (docData) {
    console.log('Author confirmed document for assignment:', docData)
    selectDocument(docData)
    
    // Reset UI state - hide activity selector since we have a document
    showActivitySelector.value = false
    showDropdown.value = false
  }
}

const viewVersionHistory = () => {
  if (taskData.studentCopyId) {
    const { openVersionHistory } = useGoogleDrive()
    openVersionHistory(taskData.studentCopyId)
  } else {
    alert('Document not available for version history')
  }
}

// Click outside to close dropdown
onMounted(() => {
  const handleClickOutside = (event) => {
    if (showDropdown.value && !event.target.closest('.relative')) {
      showDropdown.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

</script>