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

    static async getPolicy(policyId: string) {
        return this.request(`/api/policies/policies?policyId=${policyId}`, 'GET');
    }

    static async getPolicies(companyId: string) {
        return this.request(`/api/policies/policies?companyId=${companyId}`, 'GET');
    }

    static async createPolicy(name: string, content: string, type: string, companyId: string, policyType: string) {
        return this.request('/api/policies/policies', 'POST', { name, content, companyId, type, policyType });
    }

    static async deletePolicy(id: string) {
        return this.request('/api/policies/policies', 'DELETE', { id });
    }


    static async updatePolicy(name: string, content: string, policyId: string, companyId: string, policyType: string | null) {
        return this.request('/api/policies/policies', 'POST', { name, content, policyId, companyId, updating: true, policyType });
    }

    static async approvePolicy(policyId: string, approverId: string, approverRole: string, policyType: string) {
        return this.request("/api/policies/policy-action/approve", 'POST', { policyId, approverId, approverRole, policyType });
    }

    static async rejectPolicy(policyId: string, approverId: string, approverRole: string, policyType: string) {
        return this.request('/api/policies/policy-action/reject', 'POST', { policyId, approverId, approverRole, policyType });
    }

    static async undoPolicyApproveRejectAction(policyId: string, approverId: string, approverRole: string, policyType: string) {
        return this.request('/api/policies/policy-action/undo', 'POST', { policyId, approverId, approverRole, policyType });
    }

    static async requestAcknowledgment(employeeId: string, policies: string[]) {
        return this.request('/api/policies/acknowledgement/request', 'POST', { employeeId, policies });
    }
    
    static async acknowledgePolicy(policyId: string, employeeId: string) {
        return this.request('/api/policies/acknowledgement/acknowledge', 'POST', { policyId, employeeId });
    }

    static async getPendingAcknowledgements(userId: string) {
        return this.request(`/api/policies/acknowledgement/acknowledge?userId=${userId}`, 'GET');
    }
}

export default PolicyService;
