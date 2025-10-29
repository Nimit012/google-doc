<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Student View</h1>
      <p class="text-gray-600">Complete tasks and submit</p>
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
            You'll be able to start once the author completes the document
            setup.
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

      <!-- Hidden StudentDocLauncher for functionality -->
      <div v-if="currentStep === steps.STUDENT_START" style="display: none">
        <StudentDocLauncher
          ref="studentDocLauncherRef"
          :master-doc-id="taskData.masterCopyId"
          :original-doc-id="taskData.originalDocId"
          :task-title="taskData.title"
          :task-description="taskData.description"
          :student-email="taskData.studentEmail"
          @assignment-started="handleAssignmentStarted"
          @copy-created="handleCopyCreated"
        />
      </div>

      <!-- Document Preview Section - Show from student start onwards -->
      <div
        v-if="
          currentStep === steps.STUDENT_START ||
          currentStep === steps.STUDENT_WORKING ||
          currentStep === steps.STUDENT_COMPLETE ||
          currentStep === steps.TEACHER_REVIEW ||
          currentStep === steps.COMPLETED
        "
        class="bg-white rounded-lg shadow-sm border"
      >
        <!-- Content Area -->
        <div class="p-6">
          <!-- Rich Text Block -->
          <div class="mb-6">
            <div class="py-3">
              <blockquote class="text-gray-800 leading-relaxed">
                "We shall fight on the beaches, we shall fight on the landing
                grounds, we shall fight in the fields and in the streets, we
                shall fight in the hills; we shall never surrender."
              </blockquote>
            </div>
          </div>

          <!-- Google Document Block -->
          <div>
            <div class="bg-white rounded-lg">
              <div class="flex items-start space-x-4 mb-4">
                <div class="flex-shrink-0">
                  <h4 class="mb-2">
                    Using the materials included, complete the activities in the
                    Google Document below
                  </h4>

                  <!-- Document thumbnail or fallback -->
                  <div
                    v-if="selectedDoc?.thumbnailLink"
                    class="w-[10rem] h-[12rem] border border-gray-200 rounded overflow-hidden bg-gray-50"
                  >
                    <img
                      :src="selectedDoc.thumbnailLink"
                      :alt="selectedDoc.name || taskData.title"
                      class="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      referrerpolicy="no-referrer"
                       @click="openPdf"
                    />
                  </div>

                  <!-- Fallback when no thumbnail -->
                  <div
                    v-else
                    class="w-[10rem] h-[12rem] bg-blue-50 border border-blue-200 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                    @click="openStudentDocument"
                  >
                    <svg
                      class="w-10 h-10 text-blue-500 mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                      />
                    </svg>
                    <span class="text-xs text-blue-600 text-center px-2">{{
                      taskData.title || "Task Document"
                    }}</span>
                  </div>

                  <div class="flex items-center justify-between my-4">
                    <button
                      @click="openDocumentPreview"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </svg>
                      Open Document
                    </button>
                  </div>
                </div>
              </div>

              <!-- Status and Action Area -->
              <div class="space-y-4">
                <!-- Action Buttons Area -->
                <div class="border-t pt-4">
                  <!-- Student Start - Start Task Button -->
                  <div
                    v-if="currentStep === steps.STUDENT_START"
                    class="flex items-center space-x-4"
                  >
                    <button
                      @click="handleStartAssignment"
                      :disabled="isStartingAssignment"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        v-if="!isStartingAssignment"
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h2m4 0h2M9 7a3 3 0 00-3 3v8a2 2 0 002 2h8a2 2 0 002-2V10a3 3 0 00-3-3H9z"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{ isStartingAssignment ? "Creating Copy..." : "Start" }}
                    </button>
                    <span class="text-sm text-gray-500">
                      {{
                        isStartingAssignment
                          ? "Creating your working copy..."
                          : "Click to create your working copy and begin"
                      }}
                    </span>
                  </div>

                  <!-- Student Working - Mark Complete Button -->
                  <div
                    v-else-if="currentStep === steps.STUDENT_WORKING"
                    class="flex items-center space-x-4"
                  >
                    <button
                      @click="markComplete"
                      :disabled="isMarkingComplete"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        v-if="!isMarkingComplete"
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
                          d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {{
                        isMarkingComplete ? "Submitting..." : "Mark as Complete"
                      }}
                    </button>
                    <span class="text-sm text-gray-500">
                      {{
                        isMarkingComplete
                          ? "Transferring to teacher for review..."
                          : "Click when you've finished your work"
                      }}
                    </span>
                  </div>

                  <!-- Student Complete/Teacher Review - Status Display -->
                  <div
                    v-else-if="
                      currentStep === steps.STUDENT_COMPLETE ||
                      currentStep === steps.TEACHER_REVIEW
                    "
                  >
                    <div class="text-center py-4">
                      <div
                        class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
                      >
                        <svg
                          class="w-6 h-6 text-green-600"
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
                      </div>
                      <h4 class="font-medium text-gray-900 mb-2">
                        Task Submitted!
                      </h4>
                      <p class="text-sm text-gray-600 mb-4">
                        Your work has been submitted successfully and is now
                        waiting for teacher review.
                      </p>

                      <div
                        class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
                      >
                        <div class="flex items-center justify-center space-x-2">
                          <svg
                            class="w-4 h-4 text-yellow-600"
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
                          <span class="text-sm font-medium text-yellow-800">
                            {{
                              currentStep === steps.STUDENT_COMPLETE
                                ? "Waiting for teacher review"
                                : "Teacher is reviewing your work"
                            }}
                          </span>
                        </div>
                      </div>

                      <p class="text-xs text-gray-500">
                        Your editing access has been removed, but you can still
                        view the document. Your teacher now has editing access
                        for review.
                      </p>
                    </div>
                  </div>

                  <!-- Completed - Final Status -->
                  <div v-else-if="currentStep === steps.COMPLETED">
                    <div class="text-center py-4">
                      <div
                        class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"
                      >
                        <svg
                          class="w-6 h-6 text-green-600"
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
                      </div>
                      <h4 class="font-medium text-gray-900 mb-2">
                        Task Complete!
                      </h4>
                      <p class="text-sm text-gray-600 mb-4">
                        Your teacher has reviewed and completed the task
                        process.
                      </p>

                      <div class="text-left max-w-sm mx-auto mb-4">
                        <h5 class="text-xs font-medium text-gray-700 mb-2">
                          Process Complete:
                        </h5>
                        <div class="space-y-1 text-xs text-gray-600">
                          <div class="flex items-center space-x-2">
                            <svg
                              class="w-3 h-3 text-green-600"
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
                            <span>Work submitted with version saved</span>
                          </div>
                          <div class="flex items-center space-x-2">
                            <svg
                              class="w-3 h-3 text-green-600"
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
                            <span
                              >Teacher reviewed with final version saved</span
                            >
                          </div>
                          <div class="flex items-center space-x-2">
                            <svg
                              class="w-3 h-3 text-green-600"
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
                            <span
                              >Document archived with full version history</span
                            >
                          </div>
                        </div>
                      </div>

                      <button
                        @click="resetFlow"
                        class="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Try Another Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <div
          v-if="
            currentStep === steps.STUDENT_COMPLETE ||
            currentStep === steps.TEACHER_REVIEW
          "
          class="px-6 pb-6"
        >
          <div class="pt-4 border-t text-center">
            <p class="text-sm text-gray-500 mb-2">
              Switch to teacher view to continue the demo:
            </p>
            <NuxtLink
              to="/teacher"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Go to Teacher Dashboard →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Submission Success Modal -->
    <div
      v-if="showSubmissionModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeSubmissionModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3 text-center">
          <!-- Success Icon -->
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4"
          >
            <svg
              class="h-8 w-8 text-green-600"
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
          </div>

          <!-- Modal Content -->
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-2">
            Task Submitted Successfully!
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 mb-4">
              Your work has been submitted and is now ready for teacher review.
              You no longer have editing access, but you can still view the
              document.
            </p>
            <p class="text-xs text-gray-400 mb-6">
              Document:
              {{ selectedDoc?.name || taskData?.title || "Task Document" }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col space-y-3 px-4 py-3">
            <NuxtLink
              to="/teacher"
              @click="closeSubmissionModal"
              class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-center"
            >
              Go to Teacher View
            </NuxtLink>
            <button
              @click="closeSubmissionModal"
              class="w-full px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Stay on Student View
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StudentDocLauncher from "~/components/TaskFlow/StudentDocLauncher.vue";

const {
  currentStep,
  taskData,
  selectedDoc,
  steps,
  startStudentTask,
  markStudentComplete,
  resetFlow,
  getStepInfo,
  openStudentDocument,
} = useTaskFlow();

const stepInfo = computed(() => getStepInfo());

// Loading states
const isMarkingComplete = ref(false);
const isStartingAssignment = ref(false);

// Add submission modal state
const showSubmissionModal = ref(false);

// Refs
const studentDocLauncherRef = ref(null);
const studentCopyData = ref(null);

// Debug watcher
watch(
  currentStep,
  (newStep, oldStep) => {
    console.log(
      `🎓 Student component detected step change: ${oldStep} → ${newStep}`
    );
  },
  { immediate: true }
);

// Also watch the raw value
watch(
  () => currentStep.value,
  (newVal) => {
    console.log(
      `🎓 Student component - currentStep.value changed to: ${newVal}`
    );
  },
  { immediate: true }
);

const handleStartAssignment = async () => {
  if (isStartingAssignment.value) return;

  isStartingAssignment.value = true;
  openStudentDocument();

  try {
    // Trigger the StudentDocLauncher to start the assignment
    if (
      studentDocLauncherRef.value &&
      studentDocLauncherRef.value.startAssignment
    ) {
      await studentDocLauncherRef.value.startAssignment();
    } else {
      // Fallback: call the methods directly if exposed
      console.log("Starting assignment manually...");
      // You might need to implement this logic here if StudentDocLauncher doesn't expose the method
    }
  } catch (error) {
    console.error("Failed to start assignment:", error);
  } finally {
    isStartingAssignment.value = false;
  }
};

const handleAssignmentStarted = (assignmentData) => {
  console.log("Assignment started:", assignmentData);
  isStartingAssignment.value = false;
  // The StudentDocLauncher has already opened the document
  // Just update our flow state
  startStudentTask(assignmentData);
};
const openPdf = async () => {
  await studentDocLauncherRef.value.downloadAttempt();
  
};
const handleCopyCreated = (copyData) => {
  console.log("Document copy created:", copyData);
  studentCopyData.value = {
    ...copyData,
  };
  console.log("Document copy created:", studentCopyData.value);
  isStartingAssignment.value = false;
  // Store copy information in task flow
  startStudentTask(copyData);
};

const openDocumentPreview = () => {
  const data = taskData.value;
  console.log("Task Data:", data);

  // Helper to normalize Drive URLs (handles file IDs or full links)
  const buildDocUrl = (idOrUrl) => {
    if (!idOrUrl) return null;
    // If it's already a full URL, return as-is
    if (idOrUrl.startsWith("http")) return idOrUrl;
    // Otherwise, treat it as a file ID
    return `https://docs.google.com/document/d/${idOrUrl}/edit`;
  };

  // Before assignment starts: show master copy for preview
  if (currentStep.value === steps.STUDENT_START) {
    const url =
      buildDocUrl(data.masterCopyUrl) || buildDocUrl(selectedDoc.value?.url);
    if (url) {
      window.open(url, "_blank");
    } else {
      console.warn("No master copy URL available for preview");
    }
  }

  // After assignment starts: show student working copy
  else if (
    [
      steps.STUDENT_WORKING,
      steps.STUDENT_COMPLETE,
      steps.TEACHER_REVIEW,
      steps.COMPLETED,
    ].includes(currentStep.value)
  ) {
    const url = buildDocUrl(data.studentCopyUrl);
    if (url) {
      console.log("Opening student copy:", url);
      window.open(url, "_blank");
    } else {
      console.warn("No student copy URL available for preview");
    }
  }

  // Fallback
  else {
    console.warn("No document URL available for preview");
  }
};

// MODIFIED METHOD: Mark complete and show modal
const markComplete = async () => {
  if (isMarkingComplete.value) return;

  isMarkingComplete.value = true;
  console.log(
    "Updating permissions: removing edit access, keeping view access..."
  );

  try {
    await markStudentComplete(studentCopyData.value);

    // Show the submission modal after successful completion
    showSubmissionModal.value = true;
  } catch (error) {
    console.error("Failed to mark assignment complete:", error);
    // You might want to show an error message to the user here
  } finally {
    isMarkingComplete.value = false;
  }
};

// NEW METHOD: Close submission modal
const closeSubmissionModal = () => {
  showSubmissionModal.value = false;
};

// Debug mounted
onMounted(() => {
  console.log("🎓 Student component mounted, currentStep:", currentStep.value);

  // Click outside to close modal
  const handleClickOutside = (event) => {
    // Close modal when clicking outside of it
    if (
      showSubmissionModal.value &&
      event.target === event.currentTarget &&
      event.target.classList.contains("bg-opacity-50")
    ) {
      closeSubmissionModal();
    }
  };

  document.addEventListener("click", handleClickOutside);

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>
