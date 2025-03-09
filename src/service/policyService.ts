import { requestApi } from "./utils";

class PolicyService {

    static async getPolicy(policyId: string) {
        return requestApi(`/policies/policies?policyId=${policyId}`, 'GET');
    }

    static async getPolicies(companyId: string) {
        return requestApi(`/policies/policies?companyId=${companyId}`, 'GET');
    }

    static async createPolicy(name: string, content: string, type: string, companyId: string, policyType: string) {
        return requestApi('/policies/policies', 'POST', { name, content, companyId, type, policyType });
    }

    static async deletePolicy(id: string) {
        return requestApi('/policies/policies', 'DELETE', { id });
    }


    static async updatePolicy(name: string, content: string, policyId: string, companyId: string, policyType: string | null) {
        return requestApi('/policies/policies', 'POST', { name, content, policyId, companyId, updating: true, policyType });
    }

    static async approvePolicy(policyId: string, approverId: string, approverRole: string, policyType: string) {
        return requestApi("/policies/approve", 'POST', { policyId, approverId, approverRole, policyType });
    }

    static async rejectPolicy(policyId: string, approverId: string, approverRole: string, policyType: string) {
        return requestApi('/policies/reject', 'POST', { policyId, approverId, approverRole, policyType });
    }

    static async undoPolicyApproveRejectAction(policyId: string, approverId: string, approverRole: string, policyType: string) {
        return requestApi('/policies/undo', 'POST', { policyId, approverId, approverRole, policyType });
    }

    static async requestAcknowledgment(employeeId: string, policies: string[]) {
        return requestApi('/policies/acknowledgement/request', 'POST', { employeeId, policies });
    }
    
    static async acknowledgePolicy(policyId: string, employeeId: string) {
        return requestApi('/policies/acknowledgement/acknowledge', 'POST', { policyId, employeeId });
    }

    static async getPendingAcknowledgements(userId: string) {
        return requestApi(`/policies/acknowledgement/acknowledge?userId=${userId}`, 'GET');
    }
}

export default PolicyService;
