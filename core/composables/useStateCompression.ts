import { compressSync, decompressSync, strToU8, strFromU8 } from 'fflate';
import logger from "../extensions/logger";

interface CompressedState {
  _compressed: string,
  [key: string]: any,
}

export default function useStateCompression() {
  return {
    compress(state: any): CompressedState {
      const stateStr: string = JSON.stringify(state);

      logger.log('uncompressed state size:', stateStr.length);

      const buffer: Uint8Array = strToU8(stateStr)
      const compressed: Uint8Array = compressSync(buffer, { level: 9 });
      const stateStrCompressed: string = strFromU8(compressed, true);

      logger.log('  compressed state size:', stateStrCompressed.length);

      // Explicitly set any existing state properties to undefined
      // so they will be removed from the stored state, and replaced with compressed data
      return Object.keys(state).reduce((stateToSave, key) => {
        return { ...stateToSave, [key]: undefined };
      }, { _compressed: stateStrCompressed });
    },
    decompress(stateStrCompressed: string): any {
      const buffer: Uint8Array = strToU8(stateStrCompressed, true)
      const decompressed: Uint8Array = decompressSync(buffer);
      const stateStr: string = strFromU8(decompressed);

      return JSON.parse(stateStr);
    }
  }
}
