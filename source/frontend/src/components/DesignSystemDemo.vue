<script setup>
import { ref } from "vue";
import FormField from "./FormField.vue";
import StatusBadge from "./StatusBadge.vue";
import UiButton from "./UiButton.vue";

const selectedStatus = ref("IN_PROGRESS");
const notifyByEmail = ref(true);
</script>

<template>
  <details class="mt-8 overflow-hidden rounded-card border border-border bg-surface shadow-card">
    <summary class="cursor-pointer list-none px-5 py-4 font-semibold text-text-primary marker:hidden">
      Design system preview
      <span class="ml-2 text-sm font-normal text-text-secondary">(expand)</span>
    </summary>

    <div class="border-t border-border p-5 md:p-6">
      <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">TicketDesk UI</p>
          <h2 class="mt-1 text-xl font-semibold tracking-tight text-text-primary">Reusable foundation</h2>
          <p class="mt-1 text-sm text-text-secondary">
            Buttons, form controls, status indicators and layout surfaces.
          </p>
        </div>
        <StatusBadge :status="selectedStatus" />
      </div>

      <div class="grid gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside class="rounded-card bg-sidebar p-4 text-white">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Workspace</p>
          <nav class="grid gap-1 text-sm" aria-label="Demo sidebar">
            <a href="#buttons" class="rounded-control bg-sidebar-hover px-3 py-2 font-medium">Overview</a>
            <a href="#form-controls" class="rounded-control px-3 py-2 text-slate-300 hover:bg-sidebar-hover">Tickets</a>
            <a href="#statuses" class="rounded-control px-3 py-2 text-slate-300 hover:bg-sidebar-hover">Reports</a>
          </nav>
        </aside>

        <div class="min-w-0 space-y-5">
          <section id="buttons" class="rounded-card border border-border bg-white p-4">
            <h3 class="mb-3 text-base font-semibold text-text-primary">Buttons</h3>
            <div class="flex flex-wrap gap-2">
              <UiButton variant="primary">Primary</UiButton>
              <UiButton variant="secondary">Secondary</UiButton>
              <UiButton variant="outline">Outline</UiButton>
              <UiButton variant="ghost">Ghost</UiButton>
              <UiButton variant="danger">Danger</UiButton>
            </div>
          </section>

          <section id="form-controls" class="rounded-card border border-border bg-white p-4">
            <h3 class="mb-3 text-base font-semibold text-text-primary">Form controls</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <FormField label="Subject" field-id="demo-subject">
                <template #default="{ errorId }">
                  <input
                    id="demo-subject"
                    :aria-describedby="errorId"
                    class="h-10 rounded-control border border-border bg-white px-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
                    placeholder="Short ticket summary"
                  />
                </template>
              </FormField>

              <FormField label="Status" field-id="demo-status">
                <select
                  id="demo-status"
                  v-model="selectedStatus"
                  class="h-10 rounded-control border border-border bg-white px-3 text-sm text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </FormField>

              <FormField label="Description" field-id="demo-description">
                <textarea
                  id="demo-description"
                  class="min-h-24 rounded-control border border-border bg-white p-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
                  placeholder="Describe the issue..."
                ></textarea>
              </FormField>

              <div class="flex flex-col justify-between gap-4">
                <label class="flex items-center gap-2 text-sm text-text-primary">
                  <input
                    v-model="notifyByEmail"
                    type="checkbox"
                    class="size-4 rounded border-border accent-primary"
                  />
                  Email me about updates
                </label>
                <p class="text-sm text-danger" role="alert">Example validation message.</p>
              </div>
            </div>
          </section>

          <section id="statuses" class="rounded-card border border-border bg-white p-4">
            <h3 class="mb-3 text-base font-semibold text-text-primary">Ticket statuses</h3>
            <div class="flex flex-wrap gap-2">
              <StatusBadge status="OPEN" />
              <StatusBadge status="NEW" />
              <StatusBadge status="IN_PROGRESS" />
              <StatusBadge status="RESOLVED" />
              <StatusBadge status="REJECTED" />
              <StatusBadge status="CLOSED" />
            </div>
          </section>
        </div>
      </div>
    </div>
  </details>
</template>
