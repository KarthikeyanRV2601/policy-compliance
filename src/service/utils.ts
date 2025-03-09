export const requestApi = async (endpoint: string, method: string = 'GET', body?: any) => {
    const url = new URL(`/api${endpoint}`, window.location.origin);
    url.searchParams.append("nocache", Date.now().toString());
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate'
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}