// server/api/documents/revision.post.ts
import { getRevisionId } from '~/server/utils/documentManager.server';

export default defineEventHandler(async (event) => {
  try {
    // Read the document ID from request body
    const { documentId } = await readBody(event);

    if (!documentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Document ID is required in the request body'
      });
    }

    // Fetch the latest revision ID from the document manager
    const revisionId = await getRevisionId(documentId as string);

    if (!revisionId) {
      throw createError({
        statusCode: 404,
        statusMessage: `No revisions found for document: ${documentId}`
      });
    }

    return {
      status: 'success',
      data: { revisionId }
    };
  } catch (error: any) {
    console.error('Error fetching revision ID:', error);

    // Return a structured error response
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch revision ID',
      data: {
        message: error.message
      }
    });
  }
});
