<!-- Custom input component for a form, using daisy and tailwind styling -->
<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  icon?: string
  titleLeft?: string
  titleRight?: string
  errorMessage?: string
  placeholder?: string
  modelValue: string
  maxLength?: number
  disabled?: boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'textarea'
}>()

const showTitle = computed(() => props.titleLeft || props.titleRight)

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="form-control w-full max-w-full">
    <div class="label" v-if="showTitle">
      <span class="label-text text-lg">{{ titleLeft }}</span>
      <span class="label-text text-lg">{{ titleRight }}</span>
      <small v-if="maxLength">{{ `${modelValue.length} / ${maxLength}` }}</small>
    </div>

    <!-- If icon is provided then show input with icon -->
    <label v-if="icon" class="input flex gap-2 items-center w-full bg-neutral-200">
      <i :class="icon + ' opacity-55'"></i>
      <textarea
        :disabled="disabled"
        :maxlength="maxLength"
        v-if="type === 'textarea'"
        class="textarea h-24 bg-neutral-200 resize-none"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
      ></textarea>
      <input
        :disabled="disabled"
        v-else
        :type="type"
        :maxlength="maxLength"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        class="w-full"
      />
    </label>
    <!-- Else just provide the input -->
    <template v-else>
      <textarea
        :disabled="disabled"
        v-if="type === 'textarea'"
        :maxlength="maxLength"
        class="textarea h-24 bg-neutral-200 resize-none"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      ></textarea>
      <input
        v-else
        :type="type"
        :disabled="disabled"
        :maxlength="maxLength"
        :placeholder="placeholder"
        class="input w-full bg-neutral-200"
        :value="modelValue"
        @input="onInput"
      />
    </template>

    <div v-if="errorMessage" class="label">
      <span class="label-text-alt text-red-600">{{ errorMessage }}</span>
    </div>
  </label>
</template>
