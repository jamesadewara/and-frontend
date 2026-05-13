import {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig
} from 'axios'
import { toast } from 'sonner'

interface FastAPIErrorDetail {
  detail?: string | Record<string, unknown>
}

/**
 * Attaches basic error handling and request logging to an Axios instance.
 * @param instance The AxiosInstance to harden.
 * @returns The same instance with interceptors attached.
 */
export function withBaseInterceptors(instance: AxiosInstance): AxiosInstance {
  // ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────
  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      // Add any global headers here if needed
      return requestConfig
    },
    (error: AxiosError) => Promise.reject(error),
  )

  // ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<FastAPIErrorDetail>) => {
      // Handle Network Errors (Server Down / No Connection)
      if (!error.response) {
        toast.error("Network Error: Backend unreachable", {
          description: "Please check if your local agent services are running."
        })
        return Promise.reject(error)
      }

      // Extract and standardise FastAPI error details for UI consumption
      const detail = error.response?.data?.detail
      if (detail) {
        error.message = typeof detail === 'string' ? detail : JSON.stringify(detail)
      }

      return Promise.reject(error)
    }
  )

  return instance
}
