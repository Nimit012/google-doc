<template>
  <div class="p-4">
    <!-- No modal needed anymore -->
  </div>
</template>

<script setup>
// Removed DocumentModal import

const emit = defineEmits(['document-selected', 'document-loading'])

// Component state - removed modal-related refs
const pickerInited = ref(false)
const gisInited = ref(false)

// Use our composable
const { 
  accessToken,
  initializeGoogleAPIs, 
  authenticate, 
  isAuthenticated,
  fetchThumbnail,
  listPermissions,
  makeDocumentPublic
} = useGoogleDrive()

// Configuration values
const CLIENT_ID = '744421146988-ctts8p2ovi3nmv9qqf40d4kun3dd6l06.apps.googleusercontent.com'
const API_KEY = 'AIzaSyDoi51hsIMIMpqBXUh6EgvqZ9qubKamgsE'

onMounted(async () => {
  try {
    await initializeGoogleAPIs()
  } catch (error) {
    console.error('Failed to initialize Google APIs:', error)
  }
})

// Load Google APIs
useHead({
  script: [
    {
      src: 'https://apis.google.com/js/api.js',
      body: true,
      defer: true,
      onload: () => {
        if (window.gapi) {
          window.gapi.load('picker', () => {
            pickerInited.value = true
            console.log('Google Picker API loaded')
          })
        }
      }
    },
    {
      src: 'https://accounts.google.com/gsi/client',
      body: true,
      defer: true,
      onload: () => {
        gisInited.value = true
        console.log('Google Identity Services loaded')
      }
    }
  ]
})

const handleAuthClick = async () => {
  if (!pickerInited.value || !gisInited.value) {
    alert('Google Picker API or OAuth not loaded yet.')
    return
  }
  
  try {
    if (isAuthenticated()) {
      await createPicker()
    } else {
      await authenticate()
      // After authentication, create picker
      if (isAuthenticated()) {
        await createPicker()
      }
    }
  } catch (error) {
    console.error('Authentication or picker creation failed:', error)
    alert('Failed to authenticate or open picker. Please try again.')
  }
}

async function createPicker() {
  const picker = new window.google.picker.PickerBuilder()
    .addView(window.google.picker.ViewId.DOCS)
    .setOAuthToken(accessToken.value)
    .setDeveloperKey(API_KEY)
    .setCallback(pickerCallback)
    .build()
  picker.setVisible(true)
}

async function pickerCallback(data) {
  if (window.google && data) {
    console.log("picker data", data)
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const doc = data[window.google.picker.Response.DOCUMENTS]?.[0]
      if (doc) {
        try {
          // Emit loading start immediately when doc is selected
          emit('document-loading', { loading: true })
          
          const thumbnailLink = await fetchThumbnail(doc.id)
          const permissions = await listPermissions(doc.id)
          console.log("permissions", permissions)
          
          // Make document public for viewing
          await makeDocumentPublic(doc.id)
          
          const lastEditedUtc = doc.lastEditedUtc
          const lastEditedDate = new Date(lastEditedUtc)
          const formattedDate = lastEditedDate.toLocaleString()
          
          const docData = {
            id: doc.id,
            name: doc.name,
            url: doc.url,
            embedUrl: doc.embedUrl,
            iconUrl: doc.iconUrl,
            lastEditedDate: formattedDate,
            serviceId: doc.serviceId,
            thumbnailLink: thumbnailLink
          }
          
          // Directly emit to parent instead of showing modal
          console.log('📤 Emitting selected document:', docData)
          emit('document-selected', docData)
          
        } catch (error) {
          console.error('Error processing selected document:', error)
          alert('Error processing selected document. Please try again.')
        }
      }
    }
  }
}

defineExpose({
  handleAuthClick
})
</script>