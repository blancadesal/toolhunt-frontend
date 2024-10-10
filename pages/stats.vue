<script setup>
const { allContributions, fetchAllContributions, error: apiError } = useToolhuntApi()
const loading = ref(false)

const fetchContributions = async () => {
  loading.value = true
  try {
    await fetchAllContributions()
  }
  catch (err) {
    console.error('Error fetching contributions:', err)
  }
  finally {
    loading.value = false
  }
}

onMounted(fetchContributions)
</script>

<template>
  <div class="flex flex-col min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <h1 class="text-3xl font-bold mb-8 text-center">
        Toolhunt Stats
      </h1>
      <LatestActivity
        :contributions="allContributions.contributions"
        :loading="loading"
        :error="apiError"
        :show-username="true"
      />
    </div>
  </div>
</template>
