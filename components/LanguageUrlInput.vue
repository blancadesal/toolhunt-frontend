<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  disabled: Boolean,
})

const emit = defineEmits(['update:modelValue', 'enter'])

const languageUrlPairs = ref([{ language: '', url: '' }])

const updateModelValue = () => {
  emit('update:modelValue', [...languageUrlPairs.value])
}

const addPair = () => {
  languageUrlPairs.value = [...languageUrlPairs.value, { language: '', url: '' }]
  updateModelValue()
}

const removePair = (index) => {
  if (languageUrlPairs.value.length > 1) {
    languageUrlPairs.value = languageUrlPairs.value.filter((_, i) => i !== index)
    updateModelValue()
  }
}

const cleanupEmptyPairs = () => {
  languageUrlPairs.value = languageUrlPairs.value.filter(pair => pair.language || pair.url)
  if (languageUrlPairs.value.length === 0) {
    languageUrlPairs.value = [{ language: '', url: '' }]
  }
  updateModelValue()
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    emit('enter', event)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue.length) {
    languageUrlPairs.value = [...newValue]
  }
  else if (languageUrlPairs.value.length === 0) {
    languageUrlPairs.value = [{ language: '', url: '' }]
  }
}, { deep: true })

onMounted(() => {
  if (props.modelValue.length) {
    languageUrlPairs.value = [...props.modelValue]
  }
})
</script>

<template>
  <div>
    <div
      v-for="(pair, index) in languageUrlPairs"
      :key="index"
      class="flex mb-2 items-center"
    >
      <input
        :value="pair.language"
        type="text"
        placeholder="Language (e.g., en)"
        class="input input-bordered w-1/4 mr-2"
        :disabled="disabled"
        @input="(e) => { pair.language = e.target.value; updateModelValue(); }"
        @keydown="handleKeydown"
        @blur="cleanupEmptyPairs"
      >
      <input
        :value="pair.url"
        type="url"
        placeholder="URL"
        class="input input-bordered flex-1 mr-2"
        :disabled="disabled"
        @input="(e) => { pair.url = e.target.value; updateModelValue(); }"
        @keydown="handleKeydown"
        @blur="cleanupEmptyPairs"
      >
      <button
        v-if="languageUrlPairs.length > 1"
        class="btn btn-ghost btn-sm p-1 h-8 w-8 min-h-0 hover:bg-base-200"
        :disabled="disabled"
        title="Remove"
        @click="removePair(index)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <button
      class="btn btn-outline btn-sm mt-2"
      :disabled="disabled"
      @click="addPair"
    >
      Add Language
    </button>
  </div>
</template>
