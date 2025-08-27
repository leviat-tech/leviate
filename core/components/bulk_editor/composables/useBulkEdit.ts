import { inject } from 'vue';
import type { InjectionKey } from 'vue';

export const BulkEditor = Symbol() as InjectionKey<any>

export default function useBulkEdit() {
  console.log(inject(BulkEditor));
  const { config, events, bulkEntity } = inject(BulkEditor, {});

  return {
    config,
    events,
    bulkEntity,
  }
}
