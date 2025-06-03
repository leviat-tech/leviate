<template>
  <LvToolbar v-if="isExpanded">
    <div class="flex justify-between px-2 w-full items-center">
      <div class="space-x-2 flex">
        <CTool
          name="Undo"
          tool-id="undo"
          icon="undo"
          @click="revision.undo()"
          :disabled="!undoable"
        />
        <CTool
          name="Redo"
          tool-id="redo"
          icon="redo"
          @click="revision.redo()"
          :disabled="!redoable"
        />
      </div>
      <Menu class="relative" as="div">
        <!-- Button -->
        <MenuButton
          :title="$L('help')"
          class="flex items-center space-x-2 relative"
        >
          <slot v-if="$slots.button" name="button"/>
          <CTool color="info" size="md"><QuestionMarkCircleIcon /></CTool>
        </MenuButton>

        <!-- Content -->
        <Transition enter-from-class="scale-95 opacity-0" leave-to-class="opacity-0">
          <MenuItems
            as="div"
            class="absolute w-[260px] text-black top-3 right-3 z-20 py-2 bg-white shadow-xl transition duration-150 origin-top-right outline-none">

            <template v-for="item in $config.helpMenu">
              <hr v-if="item === null" class="my-2" />

              <MenuItem v-else v-slot="{ active }">
                <a
                  :href="item.url"
                  :class="[menuItemClass, item.className, active && 'bg-steel-light']"
                  :data-cy="`toolbar__info_link_${item.name}`"
                  target="_blank"
                >
                  <CIcon v-if="item.icon" :type="item.icon" size="sm"/>
                  <span>{{ $l(item.name) }}</span>
                </a>

              </MenuItem>
            </template>

            <hr v-if="$config.helpMenu.length > 0" class="my-2" />

            <MenuItem v-slot="{ active }" :class="menuItemClass">
              <button @click="openAppInfoModal"
                      :class="[menuItemClass, active && 'bg-steel-light']">
                <CIcon type="information-circle" class="!w-5"/>
                <span>{{ $L('about') }} {{ manifest.name }}</span>
              </button>
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  </LvToolbar>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid';
import { useRootStore } from '@crhio/leviate';
import useAppInfo from '@crhio/leviate/composables/useAppInfo';
import LvToolbar from '../../ui/LvToolbar.vue';
import { useLeviateStore } from '../../../store/leviate';
import { computed, onMounted, onUnmounted } from 'vue';

const { openAppInfoModal, manifest } = useAppInfo();

const revision = useRootStore().revision;
const undoable = revision.undoable;
const redoable = revision.redoable;

const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);

const menuItemClass = 'w-full flex items-center space-x-2 pl-3 pr-6 py-2 text-left';

function onKeyUp(e) {
  if (!e.ctrlKey) return;

  switch (e.key) {
    case 'z':
      if (undoable.value) {
        revision.undo();
      }
      break;
    case 'y':
      if (redoable.value) {
        return revision.redo();
      }
      break;
  }
}

onMounted(() => {
  window.addEventListener('keyup', onKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('keyup', onKeyUp);
});
</script>
