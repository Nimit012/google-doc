// Global state (singleton pattern)
const globalCurrentStep = ref('teacher_add_doc')
const globalSelectedDoc = ref(null)
const globalTaskData = ref({
  id: 'task-001',
  title: 'Essay Assignment',
  description: 'Write a 500-word essay on your chosen topic',
  originalDocId: null,
  originalDocUrl: null,
  studentCopyId: null,
  studentCopyUrl: null,
  studentEmail: 'student@example.com',
  teacherEmail: 'teacher@example.com',
  status: 'draft',
  createdAt: new Date().toISOString(),
  metadata: null
})

export const useTaskFlow = () => {
  // Use global state instead of local refs
  const currentStep = globalCurrentStep
  const selectedDoc = globalSelectedDoc
  const taskData = globalTaskData

  // Flow steps
  const steps = {
    TEACHER_ADD_DOC: 'teacher_add_doc',
    TEACHER_PREVIEW: 'teacher_preview', 
    STUDENT_START: 'student_start',
    STUDENT_WORKING: 'student_working',
    STUDENT_COMPLETE: 'student_complete',
    TEACHER_REVIEW: 'teacher_review',
    COMPLETED: 'completed'
  }

  // Step progression logic
  const nextStep = (step) => {
    console.log(`🔄 Step transition: ${currentStep.value} → ${step}`)
    currentStep.value = step
    console.log(`✅ Current step is now: ${currentStep.value}`)
    
    // Force reactivity update
    nextTick(() => {
      console.log(`🔍 After nextTick, currentStep: ${currentStep.value}`)
    })
  }

  // Actions for each step with Google Drive integration
  const selectDocument = (doc) => {
    selectedDoc.value = doc
    taskData.value.originalDocId = doc.id
    taskData.value.originalDocUrl = doc.url
    nextStep(steps.TEACHER_PREVIEW)
  }

  const createStudentPreview = () => {
    nextStep(steps.STUDENT_START)
  }

  const startStudentTask = async (copyData) => {
    // Update task data with copy information
    if (copyData) {
      taskData.value.studentCopyId = copyData.copiedDocId
      taskData.value.studentCopyUrl = copyData.docUrl
      taskData.value.metadata = copyData.metadata
    }
    taskData.value.status = 'in_progress'
    nextStep(steps.STUDENT_WORKING)
  }

  const markStudentComplete = async () => {
    try {
      // Use Google Drive composable to transfer permissions
      const { transferToTeacher } = useGoogleDrive()
      
      if (taskData.value.studentCopyId) {
        await transferToTeacher(
          taskData.value.studentCopyId,
          taskData.value.teacherEmail,
          taskData.value.studentEmail
        )
      }
      
      taskData.value.status = 'student_complete'
      nextStep(steps.TEACHER_REVIEW)
    } catch (error) {
      console.error('Failed to transfer document to teacher:', error)
      // Continue with flow even if API call fails (for demo purposes)
      taskData.value.status = 'student_complete'
      nextStep(steps.TEACHER_REVIEW)
    }
  }

  const startTeacherReview = () => {
    nextStep(steps.TEACHER_REVIEW)
  }

  const markTeacherReviewed = async () => {
    try {
      // Use Google Drive composable to finalize document
      const { finalizeDocument } = useGoogleDrive()
      
      if (taskData.value.studentCopyId) {
        await finalizeDocument(
          taskData.value.studentCopyId,
          taskData.value.teacherEmail
        )
      }
      
      taskData.value.status = 'completed'
      nextStep(steps.COMPLETED)
    } catch (error) {
      console.error('Failed to finalize document:', error)
      // Continue with flow even if API call fails (for demo purposes)
      taskData.value.status = 'completed'
      nextStep(steps.COMPLETED)
    }
  }

  const resetFlow = () => {
    currentStep.value = steps.TEACHER_ADD_DOC
    selectedDoc.value = null
    taskData.value = {
      id: 'task-001',
      title: 'Essay Assignment',
      description: 'Write a 500-word essay on your chosen topic',
      originalDocId: null,
      originalDocUrl: null,
      studentCopyId: null,
      studentCopyUrl: null,
      studentEmail: 'student@example.com',
      teacherEmail: 'teacher@example.com',
      status: 'draft',
      createdAt: new Date().toISOString(),
      metadata: null
    }
    console.log('Flow reset to:', currentStep.value)
  }

  // Helper to get current step info
  const getStepInfo = () => {
    const stepInfo = {
      [steps.TEACHER_ADD_DOC]: {
        title: 'Add Document',
        description: 'Select a Google Doc for the assignment',
        role: 'teacher'
      },
      [steps.TEACHER_PREVIEW]: {
        title: 'Preview & Setup',
        description: 'Review document and prepare for students',
        role: 'teacher'
      },
      [steps.STUDENT_START]: {
        title: 'Start Assignment',
        description: 'Begin working on the assignment',
        role: 'student'
      },
      [steps.STUDENT_WORKING]: {
        title: 'Working on Assignment',
        description: 'Complete your work in the document',
        role: 'student'
      },
      [steps.STUDENT_COMPLETE]: {
        title: 'Assignment Submitted',
        description: 'Waiting for teacher review',
        role: 'student'
      },
      [steps.TEACHER_REVIEW]: {
        title: 'Review Submission',
        description: 'Review and grade student work',
        role: 'teacher'
      },
      [steps.COMPLETED]: {
        title: 'Completed',
        description: 'Assignment process finished',
        role: 'both'
      }
    }
    
    return stepInfo[currentStep.value] || { title: 'Unknown', description: '', role: 'unknown' }
  }

  // Google Drive integration helpers
  const openStudentDocument = () => {
    if (taskData.value.studentCopyUrl) {
      window.open(taskData.value.studentCopyUrl, '_blank')
    } else {
      console.warn('Student document URL not available')
    }
  }

  const openOriginalDocument = () => {
    if (taskData.value.originalDocUrl) {
      window.open(taskData.value.originalDocUrl, '_blank')
    } else {
      console.warn('Original document URL not available')
    }
  }

  const getDocumentForReview = () => {
    return taskData.value.studentCopyUrl || taskData.value.originalDocUrl
  }

  // Update task configuration
  const updateTaskInfo = (newTaskInfo) => {
    Object.assign(taskData.value, newTaskInfo)
  }

  const updateUserEmails = (studentEmail, teacherEmail) => {
    if (studentEmail) taskData.value.studentEmail = studentEmail
    if (teacherEmail) taskData.value.teacherEmail = teacherEmail
  }

  return {
    // State (now global and reactive across components)
    currentStep,
    selectedDoc,
    taskData,
    steps,
    
    // Flow control methods
    nextStep,
    selectDocument,
    createStudentPreview,
    startStudentTask,
    markStudentComplete,
    startTeacherReview,
    markTeacherReviewed,
    resetFlow,
    
    // Helper methods
    getStepInfo,
    openStudentDocument,
    openOriginalDocument,
    getDocumentForReview,
    updateTaskInfo,
    updateUserEmails
  }
}