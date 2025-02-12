<template>
    <div class="flex w-full h-fit p-2 bg-warning-300 text-warning-800 justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>

      <span class="pl-3"
        >{{ $l('warning_app_mismatch') }}
        <RouterLink to="/release-notes" class="font-bold lowercase">
          {{ $l('release_notes') }} </RouterLink
        >.</span
      >
    </div>
</template>
