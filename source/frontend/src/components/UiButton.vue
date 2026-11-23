<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "outline", "ghost", "danger"].includes(value),
  },
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const variants = {
  primary: "border-transparent bg-primary text-white hover:bg-primary-hover",
  secondary: "border-transparent bg-slate-100 text-text-primary hover:bg-slate-200",
  outline: "border-border bg-white text-text-primary hover:bg-slate-50",
  ghost: "border-transparent bg-transparent text-text-secondary hover:bg-slate-100",
  danger: "border-transparent bg-danger text-white hover:bg-red-700",
};
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-control border px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    :class="variants[props.variant]"
  >
    <slot />
  </button>
</template>
