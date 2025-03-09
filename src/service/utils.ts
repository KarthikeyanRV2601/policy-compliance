export const requestApi = async (endpoint: string, method: string = 'GET', body?: any) => {
    const response = await fetch(`/.netlify/functions${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}