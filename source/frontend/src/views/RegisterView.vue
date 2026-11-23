<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import UiButton from "../components/UiButton.vue";
import api from "../services/api";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);
const mounted = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true;
  });
});

async function submitRegistration() {
  errorMessage.value = "";
  
  if (!username.value || !email.value || !password.value) {
    errorMessage.value = "Vui lòng điền đầy đủ thông tin.";
    return;
  }

  isSubmitting.value = true;

  try {
    await api.post("/auth/register/", {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // Chuyển về trang login kèm query báo đăng ký thành công
    router.push({
      name: "login",
      query: { registered: "1" },
    });
  } catch (error) {
    const data = error.response?.data;
    if (data) {
      // Xử lý lỗi trả về từ Django REST Framework (ví dụ: username đã tồn tại)
      errorMessage.value = Object.values(data).flat().join(" ");
    } else {
      errorMessage.value = "Không thể tạo tài khoản. Vui lòng thử lại.";
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <main class="grid min-h-screen grid-cols-1 md:grid-cols-[0.72fr_1.28fr] lg:grid-cols-[55fr_45fr]">
    <!-- ========== LEFT PANEL (Giống hệt Login) ========== -->
    <section
      class="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-slate-900 text-white md:flex md:items-center md:px-8 md:py-10 lg:px-14 lg:py-14"
      aria-label="About TicketDesk"
    >
      <!-- Decorative background -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute -right-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl animate-blob"></div>
        <div class="absolute -bottom-32 -left-20 size-96 rounded-full bg-brand-500/20 blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute right-1/3 top-1/3 size-64 rounded-full bg-brand-300/10 blur-2xl animate-blob animation-delay-4000"></div>
        <div
          class="absolute inset-0 opacity-[0.07]"
          style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"
        ></div>
        <div class="absolute -right-20 -top-24 size-80 rounded-full border border-slate-600/40"></div>
        <div class="absolute -right-8 -top-12 size-56 rounded-full border border-slate-600/30"></div>
      </div>

      <div
        class="relative z-10 mx-auto flex w-full max-w-xl flex-col transition-all duration-700"
        :class="mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
      >
        <!-- Logo -->
        <RouterLink
          to="/login"
          class="group mb-10 inline-flex items-center gap-3 rounded-control text-white focus-visible:outline-white lg:mb-14"
          aria-label="TicketDesk home"
        >
          <span
            class="grid size-11 place-items-center rounded-xl bg-primary shadow-card transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" class="size-6" aria-hidden="true">
              <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              <path d="M9 9v1m0 2v1m0 2v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <span class="text-xl font-semibold tracking-tight">TicketDesk</span>
        </RouterLink>

        <p class="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-brand-300/30 bg-brand-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-300">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-brand-300 opacity-75"></span>
            <span class="relative inline-flex size-2 rounded-full bg-brand-300"></span>
          </span>
          JOIN THE TEAM
        </p>

        <h1 class="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white lg:text-4xl">
          Start managing support requests
          <span class="bg-gradient-to-r from-brand-300 to-primary bg-clip-text text-transparent">today.</span>
        </h1>
        <p class="mt-5 max-w-lg text-base leading-7 text-slate-300">
          Create an account to access your centralized workspace and resolve tickets efficiently.
        </p>

        <!-- Floating dashboard mockup -->
        <div class="relative mt-10 hidden lg:block" aria-hidden="true">
          <div class="animate-float rounded-card border border-slate-600/70 bg-slate-800/70 p-4 shadow-2xl backdrop-blur-sm">
            <div class="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-primary"></span>
                <span class="text-xs font-medium text-slate-200">Onboarding</span>
              </div>
              <span class="text-xs text-slate-400">Step 1 of 3</span>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 rounded-control border border-slate-700 bg-sidebar p-3">
                <span class="grid size-8 place-items-center rounded-full bg-primary text-white text-xs font-bold">1</span>
                <div class="flex-1">
                  <p class="text-xs font-medium text-white">Create account</p>
                  <div class="mt-2 h-1.5 w-full rounded-full bg-slate-700">
                    <div class="h-1.5 w-1/3 rounded-full bg-primary animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-control border border-slate-700 bg-sidebar p-3 opacity-50">
                <span class="grid size-8 place-items-center rounded-full bg-slate-600 text-white text-xs font-bold">2</span>
                <p class="text-xs font-medium text-slate-300">Set up workspace</p>
              </div>
              <div class="flex items-center gap-3 rounded-control border border-slate-700 bg-sidebar p-3 opacity-50">
                <span class="grid size-8 place-items-center rounded-full bg-slate-600 text-white text-xs font-bold">3</span>
                <p class="text-xs font-medium text-slate-300">Invite your team</p>
              </div>
            </div>
          </div>

          <!-- Floating mini card -->
          <div class="absolute -right-4 -top-6 flex items-center gap-2 rounded-xl border border-slate-600/70 bg-slate-800/90 px-3 py-2 shadow-xl backdrop-blur animate-float-slow">
            <span class="grid size-7 place-items-center rounded-full bg-success/20 text-success">
              <svg viewBox="0 0 20 20" fill="none" class="size-4">
                <path d="M4 10.5 8 14l8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="text-xs text-slate-300">No credit card required</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== RIGHT PANEL ========== -->
    <section
      class="relative flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-8 lg:px-10"
      aria-label="Register"
    >
      <!-- Subtle background decoration -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -right-32 top-0 size-72 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute -bottom-32 -left-32 size-72 rounded-full bg-brand-400/5 blur-3xl"></div>
      </div>

      <div
        class="relative w-full max-w-[420px] transition-all duration-700 delay-150"
        :class="mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
      >
        <!-- Mobile logo -->
        <div class="mb-6 flex items-center gap-3 md:hidden" aria-label="TicketDesk">
          <span class="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-card" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2.5 2.5 0 0 0 0 5v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-2a2.5 2.5 0 0 0 0-5v-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              <path d="M9 9v1m0 2v1m0 2v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <span class="text-lg font-semibold text-text-primary">TicketDesk</span>
        </div>

        <div class="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div class="mb-7">
            <h2 class="text-2xl font-semibold tracking-tight text-text-primary">Create an account</h2>
            <p class="mt-2 text-sm text-text-secondary">Join TicketDesk to manage your support workflow.</p>
          </div>

          <form class="space-y-5" novalidate :aria-busy="isSubmitting" @submit.prevent="submitRegistration">
            <!-- Username -->
            <div>
              <label for="reg-username" class="mb-1.5 block text-sm font-medium text-text-primary">Username</label>
              <input
                id="reg-username"
                v-model.trim="username"
                type="text"
                name="username"
                autocomplete="username"
                placeholder="Choose a username"
                required
                class="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-secondary/75 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="reg-email" class="mb-1.5 block text-sm font-medium text-text-primary">Email</label>
              <input
                id="reg-email"
                v-model.trim="email"
                type="email"
                name="email"
                autocomplete="email"
                placeholder="you@example.com"
                required
                class="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-secondary/75 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="reg-password" class="mb-1.5 block text-sm font-medium text-text-primary">Password</label>
              <div class="relative">
                <input
                  id="reg-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  autocomplete="new-password"
                  placeholder="Create a strong password"
                  required
                  class="h-12 w-full rounded-control border border-border bg-surface px-3.5 pr-12 text-sm text-text-primary placeholder:text-text-secondary/75 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary-light"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-control text-text-secondary transition hover:text-text-primary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
                    <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.6" />
                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
                    <path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.1 0 9.5 6 9.5 6a15 15 0 0 1-3 3.5M6.2 6.8C3.8 8.3 2.5 12 2.5 12s3.4 6 9.5 6c1.2 0 2.3-.3 3.2-.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="flex items-start gap-2.5 rounded-control border border-danger/20 bg-danger/10 px-3.5 py-3 text-sm text-danger"
              role="alert"
              aria-live="assertive"
            >
              <svg viewBox="0 0 20 20" fill="none" class="mt-0.5 size-4 shrink-0">
                <path d="M10 6v4m0 3v.01M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Submit Button -->
            <UiButton type="submit" :disabled="isSubmitting" class="!h-12 w-full transition-transform active:scale-[0.98]">
              <svg v-if="isSubmitting" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".25" stroke-width="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              {{ isSubmitting ? "Creating account..." : "Create account" }}
            </UiButton>
          </form>

          <p class="mt-6 text-center text-sm text-text-secondary">
            Already have an account?
            <RouterLink to="/login" class="font-semibold text-primary underline-offset-4 transition hover:text-primary-hover hover:underline focus-visible:rounded-sm">
              Sign in
            </RouterLink>
          </p>
        </div>

        <p class="mt-5 text-center text-xs text-text-secondary">Secure access to your support workspace.</p>
      </div>
    </section>
  </main>
</template>