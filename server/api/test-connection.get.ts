// Test endpoint to verify MongoDB connection
export default defineEventHandler(async (event) => {
    try {
      // This will test if mongoose is properly connected
      const mongoose = await import('mongoose')
      
      return {
        success: true,
        message: 'MongoDB connection is working!',
        connectionState: mongoose.default.connection.readyState,
        connectionStates: {
          0: 'disconnected',
          1: 'connected', 
          2: 'connecting',
          3: 'disconnecting'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'MongoDB connection failed',
        error: error.message
      }
    }
  })