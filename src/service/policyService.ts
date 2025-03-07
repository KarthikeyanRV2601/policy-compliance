class PolicyService {
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
        return this.request('/api/policies/templates', 'GET');
    }

    static async createPolicyTemplates(name: string, content: string, type: string) {
        return this.request('/api/policies/templates', 'POST', { name, content, type });
    }

    static async deletePolicyTemplates(id: string) {
        return this.request('/api/policies/templates', 'DELETE', { id });
    }

    static async getPolicies() {
        return this.request('/api/policies/policies');
    }

    static async createPolicy(name: string, content: string, type: string, companyId: string) {
        return this.request('/api/policies/policies', 'POST', { name, content, companyId, type });
    }

    static async deletePolicy(id: string) {
        return this.request('/api/policies/policies', 'DELETE', { id });
    }


    static async updatePolicy(id: string) {
        return this.request('/api/policies/policies', 'POST', { id });
    }

    static async approvePolicy(policyId: string, approverId: string, approverRole: string, policyType: string) {
        const response = await fetch("/api/policies/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ policyId, approverId, approverRole, policyType }),
        });

        if (!response.ok) throw new Error("Failed to approve policy");
        return response.json();
    }

    static async rejectPolicy(policyId: string, approverId: string, approverRole: string, policyType: string) {
        const response = await fetch("/api/policies/reject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ policyId, approverId, approverRole, policyType }),
        });

        if (!response.ok) throw new Error("Failed to reject policy");
        return response.json();
    }

    static async undoPolicyApproveRejectAction(policyId: string, approverId: string, approverRole: string, policyType: string) {
        try {
            const response = await fetch("/api/policies/undo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ policyId, approverId, approverRole, policyType }),
            });
            if (!response.ok) throw new Error("Failed to undo policy");
            return response.json();
        } catch (error) {
            console.error("Error undoing policy action:", error);
            throw error;
        }
    }

    static async acknowledgePolicy(policyId: string, userId: string) {
        return this.request('/api/policies/acknowledge', 'POST', { policyId, userId });
    }
}

export default PolicyService;
