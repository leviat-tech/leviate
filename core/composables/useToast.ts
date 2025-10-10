import { merge } from 'lodash-es';
import { Content, toast, ToastOptions } from 'vue3-toastify';

export function useToast() {
    const defaultOptions: ToastOptions = {
        type: 'info',
        position: 'top-center',
        style: {
            width: '600px'
        }
    }

    const showToast = (content: Content, options?: ToastOptions) => {
        const mergedOptions = merge(defaultOptions, options)

        toast(content, mergedOptions)
    }

    return {
        showToast
    }
}
