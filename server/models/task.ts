import { defineMongooseModel } from '#nuxt/mongoose'

export const Task = defineMongooseModel({
  name: 'Task',
  schema: {
    // Unique identifier for this task (matches your frontend)
    id: {
      type: String,
      required: true,
      unique: true,
      default: 'task-001' // You can change this to generate unique IDs later
    },
    
    // Task details (matches taskData structure)
    title: {
      type: String,
      required: true,
      default: 'Essay Assignment'
    },
    
    description: {
      type: String,
      default: 'Write a 500-word essay on your chosen topic'
    },
    
    // Original document information (from Google Drive)
    originalDocId: {
      type: String,
      default: null
    },
    
    originalDocUrl: {
      type: String,
      default: null
    },
    
    // Student's copy information
    studentCopyId: {
      type: String,
      default: null
    },
    
    studentCopyUrl: {
      type: String,
      default: null
    },
    
    // User emails (matches your current structure)
    authorEmail: {
      type: String,
      default: 'author@example.com'
    },
    
    studentEmail: {
      type: String,
      default: 'student@example.com'
    },
    
    teacherEmail: {
      type: String,
      default: 'teacher@example.com'
    },
    
    // Flow state management (matches your steps exactly)
    currentStep: {
      type: String,
      enum: [
        'author_add_doc',    // Initial state
        'author_preview',    // Author reviewing selected doc
        'student_start',     // Ready for student
        'student_working',   // Student editing document
        'student_complete',  // Student submitted
        'teacher_review',    // Teacher reviewing
        'completed'          // Assignment done
      ],
      default: 'author_add_doc'
    },
    
    // Status tracking (matches your status values)
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'student_complete', 'completed'],
      default: 'draft'
    },
    
    // Google Drive metadata (flexible object to store any Drive API data)
    metadata: {
      type: Object,
      default: null
    },
    
    // Selected document info (from Google Drive picker)
    selectedDoc: {
      type: Object,
      default: null
    },
    
    // Timestamps (matches your createdAt field)
    createdAt: {
      type: String, // Using String to match your ISO format
      default: () => new Date().toISOString()
    },
    
    updatedAt: {
      type: String,
      default: () => new Date().toISOString()
    },
    
    // Additional workflow timestamps
    submittedAt: {
      type: String,
      default: null
    },
    
    reviewedAt: {
      type: String,
      default: null
    },
    
    completedAt: {
      type: String,
      default: null
    }
  },
  
  // Additional options
  options: {
    collection: 'tasks', // Explicit collection name
    timestamps: false    // We're handling timestamps manually
  }
})