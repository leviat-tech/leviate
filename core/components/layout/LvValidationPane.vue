<template>
  <div class="text-xs">
    <div
      class="bg-base-50 h-12 w-full items-center border-t border-base-300 px-2 grid grid-cols-10"
    >
      <div class="pl-2 font-bold col-span-4">{{ $L('activity') }}</div>
      <div
        class="cursor-pointer text-base-600 hover:text-base-800 col-span-2 flex justify-center"
        @click="togglePanel"
      >
        <ChevronDownIcon class="h-6 w-6" v-if="isExpanded" />
        <ChevronUpIcon class="h-6 w-6" v-else />
      </div>
      <div class="col-span-4 flex justify-end">
        <div
          class="flex space-x-2 cursor-pointer hover:text-base-800 text-base-600 pr-0.5"
          v-if="isExpanded"
        >
          <ArrowsPointingOutIcon class="h-6 w-6 p-0.5" v-if="hasModal" @click="openModal" />
          <FunnelIcon
            class="h-6 w-6 p-0.5"
            :class="[filtersClass]"
            @click="filtersActive = !filtersActive"
          />
        </div>
        <div class="flex -space-x-1" v-else>
          <div class="" v-for="(value, key) in notifications">
            <div
              :class="`rounded-full px-2 bg-status-${key} text-white py-1 font-medium min-w-6 text-center`"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-48 flex" v-if="isExpanded">
      <div
        class="border-t border-base-300 w-full p-2 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-base-100 [&::-webkit-scrollbar-thumb]:bg-base-400"
      >
        <CStatusMessage
          v-for="message in displayedMessages"
          :status="message.type"
          :content="message.content"
          :timestamp="message.timestamp"
        >
          <CIcon
            v-if="message.isDismissable === true"
            type="plus"
            class="w-4 flex-none rotate-45 justify-end cursor-pointer"
            @click="$emit('dismiss', message.id)"
          />
        </CStatusMessage>
        <div class="justify-between flex py-0.5 font-medium">
          <div class="">
            {{ $L('displaying') }} {{ displayedMessages.length }} {{ $l('of') }}
            {{ messages.length }} {{ $l('messages') }}
          </div>
          <div
            class="text-brand-700 hover:text-brand-900 cursor-pointer"
            v-if="messages.length > displayCount"
            @click="loadMore"
          >
            {{ $L('load_more') }}
          </div>
        </div>
      </div>
      <div
        class="w-11 px-2 py-2 flex flex-col justify-between transition-all ease-in-out duration-150 bg-base-50 border-l border-base-300"
        v-if="filtersActive"
      >
        <CCheckbox
          no-label
          :color="color"
          v-model="filters[color]"
          class="-ml-1.5"
          colorUnchecked
          v-for="(value, color) in filters"
          :key="color"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FunnelIcon, ArrowsPointingOutIcon } from '@heroicons/vue/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/20/solid';
import { computed, watch, ref } from 'vue';
import { useLocalize } from '../..';
import { useLeviateStore } from '../../store/leviate';
import ValidationPaneMessage from '../../models/ValidationPaneMessage';

interface Props {
  autoAppear?: boolean;
  filterable?: boolean;
  defaultMessageCount?: number;
  messages?: Array<ValidationPaneMessage>;
}

const props = withDefaults(defineProps<Props>(), {
  filterable: true,
  messages: () => [],
  defaultMessageCount: 3,
});

const emit = defineEmits(['dismiss']);

const store = useLeviateStore();
const { $l } = useLocalize();

const isExpanded = computed({
  get: () => store.panels.validation.isExpanded,
  set: (val) => (store.panels.validation.isExpanded = val),
});

const lastTimestamp = computed({
  get: () => store.panels.validation.lastTimestamp,
  set: (val) => (store.panels.validation.lastTimestamp = val),
});

const loadMore = () => {
  const check = (displayCount.value += props.defaultMessageCount);
  if (check > props.messages.length) {
    displayCount.value = props.messages.length;
  } else {
    displayCount.value = check;
  }
};

const displayCount = ref(0);
loadMore();

const filters = ref({
  danger: true,
  warning: true,
  success: true,
  magic: true,
  info: true,
  default: true,
});

const filtersActive = ref(false);
const filtersClass = computed(() => (filtersActive.value ? 'text-entity-active' : ''));

const displayedMessages = computed(() => {
  if (filtersActive.value) {
    const filteredMessages = props.messages.filter((m) => {
      const messageType = [null, 'unknown', undefined].includes(m.type) ? 'default' : m.type;
      return filters.value[messageType] === true;
    });
    return filteredMessages.slice(0, displayCount.value);
  }
  return props.messages.slice(0, displayCount.value);
});

const notifications = computed(() => {
  return props.messages
    .filter((m) => {
      return m.timestamp > lastTimestamp.value;
    })
    .reduce((a, c) => {
      if (a[c.type] == null) {
        return { ...a, [c.type]: 1 };
      }
      return { ...a, [c.type]: a[c.type] + 1 };
    }, {});
});

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value === true) {
    updateTimestamp();
  }
};

const updateTimestamp = () => {
  lastTimestamp.value = Date.now();
};

const hasModal = ref(false);
const openModal = () => {
  console.log('Not yet implemented');
};

if (props.autoAppear) {
  watch(
    () => props.messages.length > 0,
    (isVisible) => {
      isExpanded.value = isVisible;
    }
  );
}
</script>
