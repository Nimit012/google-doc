import { setAccessControl } from '~/server/utils/documentManager.server';

export default defineEventHandler(async (event) => {
  try {
    const { documentId, accessControl } = await readBody(event);

    if (!documentId || !accessControl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'documentId and accessControl are required in the request body'
      });
    }

    await setAccessControl(documentId, accessControl);

    return {
      status: 'success',
      message: `Access control updated for document ${documentId}`
    };
  } catch (error: any) {
    console.error('Error setting access control:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to set access control',
      data: { message: error.message }
    });
  }
});
