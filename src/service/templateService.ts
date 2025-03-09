class TemplateService {
    private static async request(endpoint: string, method: string = 'GET', body?: any) {
        const response = await fetch(`.netlify/functions/${endpoint}`, {
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

    static async getPolicyTemplates() {
        return this.request('/api/templates/templates', 'GET');
    }

    static async createPolicyTemplates(name: string, content: string, type: string) {
        return this.request('/api/templates/templates', 'POST', { name, content, type });
    }

    static async deletePolicyTemplates(id: string) {
        return this.request('/api/templates/templates', 'DELETE', { id });
    }
}

export default TemplateService;
