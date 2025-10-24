import { createDocument } from '~/server/utils/documentManager.server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const result = await createDocument(
    body.sourceFileId,
    body.sourceOwner,
    body.name,
    body.folderPath,
    body.accessControl,
    body.metadata
  );
  return result;
});