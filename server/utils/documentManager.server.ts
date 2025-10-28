// server/utils/documentManager.server.ts
import { DocumentManager, ProviderType, type GoogleDriveConfig } from 'document-management-service';

const CLIENT_CONFIG: GoogleDriveConfig = {
  serviceAccountKey: {
    type: "service_account",
    project_id: process.env.GOOGLE_DRIVE_PROJECT_ID!,
    private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL!,
    client_id: process.env.GOOGLE_DRIVE_CLIENT_ID,
    private_key_id: process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/service-account-1%40studious-pen-475209-i6.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
  },
  adminEmail: process.env.GOOGLE_DRIVE_ADMIN_EMAIL!
};

let docManager: DocumentManager | null = null;

export const getDocManager = () => {
  if (!docManager) {
    docManager = new DocumentManager({
      provider: ProviderType.GOOGLE_DRIVE,
      config: CLIENT_CONFIG
    });
    console.log('✅ DocumentManager initialized (server-side)');
  }
  return docManager;
};

// --------------------
// Document Operations
// --------------------

export const createDocument = async (
  sourceFileId: string,
  sourceOwner: string,
  name: string,
  folderPath?: string,
  accessControl?: Array<{ user: string; access_level: 'read' | 'read_write' | 'comment' }>,
  metadata?: Record<string, any>
) => {
  return await getDocManager().createDocument({
    source_reference: sourceFileId,
    source_owner: sourceOwner,
    name,
    folder_path: folderPath,
    access_control: accessControl,
    metadata
  });
};

export const getDocument = async (documentId: string) => {
  return await getDocManager().getDocument(documentId);
};

export const updateDocument = async (
  documentId: string,
  updates: { name?: string; metadata?: Record<string, any> }
) => {
  return await getDocManager().updateDocument(documentId, updates);
};

export const deleteDocument = async (documentId: string) => {
  return await getDocManager().deleteDocument(documentId);
};

export const listDocuments = async (
  metadataFilter?: Record<string, any>,
  limit?: number,
  pageToken?: string
) => {
  return await getDocManager().listDocuments({
    metadata: metadataFilter,
    limit,
    pageToken
  });
};

export const fetchThumbnail = async (documentId: string) => {
  const doc = await getDocument(documentId);
  return doc.thumbnailLink || null;
};

export const copyDocument = async (
  sourceFileId: string,
  sourceOwner: string,
  newName: string,
  folderPath?: string,
  accessControl?: Array<{ user: string; access_level: 'read' | 'read_write' | 'comment' }>,
  metadata?: Record<string, any>
) => {
  return await createDocument(sourceFileId, sourceOwner, newName, folderPath, accessControl, metadata);
};

export const getRevisionId = async (documentId: string) => {
 

  // Assuming DocumentManager provides a method to fetch revisions
  // or you can adapt this if your SDK has a different method name.
  const revisions = await getDocManager().getRevisions(documentId);

  // Return the latest revision ID (most common need)
  if (Array.isArray(revisions) && revisions.length > 0) {
    const latestRevision = revisions[0];
    return latestRevision.revision_id;
  }

  console.warn(`⚠️ No revisions found for document: ${documentId}`);
  return null;
};

export const setAccessControl = async (
  documentId: string,
  accessControl: Array<{ user: string; access_level: 'read' | 'read_write' | 'comment' }>
) => {
  if (!documentId || !Array.isArray(accessControl)) {
    throw new Error('Invalid arguments: documentId and accessControl are required');
  }


  await getDocManager().setAccessControl(documentId, accessControl);
  console.log(`✅ Access control updated for document: ${documentId}`);
};


