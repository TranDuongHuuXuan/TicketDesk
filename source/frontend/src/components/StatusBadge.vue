<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const statusMap = {
  // Visual variants for the design-system sample only; not TicketDesk API states.
  OPEN: { label: "Open", classes: "bg-brand-50 text-brand-700 ring-brand-200" },
  REJECTED: {
    label: "Rejected",
    classes: "bg-red-50 text-red-700 ring-red-200",
  },
  NEW: { label: "New", classes: "bg-brand-50 text-brand-700 ring-brand-200" },
  IN_PROGRESS: {
    label: "In Progress",
    classes: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  RESOLVED: {
    label: "Resolved",
    classes: "bg-green-50 text-green-700 ring-green-200",
  },
  CLOSED: {
    label: "Closed",
    classes: "bg-slate-100 text-slate-700 ring-slate-200",
  },
};

const displayStatus = computed(
  () => statusMap[props.status] ?? { label: props.status, classes: "bg-slate-100 text-slate-700 ring-slate-200" },
);
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="displayStatus.classes"
  >
    {{ displayStatus.label }}
  </span>
</template>
