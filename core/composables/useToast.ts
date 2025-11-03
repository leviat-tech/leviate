import { merge } from 'lodash-es';
import { Content, Slide, toast, ToastOptions } from 'vue3-toastify';

export function useToast() {
    const defaultOptions: ToastOptions = {
        type: 'info',
        bodyClassName: 'text-xs',
        position: 'top-center',
        transition: 'slide',
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
