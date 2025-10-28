import { defineEventHandler, readBody } from 'h3';
import { updateDocument } from '~/server/utils/documentManager.server';

export default defineEventHandler(async (event) => {
  try {
    const { documentId, updates } = await readBody(event);

    if (!documentId || !updates) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required parameters: documentId or updates',
      });
    }

    console.log(`📝 Updating document ${documentId} via Document Manager...`);
    const result = await updateDocument(documentId, updates);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('❌ Error updating document:', error);
    return {
      success: false,
      error: error.message || 'Failed to update document',
    };
  }
});
