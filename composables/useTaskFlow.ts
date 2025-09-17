export const useTaskFlow = () => {
    // Current step in the flow
    const currentStep = ref('teacher_add_doc')
    
    // Selected document data
    const selectedDoc = ref(null)
    
    // Task data
    const taskData = ref({
      id: 'task-001',
      title: 'Essay Assignment',
      description: 'Write a 500-word essay on your chosen topic',
      docId: null,
      docUrl: null,
      studentCopyId: null,
      status: 'draft',
      createdAt: new Date().toISOString()
    })
  
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
      currentStep.value = step
      console.log(`Moving to step: ${step}`)
    }
  
    // Actions for each step
    const selectDocument = (doc) => {
      selectedDoc.value = doc
      taskData.value.docId = doc.id
      taskData.value.docUrl = doc.webViewLink
      nextStep(steps.TEACHER_PREVIEW)
    }
  
    const createStudentPreview = () => {
      nextStep(steps.STUDENT_START)
    }
  
    const startStudentTask = () => {
      // Here we'll integrate Google API to create copy
      taskData.value.status = 'in_progress'
      nextStep(steps.STUDENT_WORKING)
    }
  
    const markStudentComplete = () => {
      taskData.value.status = 'student_complete'
      nextStep(steps.TEACHER_REVIEW)
    }
  
    const startTeacherReview = () => {
      nextStep(steps.TEACHER_REVIEW)
    }
  
    const markTeacherReviewed = () => {
      taskData.value.status = 'completed'
      nextStep(steps.COMPLETED)
    }
  
    const resetFlow = () => {
      currentStep.value = steps.TEACHER_ADD_DOC
      selectedDoc.value = null
      taskData.value = {
        id: 'task-001',
        title: 'Essay Assignment',
        description: 'Write a 500-word essay on your chosen topic',
        docId: null,
        docUrl: null,
        studentCopyId: null,
        status: 'draft',
        createdAt: new Date().toISOString()
      }
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
  
    return {
      currentStep: readonly(currentStep),
      selectedDoc: readonly(selectedDoc),
      taskData: readonly(taskData),
      steps,
      nextStep,
      selectDocument,
      createStudentPreview,
      startStudentTask,
      markStudentComplete,
      startTeacherReview,
      markTeacherReviewed,
      resetFlow,
      getStepInfo
    }
  }