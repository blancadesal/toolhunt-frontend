<script setup>
const { authState, isLoggedIn, fetchUserData } = useAuth()
const { userContributions, fetchUserContributions, error: contributionsError } = useToolhuntApi()
const loadingContributions = ref(false)

const totalContributions = computed(() => userContributions.value.total_contributions || 0)

const fetchContributions = async () => {
  if (!isLoggedIn.value || !authState.value?.user?.username) return

  loadingContributions.value = true
  try {
    await fetchUserContributions(authState.value.user.username)
  }
  finally {
    loadingContributions.value = false
  }
}

onMounted(async () => {
  await fetchUserData()
  await fetchContributions()
})
</script>

<template>
  <div class="flex flex-col min-h-screen py-12">
    <div class="container mx-auto px-4 sm:max-w-5xl">
      <div
        v-if="loadingContributions"
        class="flex justify-center"
      >
        <span class="loading loading-spinner loading-lg" />
      </div>
      <div v-else>
        <div v-if="isLoggedIn">
          <!-- Welcome and Total Contributions Section -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold mb-2">
              Welcome, <span class="text-accent">{{ authState.user.username }}</span>!
            </h2>
            <p class="text-lg">
              Total Contributions: <span class="font-bold text-accent">{{ totalContributions }}</span>
            </p>
          </div>

          <!-- Latest Activity Section -->
          <LatestActivity
            :contributions="userContributions.contributions"
            :loading="loadingContributions"
            :error="contributionsError"
          />
        </div>
        <div
          v-else
          class="alert alert-warning mb-8"
        >
          Please log in to view your profile.
        </div>
      </div>
    </div>
  </div>
</template>
