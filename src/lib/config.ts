const NODE_ENV = process.env.NODE_ENV || 'development'
const AND_TASK_A_URL = process.env.NEXT_PUBLIC_AND_TASK_A_URL || 'http://localhost:8000/api/v1/'
const AND_TASK_B_URL = process.env.NEXT_PUBLIC_AND_TASK_B_URL || 'http://localhost:8001/api/v1/'
const AND_FRONTEND_URL = process.env.NEXT_PUBLIC_AND_FRONTEND_URL || 'http://localhost:3000'

const MAIN_GITHUB_REPO = process.env.NEXT_PUBLIC_MAIN_GITHUB_REPO || "https://github.com/jamesadewara/AnD-workspace"

// Helper to get root URL from API URL (e.g. http://localhost:8000/api/v1/ -> http://localhost:8000/)
const getBaseUrl = (url: string) => {
    try {
        const u = new URL(url);
        return `${u.protocol}//${u.host}/`;
    } catch {
        return url.split('/api/v1/')[0] + '/';
    }
}

// ============================================================================
export const config = {
    nodeEnv: NODE_ENV as 'development' | 'production',

    // External APIs (Service Mesh)
    externalApis: {
        taskA: {
            baseUrl: getBaseUrl(AND_TASK_A_URL),
            apiUrl: AND_TASK_A_URL
        },
        taskB: {
            baseUrl: getBaseUrl(AND_TASK_B_URL),
            apiUrl: AND_TASK_B_URL
        },
        mainGithubUrl: MAIN_GITHUB_REPO
    },
    internalApi: {
        baseUrl: AND_FRONTEND_URL,
    }
}