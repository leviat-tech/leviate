<template>

  <div class="h-full text-sm">
    <div class="h-box">

      <div class="flex flex-col flex-grow">

        <div class="h-box flex">

          <div class="project flex-limit v-box scroll border-r">
            <project/>
          </div>

          <slot></slot>

        </div>
      </div>

    </div>
  </div>

</template>


<script>
import Project from './project/project.vue';

export default {
  name: 'Layout',
  components: {
    Project,
  },
};
</script>
