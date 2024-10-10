<script setup>
const props = defineProps({
  contributions: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  showUsername: {
    type: Boolean,
    default: false,
  },
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const paginatedContributions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.contributions.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(props.contributions.length / itemsPerPage),
)

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage
  }
}

const pageRange = computed(() => {
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="bg-secondary text-secondary-content p-4 pl-6 sm:pl-10 rounded-t-xl">
      <h2 class="text-2xl font-bold">
        Latest Activity
      </h2>
    </div>
    <div class="card-body pt-4 px-2 sm:px-6">
      <div
        v-if="loading"
        class="flex justify-center"
      >
        <span class="loading loading-spinner loading-lg" />
      </div>
      <div
        v-else-if="error"
        class="alert alert-error"
      >
        {{ error }}
      </div>
      <div
        v-else-if="contributions.length > 0"
        class="overflow-x-auto"
      >
        <table class="table w-full mb-6">
          <thead>
            <tr>
              <th class="px-2 sm:px-4">
                Date
              </th>
              <th
                v-if="showUsername"
                class="px-2 sm:px-4"
              >
                Hunter
              </th>
              <th class="px-2 sm:px-4">
                Tool Name
              </th>
              <th class="px-2 sm:px-4">
                Annotation
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contribution in paginatedContributions"
              :key="contribution.date"
            >
              <td class="px-2 sm:px-4 text-xs sm:text-sm">
                {{ formatDate(contribution.date) }}
              </td>
              <td
                v-if="showUsername"
                class="px-2 sm:px-4 text-xs sm:text-sm"
              >
                {{ contribution.username }}
              </td>
              <td class="px-2 sm:px-4 text-xs sm:text-sm">
                {{ contribution.tool_title }}
              </td>
              <td class="px-2 sm:px-4 text-xs sm:text-sm">
                {{ toHumanReadable(contribution.field) }}
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination controls -->
        <div class="flex flex-wrap justify-center items-center mt-6 mb-4 space-y-2">
          <!-- Mobile view -->
          <div class="flex items-center space-x-3 sm:hidden w-full justify-center">
            <button
              class="btn btn-xs btn-outline btn-secondary px-2"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              &lt;
            </button>
            <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              class="btn btn-xs btn-outline btn-secondary px-2"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              &gt;
            </button>
          </div>
          <!-- Desktop view -->
          <div class="hidden sm:flex items-center space-x-1">
            <button
              class="btn btn-xs btn-outline btn-secondary px-2"
              :disabled="currentPage === 1"
              @click="changePage(1)"
            >
              First
            </button>
            <button
              class="btn btn-xs btn-outline btn-secondary px-2"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              &lt;
            </button>
            <button
              v-for="page in pageRange"
              :key="page"
              class="btn btn-xs btn-outline btn-secondary px-2"
              :class="{ 'btn-active': page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button
              class="btn btn-xs btn-outline btn-secondary px-2"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              &gt;
            </button>
            <button
              class="btn btn-xs btn-outline btn-secondary px-2"
              :disabled="currentPage === totalPages"
              @click="changePage(totalPages)"
            >
              Last
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-center text-base-content/70"
      >
        No activity found. Start contributing to see your activity here!
      </div>
    </div>
  </div>
</template>
