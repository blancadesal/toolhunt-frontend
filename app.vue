<template>
  <div
    data-theme="emerald"
    class="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-base-300"
  >
    <TopMenuBar class="flex-shrink-0" />
    <div class="flex-grow">
      <NuxtPage />
    </div>
    <footer class="footer bg-primary text-primary-content p-2 flex-shrink-0">
      <div class="container mx-auto px-4">
        <p class="text-center text-sm">
          Toolhunt was developed as an
          <a
            href="https://www.outreachy.org/"
            target="_blank"
            class="link"
          >Outreachy</a>
          internship project. // Licensed under the
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.en.html"
            target="_blank"
            class="link"
          >GNU GPL3</a>
          //
          <a
            href="https://github.com/blancadesal/toolhunt-backend"
            target="_blank"
            class="link"
          >Source code</a>
          available on GitHub //
          <a
            href="https://phabricator.wikimedia.org/tag/toolhunt/"
            target="_blank"
            class="link"
          >Bug tracking</a>
          on Wikimedia Phabricator //
          <a
            href="/api/v1/docs"
            target="_blank"
            class="link"
          >API documentation</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { fetchUserData } = useAuth()

onMounted(() => {
  fetchUserData()
})
</script>
