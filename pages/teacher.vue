<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Teacher View</h1>
      <p class="text-gray-600">Review Student Submissions</p>
    </div>

    <!-- Step Content -->
    <div class="space-y-6">
      <!-- Waiting for Author Setup -->
      <div
        v-if="
          currentStep === steps.AUTHOR_ADD_DOC ||
          currentStep === steps.AUTHOR_PREVIEW
        "
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="text-center py-12">
          <div
            class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-purple-600 animate-spin"
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
                d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Waiting for Author
          </h3>
          <p class="text-gray-600 mb-4">
            The author is currently setting up the task.
          </p>
          <p class="text-sm text-gray-500">
            You'll be able to review student work once they complete their
            tasks.
          </p>
        </div>

        <div class="mt-6 pt-4 border-t text-center">
          <p class="text-sm text-gray-500 mb-2">
            Switch to author view to continue the demo:
          </p>
          <NuxtLink
            to="/author"
            class="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Go to Author Dashboard →
          </NuxtLink>
        </div>
      </div>

      <!-- Waiting for Student -->
      <div
        v-if="
          currentStep === steps.STUDENT_START ||
          currentStep === steps.STUDENT_WORKING ||
          currentStep === steps.STUDENT_COMPLETE
        "
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Student Progress</h2>

        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 class="font-medium text-gray-900 mb-2">Task Document</h3>
          <p class="text-sm text-gray-600">
            {{ selectedDoc?.name || "Task document selected by author" }}
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                currentStep === steps.STUDENT_START
                  ? 'bg-yellow-400'
                  : 'bg-green-500',
              ]"
            ></div>
            <span class="text-sm">
              {{
                currentStep === steps.STUDENT_START
                  ? "Student can now start the task"
                  : "Student has started working"
              }}
            </span>
          </div>

          <div
            v-if="
              currentStep === steps.STUDENT_WORKING ||
              currentStep === steps.STUDENT_COMPLETE
            "
            class="flex items-center space-x-3"
          >
            <div
              :class="[
                'w-3 h-3 rounded-full',
                currentStep === steps.STUDENT_WORKING
                  ? 'bg-yellow-400'
                  : 'bg-green-500',
              ]"
            ></div>
            <span class="text-sm">
              {{
                currentStep === steps.STUDENT_WORKING
                  ? "Student is currently editing the document"
                  : "Student has completed the task"
              }}
            </span>
          </div>

          <div
            v-if="currentStep === steps.STUDENT_COMPLETE"
            class="flex items-center space-x-3"
          >
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sm"
              >Task submitted with version saved - ready for your
              review</span
            >
          </div>
        </div>

        <div class="mt-6 pt-4 border-t">
          <p class="text-sm text-gray-500 mb-2">
            Switch to student view to continue the demo:
          </p>
          <NuxtLink
            to="/student"
            class="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Go to Student Dashboard →
          </NuxtLink>
        </div>
      </div>

      <!-- Step 4: Review Student Work -->
      <div
        v-if="currentStep === steps.TEACHER_REVIEW"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <h2 class="text-xl font-semibold mb-4">Review Student Submission</h2>
        <p class="text-gray-600 mb-6">
          The student has completed their work. Review the document and provide
          feedback.
        </p>

    

        <!-- Student Submission Attempts Section -->
        <div class="mt-6 bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-medium text-gray-900">
              Student Submission Attempts
            </h4>
            <button
              @click="refreshAttempts"
              class="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          <div v-if="submissionAttempts.length > 0" class="space-y-3">
            <div
              v-for="attempt in submissionAttempts"
              :key="attempt.attemptNumber"
              class="flex items-center justify-between p-3 bg-white rounded border hover:shadow-sm transition-shadow"
            >
              <div>
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900"
                    >Attempt {{ attempt.attemptNumber }}</span
                  >
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    Rev: {{ attempt.revisionId }}
                  </span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  Submitted: {{ formatAttemptTime(attempt.submittedAt) }}
                </div>
                <div class="text-xs text-gray-400">
                  Student: {{ attempt.studentEmail }}
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="openDocumentForReview"
                  class="inline-flex items-center px-3 py-1 border border-green-300 rounded text-sm text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"

                >
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                  Open Current Document
                </button>

                <button
                  @click="downloadAttempt(attempt, 'pdf')"
                  :disabled="
                    downloadingAttempt === `${attempt.attemptNumber}-pdf`
                  "
                  class="inline-flex items-center px-3 py-1 border border-red-300 rounded text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    v-if="downloadingAttempt !== `${attempt.attemptNumber}-pdf`"
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 mr-1 animate-spin"
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
                      d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  PDF
                </button>
                <button
                  @click="downloadAttempt(attempt, 'docx')"
                  :disabled="
                    downloadingAttempt === `${attempt.attemptNumber}-docx`
                  "
                  class="inline-flex items-center px-3 py-1 border border-blue-300 rounded text-sm text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    v-if="
                      downloadingAttempt !== `${attempt.attemptNumber}-docx`
                    "
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-4 h-4 mr-1 animate-spin"
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
                      d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  DOCX
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <svg
              class="w-12 h-12 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p class="text-sm text-gray-500">No submission attempts found</p>
            <p class="text-xs text-gray-400 mt-1">
              Attempts will appear here when students submit their work
            </p>
          </div>
        </div>

        <button
          @click="markReviewed"
          :disabled="isMarkingReviewed"
          class="inline-flex mt-4 items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="!isMarkingReviewed"
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <svg
            v-else
            class="w-4 h-4 mr-2 animate-spin"
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
              d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isMarkingReviewed ? "Finalizing..." : "Mark as Reviewed" }}
        </button>

     
      </div>

      <!-- Step 5: Completed -->
      <div
        v-if="currentStep === steps.COMPLETED"
        class="bg-white rounded-lg shadow-sm border p-6"
      >
        <div class="text-center py-8">
          <svg
            class="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Task Complete!
          </h3>
          <p class="text-gray-600 mb-6">
            The entire workflow has been completed successfully with full
            version history.
          </p>

          <!-- Version History Information -->
          <div
            class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6"
          >
            <div class="flex items-center space-x-2 mb-3">
              <svg
                class="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              <span class="text-sm font-medium text-purple-800"
                >Version History Created</span
              >
            </div>
            <div class="text-left text-sm text-purple-700">
              <p v-if="taskData.submissionRevisionId">
                📝 <strong>Submission Version:</strong>
                {{ taskData.submissionRevisionId }} - Created when student
                submitted work
              </p>
              <p v-else>
                📝 <strong>Submission Version:</strong> Created when student
                submitted work
              </p>
              <p>
                🎓 <strong>Review Complete Version:</strong> Created when
                teacher completed review
              </p>
              <p>📚 Both versions are permanently saved in document history</p>
            </div>
          </div>

          <div class="flex space-x-4 justify-center">
            <button
              @click="resetFlow"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Start New Task
            </button>
            <button
              @click="viewVersionHistory"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              View Version History
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  currentStep,
  selectedDoc,
  taskData,
  steps,
  markTeacherReviewed,
  resetFlow,
  getStepInfo,
  getDocumentForReview,
} = useTaskFlow();

const { getStoredAttempts, downloadAttemptVersion } = useGoogleDrive();

// Loading states
const isMarkingReviewed = ref(false);
const downloadingAttempt = ref(null);
const isDownloadingAll = ref(false);

// Submission attempts
const submissionAttempts = ref([]);

const stepInfo = computed(() => getStepInfo());

// Load attempts when component mounts or task changes
const loadSubmissionAttempts = () => {
  if (taskData.value.studentCopyId) {
    submissionAttempts.value = getStoredAttempts(taskData.value.studentCopyId);
    console.log("Loaded attempts:", submissionAttempts.value);
  }
};

// Watch for changes in student copy ID
watch(
  () => taskData.studentCopyId,
  () => {
    loadSubmissionAttempts();
  },
  { immediate: true }
);

// Format attempt timestamp for display
const formatAttemptTime = (timestamp) => {
  if (!timestamp) return "Unknown";
  try {
    return new Date(timestamp).toLocaleString();
  } catch (e) {
    return "Invalid date";
  }
};

const refreshAttempts = () => {
  loadSubmissionAttempts();
};

const openDocumentForReview = () => {
  const reviewUrl = getDocumentForReview();
  if (reviewUrl) {
    console.log("Opening current document for review:", reviewUrl);
    window.open(reviewUrl, "_blank");
  } else {
    alert("Document URL not available");
  }
};

const downloadAttempt = async (attempt, format) => {
  const downloadKey = `${attempt.attemptNumber}-${format}`;
  downloadingAttempt.value = downloadKey;

  try {
    const fileName = `Attempt_${attempt.attemptNumber}_${
      attempt.studentEmail.split("@")[0]
    }_${attempt.submittedAt.split("T")[0]}`;

    await downloadAttemptVersion(
      attempt.docId,
      attempt.revisionId,
      fileName,
      format
    );

    console.log(`Downloaded attempt ${attempt.attemptNumber} as ${format}`);
  } catch (error) {
    console.error("Failed to download attempt:", error);
    alert(
      `Failed to download attempt ${
        attempt.attemptNumber
      } as ${format.toUpperCase()}. Please try again.`
    );
  } finally {
    downloadingAttempt.value = null;
  }
};

const markReviewed = async () => {
  if (isMarkingReviewed.value) return;

  isMarkingReviewed.value = true;
  console.log("Creating review completion version and finalizing document...");

  try {
    await markTeacherReviewed();
  } catch (error) {
    console.error("Failed to mark as reviewed:", error);
  } finally {
    isMarkingReviewed.value = false;
  }
};

const viewVersionHistory = () => {
  if (taskData.studentCopyId) {
    const { openVersionHistory } = useGoogleDrive();
    openVersionHistory(taskData.studentCopyId);
  } else {
    alert("Document not available for version history");
  }
};

// Load attempts when component mounts
onMounted(() => {
  loadSubmissionAttempts();
});
</script>
