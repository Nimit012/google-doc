<template>
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold mb-4">Workflow Progress</h3>
      
      <div class="space-y-4">
        <div 
          v-for="(step, index) in flowSteps" 
          :key="step.key"
          class="flex items-center space-x-4"
        >
          <!-- Step indicator -->
          <div class="flex-shrink-0">
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                getStepClass(step.key, index)
              ]"
            >
              <span v-if="isStepComplete(step.key, index)">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </span>
              <span v-else-if="isCurrentStep(step.key)">
                <div class="w-2 h-2 bg-current rounded-full"></div>
              </span>
              <span v-else>{{ index + 1 }}</span>
            </div>
          </div>
  
          <!-- Step content -->
          <div class="flex-grow">
            <div class="flex items-center space-x-2">
              <h4 
                :class="[
                  'text-sm font-medium',
                  isCurrentStep(step.key) ? 'text-gray-900' : 'text-gray-600'
                ]"
              >
                {{ step.title }}
              </h4>
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  step.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                ]"
              >
                {{ step.role }}
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ step.description }}</p>
          </div>
  
          <!-- Connection line -->
          <div 
            v-if="index < flowSteps.length - 1"
            class="absolute left-4 mt-8 w-px h-6 bg-gray-200"
            style="margin-left: 16px;"
          ></div>
        </div>
      </div>
  
      <div class="mt-6 pt-4 border-t">
        <div class="flex items-center justify-between text-sm">
          <div class="text-gray-600">
            Current: <span class="font-medium">{{ getCurrentStepTitle() }}</span>
          </div>
          <div class="text-gray-500">
            {{ getCompletedStepsCount() }} of {{ flowSteps.length }} steps completed
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const { currentStep, steps } = useTaskFlow()
  
  const flowSteps = [
    {
      key: steps.TEACHER_ADD_DOC,
      title: 'Add Document',
      description: 'Teacher selects Google Doc',
      role: 'teacher'
    },
    {
      key: steps.TEACHER_PREVIEW,
      title: 'Setup Preview',
      description: 'Review document and prepare',
      role: 'teacher'
    },
    {
      key: steps.STUDENT_START,
      title: 'Student Start',
      description: 'Student begins assignment',
      role: 'student'
    },
    {
      key: steps.STUDENT_WORKING,
      title: 'Student Work',
      description: 'Editing document',
      role: 'student'
    },
    {
      key: steps.STUDENT_COMPLETE,
      title: 'Submit Work',
      description: 'Student completes assignment',
      role: 'student'
    },
    {
      key: steps.TEACHER_REVIEW,
      title: 'Teacher Review',
      description: 'Review and grade work',
      role: 'teacher'
    },
    {
      key: steps.COMPLETED,
      title: 'Completed',
      description: 'Process finished',
      role: 'both'
    }
  ]
  
  const getCurrentStepIndex = () => {
    return flowSteps.findIndex(step => step.key === currentStep.value)
  }
  
  const isCurrentStep = (stepKey) => {
    return currentStep.value === stepKey
  }
  
  const isStepComplete = (stepKey, index) => {
    const currentIndex = getCurrentStepIndex()
    return currentIndex > index
  }
  
  const getStepClass = (stepKey, index) => {
    const currentIndex = getCurrentStepIndex()
    
    if (currentIndex > index) {
      // Completed step
      return 'bg-green-500 text-white'
    } else if (currentIndex === index) {
      // Current step
      return 'bg-blue-500 text-white'
    } else {
      // Future step
      return 'bg-gray-200 text-gray-600'
    }
  }
  
  const getCurrentStepTitle = () => {
    const current = flowSteps.find(step => step.key === currentStep.value)
    return current ? current.title : 'Unknown'
  }
  
  const getCompletedStepsCount = () => {
    const currentIndex = getCurrentStepIndex()
    return Math.max(0, currentIndex)
  }
  </script>