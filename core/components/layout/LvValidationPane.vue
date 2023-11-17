<template>
  <div v-if="messages.length" class="flex flex-col border-t" :class="isExpanded || 'border-danger-dark'">
    <div class="flex px-3" :class="isExpanded ? 'bg-gray-100' : 'bg-danger text-white' ">
      <div class="flex items-center whitespace-nowrap h-10">{{ $L('validation') }} ({{ count }})</div>
      <div class="w-full flex items-center justify-end">
        <button @click="togglePanel"
                class="flex justify-center items-center w-10 h-10"
                :class="isExpanded ? 'text-steel-darkest hover:text-black' : ' hover:opacity-60'"
        >
          <IconCollapse v-if="isExpanded" class="-rotate-90"/>
          <IconExpand v-else class="-rotate-90"/>
        </button>
      </div>
    </div>
    <div v-if="isExpanded" class="p-2 max-h-40 flex-1 border-t overflow-y-auto">
      <ul>
        <li
          v-for="(message, index) in messages"
          :key="index"
          class="flex items-center text-sm mb-1 p-1 justify-between"
          :class="{'bg-danger-lightest' : message.type === 'error', 'bg-warning-lightest' : message.type === 'warning', 'cursor-pointer': message.onClick}"
        >
          <div class="flex w-full" @click="message.onClick">
            <CIcon :type="iconType(message.type)" :color="iconStyle(message.type)" class="w-5 mr-2"/>
            <span class="text-indigo">{{ message.text }}</span>
          </div>
          <CIcon v-if="message.isDismissable === true" type="plus" color="warning"
                 class="rotate-45 justify-end cursor-pointer" @click="dismissWarning(index)"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLocalize, useMessageStore } from '../..';
import IconCollapse from '../icons/iconCollapse.vue';
import IconExpand from '../icons/iconExpand.vue';
import { useLeviateStore } from '../../store/leviate';
import { groupBy } from 'lodash-es';

const props = defineProps({
  messages: {
    type: Array,
    default: [],
  },
})


const store = useLeviateStore()
const messageStore = useMessageStore()
const { $l } = useLocalize();

const isExpanded = computed({
  get: () => store.panels.validation.isExpanded,
  set: (val) => store.panels.validation.isExpanded = val
})

const count = computed(() => {
  if (props.messages.value.length === 0) return '';

  const { error, warning } = groupBy(props.messages.value, 'type');

  const errorCount = error?.length || 0;
  const warningCount = warning?.length || 0;

  const errorKey = errorCount === 1 ? 'error' : 'errors';
  const warningKey = warningCount === 1 ? 'warning' : 'warnings';

  return `${errorCount} ${$l(errorKey)}, ${warningCount} ${$l(warningKey)}`
});

const togglePanel = () => {
  isExpanded.value = !isExpanded.value
}

const iconType = (type) => {
  if (type === 'error') return 'error'
  else if (type === 'warning') return 'warning'
}

const iconStyle = (type) => {
  if (type === 'error') return 'danger'
  else if (type === 'warning') return 'warning'
}

const dismissWarning = (index) => {
  const msg = props.messages.value[index];
  messageStore.removeMessage(msg.id);
}
</script>
