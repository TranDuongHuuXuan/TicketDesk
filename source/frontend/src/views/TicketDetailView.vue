<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

// ============ MOCK DATA ============
const ticket = ref({
  id: 1024,
  title: "Cannot access the billing dashboard",
  description: "Hi team,\n\nI've been trying to access the billing dashboard for the last 2 hours but I keep getting a 403 Forbidden error. I've already tried clearing my cache and logging out/in again.\n\nCould someone please check if my account permissions were changed recently?\n\nThanks,\nJohn",
  status: "IN_PROGRESS",
  priority: "HIGH",
  requester: { name: "John Doe", email: "john@example.com", avatar: "J" },
  assignee: { name: "Sarah Agent", email: "sarah@ticketdesk.com", avatar: "S" },
  createdAt: "2023-10-24T09:30:00Z",
  updatedAt: "2023-10-24T14:15:00Z",
  tags: ["Billing", "Access", "Bug"],
});

const activities = ref([
  { id: 1, type: "created", user: "John Doe", time: "2023-10-24T09:30:00Z", content: "created this ticket." },
  { id: 2, type: "assigned", user: "System", time: "2023-10-24T09:31:00Z", content: "automatically assigned this ticket to Sarah Agent." },
  { id: 3, type: "comment", user: "Sarah Agent", time: "2023-10-24T10:15:00Z", content: "Hi John, I'm looking into this now. Can you confirm if you're on a VPN?" },
  { id: 4, type: "status_change", user: "Sarah Agent", time: "2023-10-24T10:16:00Z", content: "changed status from <b>NEW</b> to <b>IN PROGRESS</b>." },
  { id: 5, type: "comment", user: "John Doe", time: "2023-10-24T11:00:00Z", content: "Yes, I am on the corporate VPN. Should I disconnect it?" },
  { id: 6, type: "status_change", user: "Sarah Agent", time: "2023-10-24T14:15:00Z", content: "moved priority to <b>HIGH</b>." },
]);

const newComment = ref("");
const isSubmitting = ref(false);

// ============ HELPERS ============
const statusConfig = computed(() => {
  const map = {
    NEW: { label: "New", class: "bg-blue-100 text-blue-700 border-blue-200" },
    IN_PROGRESS: { label: "In Progress", class: "bg-amber-100 text-amber-700 border-amber-200" },
    RESOLVED: { label: "Resolved", class: "bg-green-100 text-green-700 border-green-200" },
    CLOSED: { label: "Closed", class: "bg-slate-100 text-slate-700 border-slate-200" },
  };
  return map[ticket.value.status] || map.NEW;
});

const priorityConfig = computed(() => {
  const map = {
    LOW: { label: "Low", class: "bg-slate-100 text-slate-600 border-slate-200" },
    MEDIUM: { label: "Medium", class: "bg-blue-100 text-blue-700 border-blue-200" },
    HIGH: { label: "High", class: "bg-orange-100 text-orange-700 border-orange-200" },
    URGENT: { label: "Urgent", class: "bg-red-100 text-red-700 border-red-200" },
  };
  return map[ticket.value.priority] || map.MEDIUM;
});

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  }).format(date);
}

function getActivityIcon(type) {
  if (type === "created") return { bg: "bg-blue-100", color: "text-blue-600", path: "M12 4v16m8-8H4" };
  if (type === "assigned") return { bg: "bg-purple-100", color: "text-purple-600", path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" };
  if (type === "status_change") return { bg: "bg-amber-100", color: "text-amber-600", path: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" };
  return { bg: "bg-slate-100", color: "text-slate-600", path: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" };
}

function submitComment() {
  if (!newComment.value.trim()) return;
  isSubmitting.value = true;
  
  // Giả lập gọi API
  setTimeout(() => {
    activities.value.push({
      id: Date.now(),
      type: "comment",
      user: auth.user?.username || "Current User",
      time: new Date().toISOString(),
      content: newComment.value,
    });
    newComment.value = "";
    isSubmitting.value = false;
  }, 500);
}
</script>

<template>
  <div class="min-h-screen bg-background text-text-primary">
    <!-- Header -->
    <header class="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div class="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4 min-w-0">
          <button @click="router.back()" class="rounded-full p-2 text-text-secondary hover:bg-slate-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" class="size-5">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="min-w-0">
            <p class="text-xs text-text-secondary">Tickets <span class="px-1">/</span> #{{ ticket.id }}</p>
            <h1 class="truncate text-lg font-semibold text-text-primary">{{ ticket.title }}</h1>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="hidden sm:inline-flex h-9 items-center justify-center rounded-control border border-border px-4 text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors">
            Edit
          </button>
          <button class="inline-flex h-9 items-center justify-center rounded-control bg-danger px-4 text-sm font-medium text-white hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        
        <!-- ========== LEFT COLUMN: Ticket Content & Activity ========== -->
        <div class="space-y-6">
          
          <!-- Ticket Details Card -->
          <article class="rounded-card border border-border bg-surface shadow-card overflow-hidden">
            <div class="border-b border-border p-6">
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <span class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold" :class="statusConfig.class">
                  {{ statusConfig.label }}
                </span>
                <span class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold" :class="priorityConfig.class">
                  {{ priorityConfig.label }} Priority
                </span>
                <span class="text-sm text-text-secondary">#{{ ticket.id }}</span>
              </div>
              <h2 class="text-2xl font-bold text-text-primary">{{ ticket.title }}</h2>
              <div class="mt-4 flex items-center gap-3">
                <span class="grid size-8 place-items-center rounded-full bg-primary-light text-sm font-bold text-primary">
                  {{ ticket.requester.avatar }}
                </span>
                <div>
                  <p class="text-sm font-medium text-text-primary">{{ ticket.requester.name }}</p>
                  <p class="text-xs text-text-secondary">opened on {{ formatDate(ticket.createdAt) }}</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-sm font-semibold text-text-primary mb-3">Description</h3>
              <div class="prose prose-sm max-w-none text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                {{ ticket.description }}
              </div>
              
              <!-- Tags -->
              <div class="mt-6 flex flex-wrap gap-2">
                <span v-for="tag in ticket.tags" :key="tag" class="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>

          <!-- Activity Timeline -->
          <article class="rounded-card border border-border bg-surface shadow-card">
            <div class="border-b border-border p-6 flex items-center justify-between">
              <h3 class="text-base font-semibold text-text-primary">Activity</h3>
              <span class="text-xs font-medium text-text-secondary">{{ activities.length }} events</span>
            </div>
            
            <div class="p-6">
              <div class="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                <div v-for="activity in activities" :key="activity.id" class="relative flex items-start gap-4">
                  <!-- Icon -->
                  <div class="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-4 border-surface shadow-sm" :class="getActivityIcon(activity.type).bg">
                    <svg viewBox="0 0 24 24" fill="none" class="size-4" :class="getActivityIcon(activity.type).color">
                      <path :d="getActivityIcon(activity.type).path" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  
                  <!-- Content -->
                  <div class="flex-1 min-w-0 pt-1">
                    <p class="text-sm text-text-primary">
                      <span class="font-semibold">{{ activity.user }}</span>
                      <span class="text-text-secondary" v-html="' ' + activity.content"></span>
                    </p>
                    <p class="mt-1 text-xs text-text-secondary">{{ formatDate(activity.time) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Box -->
            <div class="border-t border-border bg-slate-50 p-6 rounded-b-card">
              <label for="reply" class="sr-only">Reply</label>
              <div class="relative">
                <textarea
                  id="reply"
                  v-model="newComment"
                  rows="3"
                  class="w-full resize-none rounded-control border border-border bg-surface p-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light transition-shadow"
                  placeholder="Type your reply here..."
                ></textarea>
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-2 text-text-secondary">
                    <button class="p-1.5 hover:text-text-primary transition-colors rounded" aria-label="Attach file">
                      <svg viewBox="0 0 24 24" fill="none" class="size-5">
                        <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                    <button class="p-1.5 hover:text-text-primary transition-colors rounded" aria-label="Add emoji">
                      <svg viewBox="0 0 24 24" fill="none" class="size-5">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
                        <path d="M8.5 14.5s1 2 3.5 2 3.5-2 3.5-2M9 9h.01M15 9h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    @click="submitComment" 
                    :disabled="isSubmitting || !newComment.trim()"
                    class="inline-flex h-9 items-center justify-center rounded-control bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="isSubmitting" class="mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".25" stroke-width="3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                    </svg>
                    {{ isSubmitting ? "Sending..." : "Send Reply" }}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- ========== RIGHT COLUMN: Sidebar Details ========== -->
        <aside class="space-y-6">
          <!-- Properties -->
          <article class="rounded-card border border-border bg-surface p-6 shadow-card">
            <h3 class="text-sm font-semibold text-text-primary mb-5">Properties</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-xs font-medium text-text-secondary mb-1">Assignee</dt>
                <dd class="flex items-center gap-2">
                  <span class="grid size-7 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {{ ticket.assignee.avatar }}
                  </span>
                  <span class="text-sm font-medium text-text-primary">{{ ticket.assignee.name }}</span>
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-text-secondary mb-1">Requester</dt>
                <dd class="flex items-center gap-2">
                  <span class="grid size-7 place-items-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                    {{ ticket.requester.avatar }}
                  </span>
                  <span class="text-sm font-medium text-text-primary">{{ ticket.requester.name }}</span>
                </dd>
              </div>
              <div class="pt-4 border-t border-border">
                <dt class="text-xs font-medium text-text-secondary mb-1">Created at</dt>
                <dd class="text-sm text-text-primary">{{ formatDate(ticket.createdAt) }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-text-secondary mb-1">Last updated</dt>
                <dd class="text-sm text-text-primary">{{ formatDate(ticket.updatedAt) }}</dd>
              </div>
            </dl>
          </article>

          <!-- Quick Actions -->
          <article class="rounded-card border border-border bg-surface p-6 shadow-card">
            <h3 class="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full flex items-center justify-between rounded-control border border-border px-3 py-2 text-sm text-text-primary hover:bg-slate-50 transition-colors group">
                <span>Change Status</span>
                <svg viewBox="0 0 24 24" fill="none" class="size-4 text-text-secondary group-hover:text-primary transition-colors">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="w-full flex items-center justify-between rounded-control border border-border px-3 py-2 text-sm text-text-primary hover:bg-slate-50 transition-colors group">
                <span>Reassign Ticket</span>
                <svg viewBox="0 0 24 24" fill="none" class="size-4 text-text-secondary group-hover:text-primary transition-colors">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="w-full flex items-center justify-between rounded-control border border-border px-3 py-2 text-sm text-text-primary hover:bg-slate-50 transition-colors group">
                <span>Add Tag</span>
                <svg viewBox="0 0 24 24" fill="none" class="size-4 text-text-secondary group-hover:text-primary transition-colors">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </article>
        </aside>

      </div>
    </main>
  </div>
</template>