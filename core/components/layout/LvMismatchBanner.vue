<template>
    <div class="flex w-full h-fit p-2 bg-info-100 text-info-800 border-b border-info-300 text-sm justify-center items-center">


      <span class="pl-3"
        >{{ $l('warning_app_mismatch') }}
        <RouterLink to="/release-notes" class="font-bold lowercase">
          {{ $l('release_notes') }} </RouterLink
        >.</span
      >
    </div>
</template>
