// Global state (singleton pattern)
const globalCurrentStep = ref('author_add_doc')
const globalSelectedDoc = ref(null)
const globalTaskData = ref({
  id: 'task-001',
  title: 'Essay Assignment',
  description: 'Write a 500-word essay on your chosen topic',
  originalDocId: null,
  originalDocUrl: null,
  studentCopyId: null,
  studentCopyUrl: null,
  authorEmail: 'author@example.com',
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
    AUTHOR_ADD_DOC: 'author_add_doc',
    AUTHOR_PREVIEW: 'author_preview',
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
    if (doc === null) {
      // Handle null case - reset document selection
      selectedDoc.value = null
      taskData.value.originalDocId = null
      taskData.value.originalDocUrl = null
      taskData.value.metadata = null
      // Stay in AUTHOR_ADD_DOC step for re-selection
      nextStep(steps.AUTHOR_ADD_DOC)
      return
    }

    // Handle valid document selection
    selectedDoc.value = doc
    taskData.value.originalDocId = doc.id
    taskData.value.originalDocUrl = doc.url
    nextStep(steps.AUTHOR_PREVIEW)
  }

  // Add a specific method to clear document selection
  const clearDocumentSelection = () => {
    selectedDoc.value = null
    taskData.value.originalDocId = null
    taskData.value.originalDocUrl = null
    taskData.value.metadata = null
    nextStep(steps.AUTHOR_ADD_DOC)
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
    currentStep.value = steps.AUTHOR_ADD_DOC
    selectedDoc.value = null
    taskData.value = {
      id: 'task-001',
      title: 'Essay Assignment',
      description: 'Write a 500-word essay on your chosen topic',
      originalDocId: null,
      originalDocUrl: null,
      studentCopyId: null,
      studentCopyUrl: null,
      authorEmail: 'author@example.com',
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
      [steps.AUTHOR_ADD_DOC]: {
        title: 'Add Document',
        description: 'Author selects a Google Doc for the assignment',
        role: 'author'
      },
      [steps.AUTHOR_PREVIEW]: {
        title: 'Preview & Setup',
        description: 'Author reviews document and prepares for students',
        role: 'author'
      },
      [steps.STUDENT_START]: {
        title: 'Start Assignment',
        description: 'Student begins working on the assignment',
        role: 'student'
      },
      [steps.STUDENT_WORKING]: {
        title: 'Working on Assignment',
        description: 'Student completes work in the document',
        role: 'student'
      },
      [steps.STUDENT_COMPLETE]: {
        title: 'Assignment Submitted',
        description: 'Waiting for teacher review',
        role: 'student'
      },
      [steps.TEACHER_REVIEW]: {
        title: 'Review Submission',
        description: 'Teacher reviews and grades student work',
        role: 'teacher'
      },
      [steps.COMPLETED]: {
        title: 'Completed',
        description: 'Assignment process finished',
        role: 'all'
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
    clearDocumentSelection,
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