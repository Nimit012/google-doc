export const useDocumentManagerClient = () => {
  const createDocument = async (obj :{sourceFileId: string, sourceOwner: string, name: string, accessControl?: any}) => {
    return await $fetch('/api/create-document', {
      method: 'POST',
      body: { ...obj }
    });
  };

 const getDocument = async (documentId: string) => {
  const response = await $fetch('/api/get-document', {
    method: 'POST',
    body: { documentId },
  });

  // If response.data is a single document, wrap it in an array
  if (response?.data && !Array.isArray(response.data)) {
    response.data = [response.data];
  }

  return response;
};

  const updateDocument = async (documentId: string, updates: any) => {
    return await $fetch('/api/update-document', { method: 'POST', body: { documentId, updates } });
  };

  const deleteDocument = async (documentId: string) => {
    return await $fetch('/api/delete-document', { method: 'POST', body: { documentId } });
  };

  const listDocuments = async (metadata?: any, limit?: number, pageToken?: string) => {
    const query: any = {};
    if (metadata) query.metadata = JSON.stringify(metadata);
    if (limit) query.limit = limit;
    if (pageToken) query.pageToken = pageToken;
    return await $fetch('/api/list-documents', { query });
  };

  return { createDocument, getDocument, updateDocument, deleteDocument, listDocuments };
};
