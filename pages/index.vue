<template>
    <div class="text-center">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Google Drive Task Flow
        </h1>
        <p class="text-lg text-gray-600 mb-12">
          Demonstration of teacher-student document workflow with Google Drive integration
        </p>
  
        <!-- Current Flow Status -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Current Flow Status</h2>
          <div class="flex items-center justify-center space-x-4">
            <div class="flex items-center space-x-2">
              <div 
                :class="[
                  'w-3 h-3 rounded-full',
                  stepInfo.role === 'teacher' || stepInfo.role === 'both' 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300'
                ]"
              ></div>
              <span class="text-sm text-gray-600">Teacher</span>
            </div>
            <div class="w-8 h-px bg-gray-300"></div>
            <div class="flex items-center space-x-2">
              <div 
                :class="[
                  'w-3 h-3 rounded-full',
                  stepInfo.role === 'student' || stepInfo.role === 'both' 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                ]"
              ></div>
              <span class="text-sm text-gray-600">Student</span>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="font-medium text-gray-900">{{ stepInfo.title }}</h3>
            <p class="text-sm text-gray-600">{{ stepInfo.description }}</p>
          </div>
        </div>
  
        <!-- Role Selection -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Teacher Card -->
          <NuxtLink 
            to="/teacher"
            class="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6 text-left"
          >
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Teacher Dashboard
                </h3>
                <p class="text-sm text-gray-600">Manage assignments and review student work</p>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              • Add Google Docs to assignments<br>
              • Review student submissions<br>
              • Manage document permissions
            </div>
          </NuxtLink>
  
          <!-- Student Card -->
          <NuxtLink 
            to="/student"
            class="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6 text-left"
          >
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Student Dashboard  
                </h3>
                <p class="text-sm text-gray-600">Access assignments and submit completed work</p>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              • Start assigned tasks<br>
              • Edit documents in Google Drive<br>
              • Submit completed assignments
            </div>
          </NuxtLink>
        </div>
  
        <!-- Task Details -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 class="text-xl font-semibold mb-4">Current Task</h2>
          <div class="text-left max-w-md mx-auto">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-600">Task ID:</span>
                <span class="text-sm text-gray-900">{{ taskData.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-600">Title:</span>
                <span class="text-sm text-gray-900">{{ taskData.title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-600">Status:</span>
                <span 
                  :class="[
                    'text-sm px-2 py-1 rounded-full text-xs font-medium',
                    getStatusColor(taskData.status)
                  ]"
                >
                  {{ taskData.status.replace('_', ' ').toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const { taskData, getStepInfo } = useTaskFlow()
  
  const stepInfo = computed(() => getStepInfo())
  
  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      student_complete: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  </script>