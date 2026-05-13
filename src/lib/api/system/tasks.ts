import { config } from '@/src/lib/config';

/**
 * Checks the health of Task A service.
 */
export async function checkTaskAHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${config.externalApis.taskA.baseUrl}health`);
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Checks the health of Task B service.
 */
export async function checkTaskBHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${config.externalApis.taskB.baseUrl}health`);
        return res.ok;
    } catch {
        return false;
    }
}