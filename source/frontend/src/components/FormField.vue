<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  fieldId: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="grid gap-1.5">
    <label :for="fieldId" class="text-sm font-medium text-text-primary">
      {{ label }}
    </label>
    <slot :error-id="error ? `${fieldId}-error` : undefined" />
    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="text-sm text-danger"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
