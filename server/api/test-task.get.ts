import { Task } from '~/server/models/task'

export default defineEventHandler(async (event) => {
  try {
    // Check if we have any existing tasks
    const existingTasks = await Task.find()
    
    // If no tasks exist, create a sample one that matches your frontend structure
    if (existingTasks.length === 0) {
      const sampleTask = new Task({
        id: 'task-001', // Matches your frontend default
        title: 'Essay Task',
        description: 'Write a 500-word essay on your chosen topic',
        authorEmail: 'author@example.com',
        studentEmail: 'student@example.com',
        teacherEmail: 'teacher@example.com',
        currentStep: 'author_add_doc',
        status: 'draft',
        originalDocId: null,
        originalDocUrl: null,
        studentCopyId: null,
        studentCopyUrl: null,
        metadata: null,
        selectedDoc: null
      })
      
      await sampleTask.save()
      
      return {
        success: true,
        message: 'Sample task created successfully!',
        task: sampleTask,
        totalTasks: 1,
        note: 'This matches your useTaskFlow.js structure exactly'
      }
    }
    
    return {
      success: true,
      message: 'Tasks found in database',
      tasks: existingTasks,
      totalTasks: existingTasks.length
    }
    
  } catch (error) {
    return {
      success: false,
      message: 'Error with Task model',
      error: error.message
    }
  }
})