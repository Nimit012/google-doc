<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Author View</h1>
      <p class="text-gray-600">Create and author tasks</p>
    </div>

    <!-- Step Content -->
    <div class="space-y-6">
      
      <!-- Single Document Header for all steps -->
      <div class="bg-white rounded-lg shadow-sm border">
        <!-- Document Header -->
        <div class="p-6 pb-0">
          <!-- Header -->
          <div class="flex items-center space-x-3 pb-4 border-b">
            <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <h1 class="text-lg font-semibold text-gray-900">WWII: Pacific and European Theaters</h1>
          </div>

          <!-- Tab Navigation -->
          <div class="border-b">
            <nav class="flex space-x-8">
              <button class="py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Metadata
              </button>
              <button class="py-3 text-sm font-medium text-green-600 border-b-2 border-green-600">
                Segments (1)
              </button>
              <button class="py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Student Preview
              </button>
            </nav>
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-6">
          <!-- Common Segment Content -->
          <div class="mb-3">
            <h3 class="text-sm text-gray-500 mb-2">Segment 1: Study Guide</h3>
            <div class="py-3">
              <h2 class="text-lg font-medium text-gray-900 mb-3">Block 1: Rich Text</h2>
              <blockquote class="text-gray-800 leading-relaxed">
                "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."
              </blockquote>
            </div>
          </div>

          <!-- Step 1: Add Block Button -->
          <div v-if="currentStep === steps.AUTHOR_ADD_DOC && !showDropdown && !showActivitySelector && !selectedDoc">
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

          <!-- Step 2: Dropdown Menu -->
          <div v-if="currentStep === steps.AUTHOR_ADD_DOC && showDropdown && !showActivitySelector && !selectedDoc">
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

          <!-- Step 3: Activity Selector -->
           <!-- Step 3: Activity Selector -->
<div v-if="currentStep === steps.AUTHOR_ADD_DOC && showActivitySelector && !selectedDoc && !isLoadingDocument">
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">Block 2: Activity</h3>
    
    <div class="bg-gray-50 rounded-lg p-6">
      <p class="text-sm text-gray-600 mb-6">Select the type of activity you wish to insert here.</p>
      
      <div class="grid grid-cols-4 gap-[6rem] mb-8">
        <!-- Quiz Section -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-4">Quiz:</h4>
          <div class="space-y-4">
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">Multiple Choice</div>
              <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </button>
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">True/False</div>
              <div class="text-lg font-bold text-gray-400">T/F</div>
            </button>
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">Fill In the Blanks</div>
              <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Open Ended Section -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-4">Open Ended:</h4>
          <div class="space-y-4">
            <button 
              @click="selectGoogleDocument"
              class="w-full p-4 border-2 border-purple-500 bg-purple-50 rounded-lg hover:bg-purple-100 focus:outline-none focus:border-purple-600 transition-colors text-center"
            >
              <div class="text-sm font-medium text-purple-700 mb-1">Shared Document</div>
              <svg class="w-8 h-8 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">Document Submission</div>
              <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Third Party Section -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-4">Third Party:</h4>
          <div class="space-y-4">
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">H5P</div>
              <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">Articulate</div>
              <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
            <button class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-center" disabled>
              <div class="text-sm font-medium text-gray-400 mb-1">...</div>
              <svg class="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center gap-4">

        <button 
          @click="selectGoogleDocument"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Select
        </button>
        <button 
          @click="cancelActivitySelection"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>



      <!-- Loading Step: Document Processing -->
      <div v-if="isLoadingDocument">
  <div>
    <h3 class="text-lg font-medium text-gray-900 mb-4">Block 2: Activity - Google Document</h3>
    
    <div class="bg-white rounded-lg p-8">
      <div class="flex flex-col items-center justify-center py-12">
        <!-- Spinner -->
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        
        <!-- Loading text -->
        <h4 class="text-lg font-medium text-gray-900 mb-2">Processing Document</h4>
        <p class="text-sm text-gray-600 text-center">
          Setting up your Google Document for the assignment...
        </p>
        
        <!-- Progress steps -->
        <div class="mt-6 space-y-2 text-sm text-gray-500">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Document selected</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Configuring permissions...</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
            <span>Ready for students</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

       

<!-- Step 4: Document Preview -->
<div v-if="(currentStep === steps.AUTHOR_ADD_DOC || currentStep === steps.AUTHOR_PREVIEW) && selectedDoc && !isLoadingDocument">
  <div>
    <div class="flex items-center mb-4 justify-start gap-2">
      <h3 class="text-lg font-medium text-gray-900">Block 2: Activity - Google Document</h3>
      <button 
        @click="toggleDocumentActions"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
      </button>
    </div>
    
    <div class="bg-white rounded-lg">
      <div class="flex items-start space-x-4 mb-4">
        <div class="flex-shrink-0">
          <h4 class="mb-2">Using the materials included, complete the activities in the Google Document below</h4>
          
          <!-- Use thumbnail instead of iframe -->
          <div v-if="selectedDoc.thumbnailLink" class="w-[10rem] h-[12rem] border border-gray-200 rounded overflow-hidden bg-gray-50">
          
            <img 
              :src="selectedDoc.thumbnailLink" 
              :alt="selectedDoc.name"
              class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              referrerpolicy="no-referrer"
            >
          </div>
          
          <!-- Fallback for when thumbnail fails or doesn't exist -->
          <div v-else class="w-[10rem] h-[12rem] bg-blue-50 border border-blue-200 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors" @click="openDocumentPreview">
            <svg class="w-10 h-10 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span class="text-xs text-blue-600 text-center px-2">{{ selectedDoc.name }}</span>
          </div>
        </div>
      </div>

      <!-- Document Actions - Only show when showDocumentActions is true -->
      <div v-if="showDocumentActions" class=" pt-4 mb-4">
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
         
          </div>
        </div>
      </div>
        <div >
            <div class="relative pt-4 mb-4 mt-8">
              <button 
                disabled
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
      <div class="border-t border-gray-200">
        <button 
              @click="makeAvailableToStudent"
              class="inline-flex items-center  mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Save
            </button>
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
          @document-loading="handleDocumentLoading"

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
const showDocumentActions = ref(false)

const stepInfo = computed(() => getStepInfo())


// Add this to your existing state variables
const isLoadingDocument = ref(false)



const openDocumentPreview = () => {
  if (selectedDoc.value?.url) {
    window.open(selectedDoc.value.url, '_blank')
  }
}

const handleThumbnailError = (event) => {
  console.warn('Thumbnail failed to load:', event)
  // You could set a flag here to show the fallback state
  // or try to refetch the thumbnail
}
// Handle final document confirmation (when loading is complete)
const handleDocumentLoading = (data) => {
  isLoadingDocument.value  = true;

}

// Handle document confirmation from AuthorDocPicker
const handleDocumentConfirmed = (docData) => {
 
   if (docData) {

    isLoadingDocument.value  = false;

    console.log('Author confirmed document for assignment:', docData)
    selectDocument(docData)
    
    // Reset UI state - hide activity selector since we have a document
    showActivitySelector.value = false
    showDropdown.value = false
  }
}




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


const toggleDocumentActions = () => {
  showDocumentActions.value = !showDocumentActions.value
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
onMounted( () => {
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