class TemplateService {
    private static async request(endpoint: string, method: string = 'GET', body?: any) {
        const response = await fetch(endpoint, {
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
        return this.request('/.netlify/functions/api/templates', 'GET');
    }

    static async createPolicyTemplates(name: string, content: string, type: string) {
        return this.request('/.netlify/functions/api/templates', 'POST', { name, content, type });
    }

    static async deletePolicyTemplates(id: string) {
        return this.request('/.netlify/functions/api/templates', 'DELETE', { id });
    }
}

export default TemplateService;
