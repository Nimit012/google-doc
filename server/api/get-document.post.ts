import { getDocManager } from '~/server/utils/documentManager.server';

export default defineEventHandler(async (event) => {
  try {
    // Get the document ID from the request body
    const { documentId } = await readBody(event);
    
    if (!documentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Document ID is required in the request body'
      });
    }

    // Get the document manager instance
    const docManager = getDocManager();
    
    // Get the document details
    const document = await docManager.getDocument(documentId as string);
    
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: `Document not found: ${documentId}`
      });
    }
    
    return {
      status: 'success',
      data: document
    };
    
  } catch (error: any) {
    console.error('Error getting document:', error);
    
    // Return appropriate error response
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve document',
      data: {
        message: error.message
      }
    });
  }
});
