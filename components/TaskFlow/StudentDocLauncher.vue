<template>
  <div>
    <!-- Document Preview -->
    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Task Document Preview
        </h3>
      </div>

      <!-- Loading state -->
      <div
        v-if="isLoadingPreview"
        class="bg-gray-50 rounded-lg p-8 flex items-center justify-center"
      >
        <div class="text-center">
          <svg
            class="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p class="text-sm text-gray-500">Loading document preview...</p>
        </div>
      </div>

      <!-- Preview content -->
      <div v-else-if="documentPreview" class="space-y-4">
        <!-- Document info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-gray-900">
                {{ documentPreview.name }}
              </h4>
              <p class="text-sm text-gray-600">
                Original Document • Last modified
                {{ documentPreview.modifiedTime }}
              </p>
            </div>
          </div>
        </div>

        <!-- Thumbnail preview -->
        <div v-if="documentThumbnail" class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 mb-3">
            Document Preview:
          </h4>
          <div class="flex justify-center">
            <img
              :src="documentThumbnail"
              alt="Document preview"
              class="max-h-48 object-contain rounded shadow-sm border bg-white"
              referrerpolicy="no-referrer"
            />
          </div>
        </div>

        <!-- Preview note -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start space-x-2">
            <svg
              class="w-5 h-5 text-yellow-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h4 class="text-sm font-medium text-yellow-800 mb-1">
                Preview Only
              </h4>
              <p class="text-sm text-yellow-700">
                This is the original document that will be copied for your
                assignment. You'll receive your own editable copy when you start
                the assignment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="previewError"
        class="bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span class="text-sm font-medium text-red-800"
            >Unable to load document preview</span
          >
        </div>
        <p class="text-sm text-red-700 mt-1">{{ previewError }}</p>
      </div>
    </div>

    <!-- Action Button -->
    <div class="text-center">
      <button
        @click="startAssignment"
        :disabled="isCreatingCopy"
        class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          v-if="!isCreatingCopy"
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a4 4 0 118 0v2"
          ></path>
        </svg>
        <svg
          v-else
          class="w-5 h-5 mr-2 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isCreatingCopy ? "Creating Your Copy..." : "Start" }}
      </button>
    </div>

    <!-- Status Messages -->
    <div
      v-if="statusMessage"
      class="mt-6 p-4 rounded-md"
      :class="statusMessageClass"
    >
      <div class="flex items-center space-x-2">
        <svg
          v-if="statusType === 'success'"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else-if="statusType === 'error'"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ statusMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { createDocument } = useDocumentManagerClient()
const props = defineProps({
  originalDocId: {
    type: String,
    required: true,
  },
  masterDocId: {
    // Changed from originalDocId
    type: String,
    required: true,
  },
  taskTitle: {
    type: String,
    default: "Task",
  },
  taskDescription: {
    type: String,
    default: "Complete the task in the provided document.",
  },
  studentEmail: {
    type: String,
    default: "student@example.com",
  },
});

const emit = defineEmits(["assignment-started", "copy-created"]);

// Component state
const isCreatingCopy = ref(false);
const statusMessage = ref("");
const statusType = ref(""); // 'success', 'error', 'info'
const createdDocId = ref(null);

// Preview state
const isLoadingPreview = ref(false);
const documentPreview = ref(null);
const documentThumbnail = ref(null);
const previewError = ref("");

// Google Drive composable
const {
  createStudentCopy,
  isAuthenticated,
  authenticate,
  initializeGoogleAPIs,
  getDocumentMetadata,
  fetchThumbnail,
} = useGoogleDrive();

// Initialize Google APIs and load preview when component mounts
onMounted(async () => {
  try {
    await initializeGoogleAPIs();
    console.log("Google APIs initialized in StudentDocLauncher");
    await loadDocumentPreview();
  } catch (error) {
    console.error(
      "Failed to initialize Google APIs in StudentDocLauncher:",
      error
    );
  }
});

// Load Google APIs scripts
useHead({
  script: [
    {
      src: "https://accounts.google.com/gsi/client",
      body: true,
      defer: true,
      onload: () => {
        console.log("Google Identity Services loaded in StudentDocLauncher");
        // Re-initialize after script loads
        setTimeout(() => {
          initializeGoogleAPIs();
        }, 100);
      },
    },
  ],
});

// Load document preview
const loadDocumentPreview = async () => {
  if (!props.originalDocId) return;

  isLoadingPreview.value = true;
  previewError.value = "";

  try {
    // Ensure authenticated for preview
    if (!isAuthenticated()) {
      await authenticate();
    }

    // Get document metadata
    const metadata = await getDocumentMetadata(props.originalDocId);
    documentPreview.value = {
      name: metadata.name,
      modifiedTime: new Date(metadata.modifiedTime).toLocaleDateString(),
    };

    // Get thumbnail
    try {
      const thumbnail = await fetchThumbnail(props.originalDocId);
      documentThumbnail.value = thumbnail;
    } catch (thumbError) {
      console.warn("Could not load thumbnail:", thumbError);
    }
  } catch (error) {
    console.error("Failed to load document preview:", error);
    previewError.value =
      "Document preview unavailable. You can still start the task.";
  } finally {
    isLoadingPreview.value = false;
  }
};

// Open original document in preview mode
const previewOriginalDocument = () => {
  if (props.originalDocId) {
    const previewUrl = `https://docs.google.com/document/d/${props.originalDocId}/preview`;
    window.open(previewUrl, "_blank");
  }
};

// Computed
const statusMessageClass = computed(() => {
  const baseClass = "text-sm font-medium";
  switch (statusType.value) {
    case "success":
      return `${baseClass} bg-green-100 text-green-800 border border-green-200`;
    case "error":
      return `${baseClass} bg-red-100 text-red-800 border border-red-200`;
    case "info":
      return `${baseClass} bg-blue-100 text-blue-800 border border-blue-200`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800 border border-gray-200`;
  }
});

// Methods
const setStatus = (message, type = "info") => {
  statusMessage.value = message;
  statusType.value = type;

  // Auto-clear success/info messages after 5 seconds
  if (type === "success" || type === "info") {
    setTimeout(() => {
      clearStatus();
    }, 5000);
  }
};

const clearStatus = () => {
  statusMessage.value = "";
  statusType.value = "";
};

const startAssignment = async () => {
  if (isCreatingCopy.value) return;

  isCreatingCopy.value = true;
  clearStatus();
  setStatus("Initializing Google Drive connection...", "info");

  try {
    // Ensure Google APIs are initialized (if you still need this)
    await initializeGoogleAPIs();

    // Authentication check
    if (!isAuthenticated()) {
      setStatus("Authenticating with Google Drive...", "info");
      await authenticate();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!isAuthenticated()) throw new Error("Authentication failed");
    }

    // Create student copy using Document Management Service
    setStatus("Creating document copy and setting permissions...", "info");
    console.log("props.originalDocId", props.originalDocId);
    console.log("props.studentEmail", props.studentEmail);
    console.log("props.taskTitle", props.taskTitle);

    const copiedDoc = await createDocument(
      {
        sourceFileId: props.masterDocId, // teacher's original document
        name: `${props.taskTitle} - ${props.studentEmail}`,
        accessControl: [
          { user: "emma.student@greydls.com", access_level: 'read_write' },

       
      ],
    }
    );

    setStatus("Document ready! Opening in new tab...", "success");
    console.log("copiedDoc", copiedDoc);

  const docUrl = copiedDoc.access_url || `https://docs.google.com/document/d/${copiedDoc.id}/edit`;
    window.open(docUrl, "_blank");
    // Emit events back to parent
    emit("copy-created", {
      originalDocId: copiedDoc.document_id,
    
      docUrl: docUrl,
  
    });

    emit("assignment-started", {
      copiedDocId: copiedDoc.id,
      docUrl: docUrl,
    });

    console.log("Assignment started successfully:", copiedDoc);
  } catch (error) {
    console.error("Failed to start assignment:", error);

    let errorMessage = "Failed to create document copy. Please try again.";
    if (error.message?.includes("not initialized")) {
      errorMessage =
        "Google Drive connection not ready. Please refresh the page and try again.";
    } else if (error.message?.includes("Authentication")) {
      errorMessage =
        "Authentication failed. Please check your Google account permissions.";
    }

    setStatus(errorMessage, "error");
  } finally {
    isCreatingCopy.value = false;
  }
};

// Expose methods for parent component
defineExpose({
  getCreatedDocId: () => createdDocId.value,
  startAssignment,
});
</script>
