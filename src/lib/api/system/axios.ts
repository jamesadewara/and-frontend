import axios from 'axios'
import { withBaseInterceptors } from '@/src/lib/api/interceptors'
import { config } from '@/src/lib/config'

/**
 * Axios instance for Task A: Review Generation
 */
export const taskAAxios = withBaseInterceptors(axios.create({
    baseURL: config.externalApis.taskA.baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 30_000,
}))

/**
 * Axios instance for Task B: Recommendation Engine
 */
export const taskBAxios = withBaseInterceptors(axios.create({
    baseURL: config.externalApis.taskB.baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: 30_000,
}))
