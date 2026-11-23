<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

// ============ MOCK DATA ============
const mockUser = {
  id: 1,
  username: "nguyenvana",
  email: "vana@example.com",
  role: "ADMIN",
};

const mockStats = {
  total: 142,
  new: 28,
  inProgress: 45,
  resolved: 62,
  closed: 7,
};

const mockChartData = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 19 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 25 },
  { label: "Fri", value: 22 },
  { label: "Sat", value: 8 },
  { label: "Sun", value: 5 },
];

const mockUsers = [
  { id: 1, username: "nguyenvana", email: "vana@example.com", role: "ADMIN" },
  { id: 2, username: "tranthib", email: "thib@example.com", role: "SUPPORT_AGENT" },
  { id: 3, username: "levanc", email: "vanc@example.com", role: "REQUESTER" },
  { id: 4, username: "phamthid", email: "thid@example.com", role: "MANAGER" },
  { id: 5, username: "hoangvane", email: "vane@example.com", role: "SUPPORT_AGENT" },
];

// ============ STATE ============
const user = computed(() => auth.user || mockUser);
const userName = computed(() => user.value?.username?.trim() || "");
const userInitial = computed(() => userName.value.charAt(0).toUpperCase() || "?");
const role = computed(() => user.value?.role || "ADMIN");

const roleLabel = computed(() =>
  ({
    REQUESTER: "Requester",
    SUPPORT_AGENT: "Support Agent",
    MANAGER: "Manager",
    ADMIN: "Admin",
  })[role.value] || "TicketDesk user",
);

// ============ STAT CARDS ============
const statCards = computed(() => [
  { label: "Total tickets", value: mockStats.total, icon: "ticket", tone: "primary", change: "+12%", isUp: true },
  { label: "New tickets", value: mockStats.new, icon: "inbox", tone: "info", change: "+5%", isUp: true },
  { label: "In progress", value: mockStats.inProgress, icon: "clock", tone: "warning", change: "-2%", isUp: false },
  { label: "Resolved", value: mockStats.resolved, icon: "check", tone: "success", change: "+8%", isUp: true },
]);

// ============ STATUS ROWS ============
const statusRows = computed(() => {
  const total = mockStats.total;
  return [
    { status: "NEW", count: mockStats.new },
    { status: "IN_PROGRESS", count: mockStats.inProgress },
    { status: "RESOLVED", count: mockStats.resolved },
    { status: "CLOSED", count: mockStats.closed },
  ].map((row) => ({
    ...row,
    percent: total ? Math.round((row.count / total) * 100) : 0,
  }));
});

// ============ CHART HELPERS ============
const totalWeekly = computed(() => mockChartData.reduce((sum, item) => sum + item.value, 0));
const maxChartValue = computed(() => Math.max(...mockChartData.map((d) => d.value)));

function statusBarClass(status) {
  return {
    NEW: "bg-primary",
    IN_PROGRESS: "bg-warning",
    RESOLVED: "bg-success",
    CLOSED: "bg-slate-400",
  }[status];
}

function roleBadgeClass(role) {
  return {
    ADMIN: "bg-red-100 text-red-700",
    SUPPORT_AGENT: "bg-blue-100 text-blue-700",
    REQUESTER: "bg-green-100 text-green-700",
    MANAGER: "bg-slate-100 text-slate-700",
  }[role] || "bg-slate-100 text-slate-700";
}

function logout() {
  auth.logout();
  router.replace({ name: "login" });
}

onMounted(() => {
  // Không cần gọi API
});
</script>

<template>
  <div class="min-h-screen bg-background text-text-primary">
    <!-- ============ SIDEBAR ============ -->
    <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-white lg:flex">
      <div class="flex h-16 items-center gap-3 border-b border-slate-700 px-6">
        <span class="grid size-9 place-items-center rounded-lg bg-primary" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M9 9v1m0 2v1m0 2v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </span>
        <span class="text-lg font-semibold tracking-tight">TicketDesk</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-6" aria-label="Primary navigation">
        <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        
        <!-- Dashboard (Active) -->
        <span class="flex items-center gap-3 rounded-control bg-sidebar-hover px-3 py-2.5 text-sm font-medium text-white" aria-current="page">
          <svg viewBox="0 0 24 24" fill="none" class="size-5 text-brand-300" aria-hidden="true">
            <path d="M4 13h6V4H4v9Zm10 7h6V11h-6v9ZM4 20h6v-3H4v3Zm10-13h6V4h-6v3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
          </svg>
          Dashboard
        </span>

        <!-- All Tickets -->
        <RouterLink to="/tickets" class="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white">
          <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-13Z" stroke="currentColor" stroke-width="1.7" />
            <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          All Tickets
        </RouterLink>

        <!-- Users (Mock) -->
        <span class="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7" />
            <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          Users
        </span>

        <!-- Settings (Mock) -->
        <span class="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-sidebar-hover hover:text-white cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Settings
        </span>
      </nav>

      <div class="border-t border-slate-700 p-4">
        <div class="flex items-center gap-3 rounded-control px-2 py-2">
          <span class="grid size-9 shrink-0 place-items-center rounded-full bg-slate-600 text-sm font-semibold text-white">{{ userInitial }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">{{ userName || "TicketDesk user" }}</p>
            <p class="truncate text-xs text-slate-400">{{ roleLabel }}</p>
          </div>
          <button type="button" class="rounded p-1 text-slate-300 hover:bg-sidebar-hover hover:text-white" aria-label="Sign out" @click="logout">
            <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10m4-3 4-4-4-4m4 4H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ============ MAIN CONTENT ============ -->
    <div class="min-h-screen lg:pl-64">
      <!-- Header -->
      <header class="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div class="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div class="min-w-0">
            <p class="text-xs text-text-secondary">Workspace <span class="px-1">/</span> Dashboard</p>
            <h1 class="text-lg font-semibold text-text-primary">Dashboard</h1>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden text-right sm:block">
              <p class="max-w-40 truncate text-sm font-medium text-text-primary">{{ userName || "TicketDesk user" }}</p>
              <p class="text-xs text-text-secondary">{{ roleLabel }}</p>
            </div>
            <span class="grid size-9 place-items-center rounded-full bg-primary-light text-sm font-semibold text-primary">
              {{ userInitial }}
            </span>
            <button type="button" class="rounded-control border border-border px-3 py-2 text-sm font-medium text-text-secondary hover:bg-slate-50 lg:hidden" @click="logout">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section class="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-primary">{{ roleLabel }}</p>
            <h2 class="mt-1 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Welcome back, {{ userName || "User" }}
            </h2>
            <p class="mt-2 text-sm text-text-secondary">Here's what's happening with your support tickets today.</p>
          </div>
        </section>

        <!-- Stats Cards -->
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ticket summary">
          <article
            v-for="card in statCards"
            :key="card.label"
            class="group rounded-card border border-border bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-medium text-text-secondary">{{ card.label }}</p>
                <p class="mt-3 text-3xl font-semibold tracking-tight text-text-primary">{{ card.value.toLocaleString() }}</p>
                <div class="mt-2 flex items-center gap-1 text-xs font-medium" :class="card.isUp ? 'text-success' : 'text-danger'">
                  <svg v-if="card.isUp" viewBox="0 0 20 20" fill="none" class="size-3.5">
                    <path d="M10 15V5m0 0-5 5m5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <svg v-else viewBox="0 0 20 20" fill="none" class="size-3.5">
                    <path d="M10 5v10m0 0 5-5m-5 5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ card.change }}
                </div>
              </div>
              <span class="grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110" :class="{
                'bg-primary-light text-primary': card.tone === 'primary',
                'bg-info/10 text-info': card.tone === 'info',
                'bg-warning/10 text-warning': card.tone === 'warning',
                'bg-success/10 text-success': card.tone === 'success',
              }">
                <svg v-if="card.icon === 'ticket'" viewBox="0 0 24 24" fill="none" class="size-5">
                  <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                  <path d="M9 9v1m0 2v1m0 2v.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <svg v-else-if="card.icon === 'inbox'" viewBox="0 0 24 24" fill="none" class="size-5">
                  <path d="M4 5h16l1 11h-5l-2 3h-4l-2-3H3L4 5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                </svg>
                <svg v-else-if="card.icon === 'clock'" viewBox="0 0 24 24" fill="none" class="size-5">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7" />
                  <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" class="size-5">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7" />
                  <path d="m8 12 2.5 2.5L16 9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </article>
        </section>

        <!-- Charts Section -->
        <section class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <!-- 1. Bar Chart -->
          <article class="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h3 class="text-base font-semibold text-text-primary">Weekly Ticket Activity</h3>
                <p class="mt-1 text-sm text-text-secondary">Tickets created per day this week</p>
              </div>
              <span class="rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary">
                {{ totalWeekly }} total
              </span>
            </div>

            <!-- Bar Chart -->
            <div class="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-4">
              <div v-for="(item, index) in mockChartData" :key="index" class="group relative flex flex-1 flex-col items-center justify-end gap-2 h-full">
                <!-- Tooltip -->
                <div class="absolute -top-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-slate-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap z-10">
                  {{ item.value }} tickets
                </div>
                <!-- Bar -->
                <div class="w-full max-w-[40px] rounded-t-md bg-primary/20 transition-all duration-300 group-hover:bg-primary relative" :style="{ height: `${Math.max((item.value / maxChartValue) * 100, 4)}%` }">
                  <div class="absolute bottom-0 w-full bg-primary rounded-t-md"></div>
                </div>
                <!-- Label -->
                <span class="text-xs font-medium text-text-secondary">{{ item.label }}</span>
              </div>
            </div>
          </article>

          <!-- 2. Donut Chart -->
          <article class="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-semibold text-text-primary">Ticket Status</h3>
                <p class="mt-1 text-sm text-text-secondary">Overview of current ticket states</p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-8 mt-4">
              <!-- Donut Chart -->
              <div class="relative size-40 shrink-0 rounded-full" :style="{
                background: `conic-gradient(
                  #2563eb 0% ${statusRows[0]?.percent || 0}%, 
                  #f59e0b ${statusRows[0]?.percent || 0}% ${(statusRows[0]?.percent || 0) + (statusRows[1]?.percent || 0)}%, 
                  #22c55e ${(statusRows[0]?.percent || 0) + (statusRows[1]?.percent || 0)}% ${(statusRows[0]?.percent || 0) + (statusRows[1]?.percent || 0) + (statusRows[2]?.percent || 0)}%, 
                  #94a3b8 ${(statusRows[0]?.percent || 0) + (statusRows[1]?.percent || 0) + (statusRows[2]?.percent || 0)}% 100%
                )`
              }">
                <div class="absolute inset-4 rounded-full bg-surface flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-text-primary">{{ mockStats.total }}</span>
                  <span class="text-xs text-text-secondary">Tickets</span>
                </div>
              </div>

              <!-- Legend -->
              <div class="flex-1 w-full space-y-3">
                <div v-for="row in statusRows" :key="row.status" class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2">
                    <span class="size-3 rounded-full" :class="statusBarClass(row.status)"></span>
                    <span class="text-text-secondary capitalize">{{ row.status.replace('_', ' ').toLowerCase() }}</span>
                  </div>
                  <span class="font-semibold text-text-primary">{{ row.count }} ({{ row.percent }}%)</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- User List -->
        <section class="mt-6 rounded-card border border-border bg-surface shadow-card">
          <div class="p-5 border-b border-border sm:p-6 flex justify-between items-center">
            <div>
              <h3 class="text-base font-semibold text-text-primary">Recent Users</h3>
              <p class="mt-1 text-sm text-text-secondary">People involved in your workspace</p>
            </div>
            <button class="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm min-w-[600px]">
              <thead class="border-b border-border text-xs uppercase tracking-wide text-text-secondary bg-slate-50">
                <tr>
                  <th class="px-6 py-4 font-semibold">User</th>
                  <th class="px-6 py-4 font-semibold">Email</th>
                  <th class="px-6 py-4 font-semibold">Role</th>
                  <th class="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-for="u in mockUsers" :key="u.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <span class="grid size-9 place-items-center rounded-full bg-primary-light text-primary font-bold">
                        {{ (u.username || 'U').charAt(0).toUpperCase() }}
                      </span>
                      <span class="font-medium text-text-primary">{{ u.username }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-text-secondary">{{ u.email }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium" :class="roleBadgeClass(u.role)">
                      {{ u.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button class="text-text-secondary hover:text-primary transition-colors">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>