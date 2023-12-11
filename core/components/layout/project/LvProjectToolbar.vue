<template>
  <div class="bg-gray-50 h-12 border-b" :class="isExpanded && 'py-2'">
    <CToolbar class="justify-between"
              :class="!isExpanded && `flex flex-col-reverse h-auto`">
      <CTool-group :class="!isExpanded && `flex mt-1 -space-x-1`">
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
      </CTool-group>
      <template v-if="isExpanded">
        <Menu class="relative" as="div">
          <!-- Button -->
          <MenuButton
            :title="$L('help')"
            class="flex items-center p-1 relative ring-0"
          >
            <slot v-if="$slots.button" name="button"/>
            <CIcon type="question-circle"/>
          </MenuButton>

          <!-- Content -->
          <Transition enter-from-class="scale-95 opacity-0" leave-to-class="opacity-0">
            <MenuItems
              as="div"
              class="absolute text-black top-3 right-3 z-20 py-2 bg-white shadow-xl transition duration-150 origin-top-right outline-none">

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
      </template>
    </CToolbar>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useRootStore } from '@crhio/leviate';
import useAppInfo from '@crhio/leviate/composables/useAppInfo';
import { useLeviateStore } from '../../../store/leviate.js';
import { computed } from 'vue';

const { openAppInfoModal, manifest } = useAppInfo();

const revision = useRootStore().revision;
const undoable = revision.undoable;
const redoable = revision.redoable;

const leviate = useLeviateStore();

const isExpanded = computed(() => leviate.panels.project.isExpanded);

const menuItemClass = 'w-full flex items-center space-x-2 pl-3 pr-6 py-2 whitespace-nowrap text-left';
</script>
