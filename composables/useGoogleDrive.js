// Global state (singleton pattern for Google Drive)
const globalAccessToken = ref(null)
const globalTokenExpiry = ref(null)
const globalTokenClient = ref(null)
const globalIsApiLoaded = ref(false)
const globalThumbnailCache = reactive({})

export const useGoogleDrive = () => {
  // Configuration
  const CLIENT_ID = '744421146988-ctts8p2ovi3nmv9qqf40d4kun3dd6l06.apps.googleusercontent.com'
  const API_KEY = 'AIzaSyDoi51hsIMIMpqBXUh6EgvqZ9qubKamgsE'
  const SCOPES = 'https://www.googleapis.com/auth/drive'
  const ADMIN_EMAIL = 'pratham.gupta@comprotechnologies.com'
  
  const TOKEN_STORAGE_KEY = 'google_drive_access_token'
  const EXPIRY_STORAGE_KEY = 'google_drive_token_expiry'

  // Use global state instead of local refs
  const accessToken = globalAccessToken
  const tokenExpiry = globalTokenExpiry
  const tokenClient = globalTokenClient
  const isApiLoaded = globalIsApiLoaded
  const thumbnailCache = globalThumbnailCache

  // Initialize Google APIs
  const initializeGoogleAPIs = () => {
    return new Promise((resolve) => {
      if (process.client) {
        console.log('🔧 Initializing Google APIs...')
        
        // Load stored token only if not already loaded
        if (!accessToken.value) {
          try {
            const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
            const storedExpiry = localStorage.getItem(EXPIRY_STORAGE_KEY)
            
            if (storedToken && storedExpiry) {
              const expiryTime = parseInt(storedExpiry)
              if (new Date().getTime() < expiryTime) {
                accessToken.value = storedToken
                tokenExpiry.value = expiryTime
                console.log('✅ Loaded stored access token')
              } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY)
                localStorage.removeItem(EXPIRY_STORAGE_KEY)
                console.log('🗑 Removed expired token')
              }
            }
          } catch (error) {
            console.error('Failed to access localStorage:', error)
          }
        }

        // Initialize OAuth client when Google is available (only once)
        if (!tokenClient.value) {
          const initOAuth = () => {
            if (window.google?.accounts?.oauth2) {
              tokenClient.value = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => handleAuthResponse(response)
              })
              console.log('✅ Google OAuth client initialized')
              isApiLoaded.value = true
              resolve()
            } else {
              console.log('⏳ Waiting for Google APIs to load...')
              // Retry after a short delay
              setTimeout(initOAuth, 100)
            }
          }

          initOAuth()
        } else {
          console.log('✅ Google OAuth client already initialized')
          isApiLoaded.value = true
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  // Authentication
  const handleAuthResponse = (response) => {
    if (response.error !== undefined) {
      console.error('Authentication error:', response.error)
      return
    }
    
    accessToken.value = response.access_token
    const expiryTime = new Date().getTime() + (60 * 60 * 1000)
    tokenExpiry.value = expiryTime
    
    console.log('✅ Authentication successful, token expires at:', new Date(expiryTime))
    
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken.value)
      localStorage.setItem(EXPIRY_STORAGE_KEY, expiryTime.toString())
      console.log('💾 Token saved to localStorage')
    } catch (e) {
      console.error('Failed to store token:', e)
    }
  }

  const authenticate = async () => {
    if (!tokenClient.value) {
      console.error('❌ Google OAuth client not initialized')
      throw new Error('Google OAuth client not initialized')
    }
    
    console.log('🔐 Starting authentication...')
    
    return new Promise((resolve, reject) => {
      tokenClient.value.callback = (response) => {
        handleAuthResponse(response)
        if (response.error) {
          reject(new Error(response.error))
        } else {
          console.log('✅ Authentication completed')
          resolve()
        }
      }
      tokenClient.value.requestAccessToken({ prompt: 'consent' })
    })
  }

  const isAuthenticated = () => {
    const authenticated = accessToken.value && tokenExpiry.value && new Date().getTime() < tokenExpiry.value
    console.log('🔍 Auth check - Token exists:', !!accessToken.value, 'Valid:', authenticated)
    return authenticated
  }

  // Document Operations
  const fetchThumbnail = async (fileId) => {
    if (thumbnailCache[fileId]) {
      return thumbnailCache[fileId]
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Error fetching thumbnail:', err)
      throw err
    }

    const data = await response.json()
    let thumbnailLink = data.thumbnailLink
    if (thumbnailLink) {
      thumbnailLink = thumbnailLink.replace(/=s220/, '=s640')
    }
    thumbnailCache[fileId] = thumbnailLink
    return thumbnailLink
  }

  const getDocumentMetadata = async (fileId) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=*`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Error fetching document metadata:', err)
      throw err
    }

    return await response.json()
  }

  const listPermissions = async (fileId) => {
    console.log('📋 Listing permissions for file:', fileId)
    console.log('🔑 Using access token:', accessToken.value ? 'Token exists' : 'Token is null')
    
    if (!accessToken.value) {
      throw new Error('Access token is not available. Please authenticate first.')
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?fields=permissions(id,emailAddress,role,type,displayName)`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('❌ Error listing permissions:', err)
      throw err
    }

    const data = await response.json()
    console.log('✅ Permissions listed successfully:', data.permissions)
    return data.permissions
  }

  const makeDocumentPublic = async (fileId) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Error making doc public:', err)
      throw err
    }
    
    return await response.json()
  }

  // Document Copying and Permissions
  const copyDocument = async (originalFileId, newFileName, targetUserEmail = null) => {
    const originalMetadata = await getDocumentMetadata(originalFileId)
    
    const copyRequestBody = {
      name: newFileName || `Copy of ${originalMetadata.name}`,
      parents: originalMetadata.parents || undefined,
      description: `Copy of ${originalMetadata.name} - Created on ${new Date().toISOString()}`
    }

    const copyResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${originalFileId}/copy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(copyRequestBody)
    })

    if (!copyResponse.ok) {
      const err = await copyResponse.json()
      console.error('Error copying document:', err)
      throw err
    }

    const copiedDoc = await copyResponse.json()
    console.log('Document copied successfully:', copiedDoc)

    // Transfer ownership to admin
    await transferOwnership(copiedDoc.id, ADMIN_EMAIL)

    // Grant access to target user if specified
    if (targetUserEmail) {
      await assignPermission(copiedDoc.id, targetUserEmail, 'writer')
    }

    return {
      originalMetadata,
      copiedDoc,
      success: true
    }
  }

  const assignPermission = async (fileId, userEmail, role = 'writer', sendNotification = true) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: role,
        type: 'user',
        emailAddress: userEmail,
        sendNotificationEmail: sendNotification
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Error assigning permission:', err)
      throw err
    }

    const permissionData = await response.json()
    console.log('Permission assigned successfully:', permissionData)
    return permissionData
  }

  const removePermission = async (fileId, permissionId) => {
    console.log(`🗑️ Removing permission: ${permissionId}`)
    
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions/${permissionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('❌ Error removing permission:', err)
      throw err
    }

    console.log('✅ Permission removed successfully')
    return true
  }

  const updatePermission = async (fileId, permissionId, newRole) => {
    console.log(`🔄 Updating permission ${permissionId} to role: ${newRole}`)
    
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions/${permissionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: newRole
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('❌ Error updating permission:', err)
      throw err
    }

    const updatedPermission = await response.json()
    console.log('✅ Permission updated successfully:', updatedPermission)
    return updatedPermission
  }

  const transferOwnership = async (fileId, newOwnerEmail) => {
    console.log(`👑 Transferring ownership to: ${newOwnerEmail}`)
    
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?transferOwnership=true`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'owner',
        type: 'user',
        emailAddress: newOwnerEmail
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('❌ Error transferring ownership:', err)
      throw err
    }

    const transferData = await response.json()
    console.log('✅ Ownership transferred successfully:', transferData)
    return transferData
  }

  // Task Flow Integration Functions
  const createStudentCopy = async (originalDocId, studentEmail, taskTitle) => {
    try {
      const copyName = `${taskTitle} - ${studentEmail} - ${new Date().toLocaleDateString()}`
      const result = await copyDocument(originalDocId, copyName, studentEmail)
      
      // Store metadata for tracking
      const metadata = {
        originalDocId: originalDocId,
        copiedDocId: result.copiedDoc.id,
        studentEmail: studentEmail,
        taskTitle: taskTitle,
        createdAt: new Date().toISOString(),
        status: 'student_working'
      }
      
      localStorage.setItem(`task_doc_${result.copiedDoc.id}`, JSON.stringify(metadata))
      
      return {
        ...result,
        metadata
      }
    } catch (error) {
      console.error('Failed to create student copy:', error)
      throw error
    }
  }

  const transferToTeacher = async (copiedDocId, teacherEmail, studentEmail) => {
    try {
      console.log('📋 Transferring document access from student to teacher...')
      
      // Get current permissions to find student permission ID
      const permissions = await listPermissions(copiedDocId)
      const studentPermission = permissions.find(p => p.emailAddress === studentEmail && p.role === 'writer')
      
      // Update student permission from writer to reader (more efficient than remove + add)
      if (studentPermission) {
        console.log('🔄 Changing student from edit to view access...')
        await updatePermission(copiedDocId, studentPermission.id, 'reader')
      } else {
        // Fallback: ensure student has at least view access
        console.log('👀 Ensuring student has view access...')
        await assignPermission(copiedDocId, studentEmail, 'reader', false)
      }
      
      // Grant teacher edit access
      console.log('✏️ Granting teacher edit access...')
      await assignPermission(copiedDocId, teacherEmail, 'writer', false)
      
      // Update metadata
      const metadataKey = `task_doc_${copiedDocId}`
      const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}')
      metadata.status = 'teacher_review'
      metadata.transferredAt = new Date().toISOString()
      localStorage.setItem(metadataKey, JSON.stringify(metadata))
      
      console.log('✅ Document access transferred successfully')
      return true
    } catch (error) {
      console.error('Failed to transfer to teacher:', error)
      throw error
    }
  }

  const finalizeDocument = async (copiedDocId, teacherEmail) => {
    try {
      console.log('🏁 Finalizing document permissions...')
      
      // Get current permissions
      const permissions = await listPermissions(copiedDocId)
      const teacherPermission = permissions.find(p => p.emailAddress === teacherEmail && p.role === 'writer')
      
      // Update teacher permission from writer to reader (more efficient than remove + add)
      if (teacherPermission) {
        console.log('🔄 Changing teacher from edit to view access...')
        await updatePermission(copiedDocId, teacherPermission.id, 'reader')
      } else {
        // Fallback: ensure teacher has at least view access
        console.log('👀 Ensuring teacher has view access...')
        await assignPermission(copiedDocId, teacherEmail, 'reader', false)
      }
      
      // Update metadata
      const metadataKey = `task_doc_${copiedDocId}`
      const metadata = JSON.parse(localStorage.getItem(metadataKey) || '{}')
      metadata.status = 'completed'
      metadata.finalizedAt = new Date().toISOString()
      localStorage.setItem(metadataKey, JSON.stringify(metadata))
      
      console.log('✅ Document finalized - only admin has edit access, others have view access')
      return true
    } catch (error) {
      console.error('Failed to finalize document:', error)
      throw error
    }
  }

  return {
    // State (now global and reactive across components)
    accessToken,
    tokenExpiry,
    isApiLoaded,
    
    // Auth methods
    initializeGoogleAPIs,
    authenticate,
    isAuthenticated,
    
    // Document methods
    fetchThumbnail,
    getDocumentMetadata,
    listPermissions,
    makeDocumentPublic,
    
    // Permission methods
    assignPermission,
    updatePermission,
    removePermission,
    transferOwnership,
    
    // Task flow methods
    createStudentCopy,
    transferToTeacher,
    finalizeDocument
  }
}