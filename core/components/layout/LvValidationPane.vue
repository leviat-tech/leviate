<template>
  <div v-if="messages.length" class="flex flex-col border-t" panelId="validation">
    <div class="flex px-3 text-white bg-danger">
      <div class="flex items-center">Validate</div>
      <div class="w-full flex items-center justify-end">
          <button @click="togglePanel"
            class="flex justify-center items-center text-white hover:text-black"
            :class="isExpanded ? 'w-6 h-6' : 'w-10 h-10'"
          >
          <IconCollapse v-if="isExpanded" class="-rotate-90"/>
          <IconExpand v-else class="-rotate-90"/>
        </button>
        </div>
    </div>
    <div v-if="isExpanded" class="p-2 max-h-28 flex-1 overflow-y-auto">
      <ul>
        <li
          v-for="(message, index) in messages"
          :key="index"
          class="flex items-center cursor-pointer text-sm mb-1 p-1 justify-between"
          :class="{'bg-danger-lightest' : message.type === 'error', 'bg-warning-lightest' : message.type === 'warning'}"
        >
          <div class="flex">
            <CIcon :type="iconType(message.type)" :color="iconStyle(message.type)" class="w-5 mr-2" />
            <span class="text-indigo">{{ message.text }}</span>
          </div>
          <CIcon v-if="message.type === 'warning'" type="plus" color="warning" class="rotate-45 justify-end" @click="removeWarning(index)" />
        </li>
      </ul>
    </div>
  </div> 
</template>


<script setup>
import IconCollapse from '../icons/iconCollapse.vue';
import IconExpand from '../icons/iconExpand.vue';
import { useLeviateStore } from '../../store/leviate';
import { computed } from 'vue';
import { ref } from 'vue'

const store = useLeviateStore()
let warningNumber = ref()
const messages = ref(props.messages)

const props = defineProps({
  messages: {
    type: Array,
  }
});

const isExpanded = computed({
  get: () => store.panels.validation.isExpanded,
  set: (val) => store.panels.validation.isExpanded = val
})

const togglePanel = () => {
    isExpanded.value = !isExpanded.value
}

const iconType = (type) => {
  if(type  === "error") return 'error'
  else if(type  === "warning") return 'warning'
}

const iconStyle = (type) => {
  if(type === "error") return 'danger'
  else if(type  === "warning") return 'warning'
}

const removeWarning = (index) => {
  messages.value.splice(index,1)
}

</script>
