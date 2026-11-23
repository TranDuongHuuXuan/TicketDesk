<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login');
}

// ============ MOCK DATA ============
const mockUser = {
  username: "nguyenvana",
  role: "ADMIN"
};

const tickets = ref([
  { id: 1024, title: "Cannot access the billing dashboard", requester: "John Doe", status: "IN_PROGRESS", priority: "HIGH", createdAt: "2023-10-24T09:30:00Z" },
  { id: 1023, title: "Bug: Export to CSV is missing headers", requester: "Alice Smith", status: "NEW", priority: "MEDIUM", createdAt: "2023-10-23T14:20:00Z" },
  { id: 1022, title: "Password reset link expired too quickly", requester: "Bob Johnson", status: "RESOLVED", priority: "LOW", createdAt: "2023-10-22T11:10:00Z" },
  { id: 1021, title: "Feature request: Dark mode for mobile", requester: "Emma Davis", status: "CLOSED", priority: "LOW", createdAt: "2023-10-21T16:45:00Z" },
  { id: 1020, title: "Urgent: Payment gateway timeout error", requester: "Michael Brown", status: "NEW", priority: "URGENT", createdAt: "2023-10-21T08:00:00Z" },
]);

// Bộ lọc
const searchQuery = ref("");
const statusFilter = ref("ALL");

const filteredTickets = computed(() => {
  return tickets.value.filter((t) => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      t.requester.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.id.toString().includes(searchQuery.value);
    
    const matchesStatus = statusFilter.value === "ALL" || t.status === statusFilter.value;
    
    return matchesSearch && matchesStatus;
  });
});

// Helper functions
function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function statusClass(status) {
  return {
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
    RESOLVED: "bg-green-100 text-green-700 border-green-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
  }[status] || "bg-slate-100 text-slate-700";
}

function priorityClass(priority) {
  return {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-blue-100 text-blue-600",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
  }[priority] || "bg-slate-100 text-slate-600";
}
</script>

<template>
  <div class="min-h-screen bg-background text-text-primary">
    <!-- Header -->
    <header class="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
      <div class="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <div class="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" class="size-5">
              <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              <path d="M9 9v1m0 2v1m0 2v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-semibold text-text-primary">TicketDesk</h1>
            <p class="text-xs text-text-secondary">Xin chào, {{ auth.user?.username || mockUser.username }} ({{ auth.user?.role || mockUser.role }})</p>
          </div>
        </div>

        <button
          type="button"
          @click="logout"
          class="inline-flex h-9 items-center justify-center rounded-control border border-border px-4 text-sm font-medium text-text-secondary transition hover:bg-slate-50 hover:text-text-primary"
        >
          Đăng xuất
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-text-primary">Danh sách Ticket</h2>
          <p class="mt-1 text-sm text-text-secondary">Quản lý và theo dõi các yêu cầu hỗ trợ.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="inline-flex h-10 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover">
            + Tạo Ticket mới
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-card border border-border bg-surface p-4 shadow-card">
        <div class="relative w-full max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
            <svg viewBox="0 0 24 24" fill="none" class="size-5">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.7" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm theo ID, tiêu đề, người yêu cầu..." 
            class="h-10 w-full rounded-control border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/75 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light transition-shadow"
          />
        </div>
        
        <div class="flex items-center gap-2 overflow-x-auto">
          <button 
            v-for="status in ['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']" 
            :key="status"
            @click="statusFilter = status"
            class="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
            :class="statusFilter === status ? 'bg-primary text-white' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'"
          >
            {{ status === 'ALL' ? 'Tất cả' : status.replace('_', ' ') }}
          </button>
        </div>
      </div>

      <!-- Ticket Table -->
      <div class="rounded-card border border-border bg-surface shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px] text-left text-sm">
            <thead class="border-b border-border bg-slate-50 text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th class="px-6 py-4 font-semibold">ID</th>
                <th class="px-6 py-4 font-semibold">Tiêu đề</th>
                <th class="px-6 py-4 font-semibold">Người yêu cầu</th>
                <th class="px-6 py-4 font-semibold">Trạng thái</th>
                <th class="px-6 py-4 font-semibold">Độ ưu tiên</th>
                <th class="px-6 py-4 font-semibold">Ngày tạo</th>
                <th class="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr 
                v-for="ticket in filteredTickets" 
                :key="ticket.id" 
                class="hover:bg-slate-50 transition-colors group cursor-pointer"
                @click="router.push({ name: 'ticket-detail', params: { id: ticket.id } })"
              >
                <td class="px-6 py-4 font-medium text-text-primary">#{{ ticket.id }}</td>
                <td class="px-6 py-4">
                  <p class="font-medium text-text-primary group-hover:text-primary transition-colors">{{ ticket.title }}</p>
                </td>
                <td class="px-6 py-4 text-text-secondary">{{ ticket.requester }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold" :class="statusClass(ticket.status)">
                    {{ ticket.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="priorityClass(ticket.priority)">
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="px-6 py-4 text-text-secondary">{{ formatDate(ticket.createdAt) }}</td>
                <td class="px-6 py-4 text-right">
                  <button class="text-sm font-medium text-primary hover:text-primary-hover">Xem</button>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="filteredTickets.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-text-secondary">
                  <div class="flex flex-col items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" class="size-10 text-slate-300 mb-3">
                      <path d="M4 5h16l1 11h-5l-2 3h-4l-2-3H3L4 5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                    </svg>
                    <p class="font-medium text-text-primary">Không tìm thấy ticket nào</p>
                    <p class="mt-1 text-sm">Thử thay đổi từ khóa hoặc bộ lọc.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination (Mock) -->
        <div class="flex items-center justify-between border-t border-border px-6 py-3 bg-surface">
          <p class="text-sm text-text-secondary">
            Hiển thị <span class="font-medium text-text-primary">1</span> đến <span class="font-medium text-text-primary">{{ filteredTickets.length }}</span> trong <span class="font-medium text-text-primary">{{ filteredTickets.length }}</span> kết quả
          </p>
          <div class="flex items-center gap-1">
            <button class="inline-flex size-8 items-center justify-center rounded border border-border text-text-secondary hover:bg-slate-50 disabled:opacity-50" disabled>
              &lt;
            </button>
            <button class="inline-flex size-8 items-center justify-center rounded border border-primary bg-primary text-white text-sm font-medium">1</button>
            <button class="inline-flex size-8 items-center justify-center rounded border border-border text-text-secondary hover:bg-slate-50 disabled:opacity-50" disabled>
              &gt;
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>