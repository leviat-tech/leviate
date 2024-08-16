<template>
  <div class="absolute bottom-0 w-full flex flex-col border-t overflow-hidden"
       :class="isExpanded ? 'h-48' : 'h-[41px]'">
    <div class="flex px-3 bg-gray-100 font-semibold" :class="!isExpanded && errors?.length > 0 && 'text-danger' ">
      <div class="flex items-center whitespace-nowrap h-10">{{ $L('validation') }} {{ count }}</div>
      <div class="w-full flex items-center justify-end">
        <button @click="togglePanel"
                class="flex justify-center items-center w-10 h-[41px] text-steel-darkest hover:text-black"
        >
          <IconCollapse v-if="isExpanded" class="-rotate-90"/>
          <IconExpand v-else class="-rotate-90"/>
        </button>
      </div>
    </div>
    <div class="p-2 flex-1 border-t space-y-2 bg-white overflow-y-auto">
      <CStatusMessage
        v-for="(message, index) in messages"
        :key="index"
        :text="message.text"
        :status="message.type"
      >
        <CIcon v-if="message.isDismissable === true" type="plus" color="warning"
               class="w-4 flex-none rotate-45 justify-end cursor-pointer" @click="dismissWarning(index)"/>
      </CStatusMessage>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
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
  autoAppear: Boolean,
});

const store = useLeviateStore()
const messageStore = useMessageStore()
const { $l } = useLocalize();

const isExpanded = computed({
  get: () => store.panels.validation.isExpanded,
  set: (val) => store.panels.validation.isExpanded = val
});

const grouped = computed(() => groupBy(props.messages, 'type'));
const errors = computed(() => grouped.value.error);
const warnings = computed(() => grouped.value.warning);

const count = computed(() => {
  if (props.messages.length === 0) return;

  const errorCount = errors.value?.length || 0;
  const warningCount = warnings.value?.length || 0;

  const errorKey = errorCount === 1 ? 'error' : 'errors';
  const warningKey = warningCount === 1 ? 'warning' : 'warnings';

  return `(${errorCount} ${$l(errorKey)}, ${warningCount} ${$l(warningKey)})`;
});

const togglePanel = () => {
  isExpanded.value = !isExpanded.value
}

const dismissWarning = (index) => {
  const msg = props.messages.value[index];
  messageStore.removeMessage(msg.id);
}

if (props.autoAppear) {
  watch(() => props.messages.length > 0, (isVisible) => {
    isExpanded.value = isVisible;
  })
}
</script>
