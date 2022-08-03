<template>
  <div class="p-4">
    <CAccordion default-open>

      <template #title="{ open }">
        <div class="flex items-center justify-stretch">
          <CIcon type="chevron-right" size="sm" />
          <div class="font-bold ml-2 flex-grow">Rectangles</div>
          <button title="Add" @click.stop="addItem">
            <CIcon type="plus" size="sm"></CIcon>
          </button>
        </div>
      </template>


      <div class="p-2">
        <div v-for="item in items">{{ item.name }}</div>
      </div>

    </CAccordion>

    {{ items }}

  </div>
</template>

<script>
import ExampleModel from '@/models/ExampleModel';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  computed: {
    items() {
      return ExampleModel.read();
    }
  },
  methods: {
    addItem() {
      const newItem = ExampleModel.create({ name: `Rectangle ${this.items.length}` });

      // items.value.push(newItem);

      this.$router.replace(`/entity/${ExampleModel.id}/${newItem.id}`);
    }
  }
}
</script>
