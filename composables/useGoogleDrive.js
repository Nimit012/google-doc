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
  const ADMIN_EMAIL = 'jasdeep.singh@comprotechnologies.com'
  
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
  const copyDocument = async (originalFileId, newFileName, targetUserEmail = null, targetUserRole = 'writer') => {
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
  
    // Grant access to target user with specified role if provided
    if (targetUserEmail) {
      await assignPermission(copiedDoc.id, targetUserEmail, targetUserRole)
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

  const createNamedVersion = async (fileId, versionName) => {
    try {
      console.log(`📝 Creating named version: "${versionName}" for file: ${fileId}`)
      
      // First, let's see what revisions already exist
      console.log('🔍 Checking existing revisions...')
      const initialRevisionsResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/revisions`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      if (initialRevisionsResponse.ok) {
        const initialData = await initialRevisionsResponse.json()
        console.log('📋 Initial revisions count:', initialData.revisions?.length || 0)
        console.log('📋 Initial revisions:', initialData.revisions?.map(r => ({ id: r.id, modifiedTime: r.modifiedTime })))
      }

      // Method 1: Try creating a named version from current revision first
      console.log('🎯 Attempting to name the current revision...')
      const currentRevisionsResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/revisions`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })

      if (currentRevisionsResponse.ok) {
        const currentData = await currentRevisionsResponse.json()
        const revisions = currentData.revisions || []
        
        if (revisions.length > 0) {
          const latestRevision = revisions[revisions.length - 1]
          console.log('📌 Trying to name revision:', latestRevision.id)
          
          const nameCurrentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/revisions/${latestRevision.id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken.value}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              description: versionName,
              keepForever: true
            })
          })

          if (nameCurrentResponse.ok) {
            const namedRevision = await nameCurrentResponse.json()
            console.log('✅ Successfully named current revision:', namedRevision)
            
            // Store locally
            const versionData = {
              versionName,
              createdAt: new Date().toISOString(),
              fileId: fileId,
              revisionId: latestRevision.id
            }
            
            try {
              const versionKey = `file_versions_${fileId}`
              const existingVersions = JSON.parse(localStorage.getItem(versionKey) || '[]')
              existingVersions.push(versionData)
              localStorage.setItem(versionKey, JSON.stringify(existingVersions))
            } catch (e) {
              console.warn('Could not store version info locally:', e)
            }
            
            return versionData
          } else {
            const error = await nameCurrentResponse.json()
            console.error('❌ Failed to name current revision:', error)
          }
        }
      }

      // Method 2: If naming current revision failed, try making a change to force a new revision
      console.log('🔄 Trying to create new revision by making document change...')
      
      // Make a more substantial change - add a comment to the document
      const commentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: `Version marker: ${versionName} - ${new Date().toISOString()}`,
          anchor: JSON.stringify({
            r: 'kix.0'  // This targets the beginning of the document
          })
        })
      })

      if (commentResponse.ok) {
        console.log('💬 Comment added to document')
        
        // Wait for the change to propagate
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Now try to get the latest revision and name it
        const newRevisionsResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/revisions`, {
          headers: {
            'Authorization': `Bearer ${accessToken.value}`
          }
        })

        if (newRevisionsResponse.ok) {
          const newData = await newRevisionsResponse.json()
          const newRevisions = newData.revisions || []
          console.log('📋 Revisions after comment:', newRevisions.length)
          
          if (newRevisions.length > 0) {
            const latestRevision = newRevisions[newRevisions.length - 1]
            console.log('📌 Trying to name new revision:', latestRevision.id)
            
            const nameNewResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/revisions/${latestRevision.id}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${accessToken.value}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                description: versionName,
                keepForever: true
              })
            })

            if (nameNewResponse.ok) {
              const namedRevision = await nameNewResponse.json()
              console.log('✅ Successfully named new revision:', namedRevision)
              
              // Now delete the comment since it was just for creating the revision
              try {
                const commentsListResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/comments`, {
                  headers: {
                    'Authorization': `Bearer ${accessToken.value}`
                  }
                })
                
                if (commentsListResponse.ok) {
                  const commentsData = await commentsListResponse.json()
                  const versionComment = commentsData.comments?.find(c => c.content?.includes('Version marker:'))
                  
                  if (versionComment) {
                    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/comments/${versionComment.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${accessToken.value}`
                      }
                    })
                    console.log('🗑️ Cleaned up version marker comment')
                  }
                }
              } catch (cleanupError) {
                console.warn('⚠️ Could not clean up version marker comment:', cleanupError)
              }
              
            } else {
              const error = await nameNewResponse.json()
              console.error('❌ Failed to name new revision:', error)
            }
          }
        }
      } else {
        console.error('❌ Failed to add comment to document')
      }

      // Fallback: Store locally even if Google Drive naming failed
      const fallbackVersion = {
        versionName,
        createdAt: new Date().toISOString(),
        fileId: fileId,
        fallback: true
      }
      
      try {
        const versionKey = `file_versions_${fileId}`
        const existingVersions = JSON.parse(localStorage.getItem(versionKey) || '[]')
        existingVersions.push(fallbackVersion)
        localStorage.setItem(versionKey, JSON.stringify(existingVersions))
        console.log('✅ Version info stored locally as fallback')
      } catch (e) {
        console.warn('Fallback storage failed:', e)
      }
      
      return fallbackVersion

    } catch (error) {
      console.error('Failed to create named version:', error)
      
      // Final fallback
      const fallbackVersion = {
        versionName,
        createdAt: new Date().toISOString(),
        fileId: fileId,
        fallback: true
      }
      
      try {
        const versionKey = `file_versions_${fileId}`
        const existingVersions = JSON.parse(localStorage.getItem(versionKey) || '[]')
        existingVersions.push(fallbackVersion)
        localStorage.setItem(versionKey, JSON.stringify(existingVersions))
      } catch (e) {
        console.warn('All version creation methods failed')
      }
      
      return fallbackVersion
    }
  }

  const getVersionHistory = async (fileId) => {
    try {
      console.log(`📚 Getting version history for file: ${fileId}`)
      
      // Get our locally stored version tracking (since Google Drive's API doesn't easily give us custom names)
      const versionKey = `file_versions_${fileId}`
      const localVersions = JSON.parse(localStorage.getItem(versionKey) || '[]')
      
      console.log('✅ Version history retrieved:', localVersions)
      return localVersions
      
    } catch (error) {
      console.error('Failed to get version history:', error)
      return []
    }
  }

  const openVersionHistory = (fileId) => {
    // Open Google Drive version history directly
    const versionHistoryUrl = `https://docs.google.com/document/d/${fileId}/revisions`
    window.open(versionHistoryUrl, '_blank')
    console.log('🔍 Opening Google Drive version history')
  }

  const getTaskVersions = (copiedDocId) => {
    try {
      // Get versions from both localStorage sources
      const versionKey = `file_versions_${copiedDocId}`
      const fileVersions = JSON.parse(localStorage.getItem(versionKey) || '[]')
      
      const metadataKey = `task_doc_${copiedDocId}`
      const taskMetadata = JSON.parse(localStorage.getItem(metadataKey) || '{}')
      
      const versions = []
      
      // Add submission version if it exists
      if (taskMetadata.submissionVersion) {
        versions.push({
          type: 'submission',
          ...taskMetadata.submissionVersion
        })
      }
      
      // Add review version if it exists  
      if (taskMetadata.reviewVersion) {
        versions.push({
          type: 'review',
          ...taskMetadata.reviewVersion
        })
      }
      
      // Add any file versions
      fileVersions.forEach(version => {
        if (!versions.find(v => v.versionName === version.versionName)) {
          versions.push({
            type: 'file',
            ...version
          })
        }
      })
      
      return versions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      
    } catch (error) {
      console.error('Failed to get task versions:', error)
      return []
    }
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
      // Explicitly pass 'writer' for student copies
      const result = await copyDocument(originalDocId, copyName, studentEmail, 'writer')
      
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





  const getCurrentRevisionId = async (fileId) => {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/revisions`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
  
      if (!response.ok) {
        throw new Error('Failed to get revisions')
      }
  
      const data = await response.json()
      const revisions = data.revisions || []
      
      // Return the latest revision ID
      if (revisions.length > 0) {
        const latestRevision = revisions[revisions.length - 1]
        console.log('Latest revision ID:', latestRevision.id)
        return latestRevision.id
      }
      
      return null
    } catch (error) {
      console.error('Error getting current revision:', error)
      throw error
    }
  }
  
  const storeAttemptVersion = async (fileId, studentEmail) => {
    try {
      // Get current revision ID
      const revisionId = await getCurrentRevisionId(fileId)
      
      if (!revisionId) {
        throw new Error('No revision ID found')
      }
      
      // Get existing attempts for this document
      const existingAttempts = getStoredAttempts(fileId)
      const attemptNumber = existingAttempts.length + 1
      
      // Create attempt data
      const attemptData = {
        attemptNumber,
        revisionId,
        submittedAt: new Date().toISOString(),
        studentEmail,
        docId: fileId
      }
      
      // Store the attempt
      const attemptKey = `attempt_${fileId}_${attemptNumber}`
      localStorage.setItem(attemptKey, JSON.stringify(attemptData))
      
      console.log('Stored attempt:', attemptData)
      return attemptData
      
    } catch (error) {
      console.error('Failed to store attempt version:', error)
      throw error
    }
  }
  
  const getStoredAttempts = (fileId) => {
    const attempts = []
    
    // Find all attempts for this document
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`attempt_${fileId}_`)) {
        const attemptData = JSON.parse(localStorage.getItem(key))
        attempts.push(attemptData)
      }
    })
    
    // Sort by attempt number
    return attempts.sort((a, b) => a.attemptNumber - b.attemptNumber)
  }

  const downloadAttemptVersion = async (fileId, revisionId, fileName, format = 'pdf') => {
    try {
      const mimeTypes = {
        pdf: 'application/pdf',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }
      
      const mimeType = mimeTypes[format]
      if (!mimeType) {
        throw new Error(`Unsupported format: ${format}`)
      }
      
      // Use the export endpoint with revisions parameter
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/export?revisions=${revisionId}&mimeType=${encodeURIComponent(mimeType)}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken.value}`
          }
        }
      )
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const downloadFileName = `${fileName}.${format}`
      
      // Trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = downloadFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return { success: true, fileName: downloadFileName }
      
    } catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  }









  const transferToTeacher = async (copiedDocId, teacherEmail, studentEmail) => {
    try {
      console.log('📋 Transferring document access from student to teacher...')
      
      // Store this submission attempt BEFORE changing permissions
      const attemptData = await storeAttemptVersion(copiedDocId, studentEmail)
      
      // Get current permissions to find student permission ID
      const permissions = await listPermissions(copiedDocId)
      const studentPermission = permissions.find(p => p.emailAddress === studentEmail && p.role === 'writer')
      
      // Update student permission from writer to reader
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
      
      console.log('✅ Document access transferred successfully with attempt stored')
      return {
        success: true,
        attemptData
      }
    } catch (error) {
      console.error('Failed to transfer to teacher:', error)
      throw error
    }
  }




  const finalizeDocument = async (copiedDocId, teacherEmail) => {
    try {
      console.log('🏁 Finalizing document permissions...')
      
      // Create review completion version before changing permissions
      const reviewTimestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      const reviewVersionName = `Review Complete ${reviewTimestamp}`
      
      console.log('📌 Creating review completion version...')
      const reviewVersion = await createNamedVersion(copiedDocId, reviewVersionName)
      
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
      metadata.reviewVersion = reviewVersion
      localStorage.setItem(metadataKey, JSON.stringify(metadata))
      
      console.log('✅ Document finalized with review completion version - only admin has edit access, others have view access')
      return {
        success: true,
        reviewVersion
      }
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
    
    // Versioning methods
    createNamedVersion,
    getVersionHistory,
    getTaskVersions,
    openVersionHistory,
    
    // Task flow methods
    createStudentCopy,
    transferToTeacher,
    finalizeDocument,
    copyDocument,

    getCurrentRevisionId,
    storeAttemptVersion,
    getStoredAttempts,
    downloadAttemptVersion,
  }
}