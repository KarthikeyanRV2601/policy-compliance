import { requestApi } from "./utils";

class TemplateService {

    static async getPolicyTemplates() {
        return requestApi('/templates', 'GET');
    }

    static async createPolicyTemplates(name: string, content: string, type: string) {
        return requestApi('/templates', 'POST', { name, content, type });
    }

    static async deletePolicyTemplates(id: string) {
        return requestApi('/templates', 'DELETE', { id });
    }
}

export default TemplateService;
