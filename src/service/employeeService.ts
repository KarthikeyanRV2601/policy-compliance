class EmployeeService {
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

    static async getCompanyEmployee(companyId: string) {
        return this.request(`/.netlify/functions/api/employee/employee?companyId=${companyId}`, 'GET');
    }
    static async getEmployee(employeeId: string) {
        return this.request(`/.netlify/functions/api/employee/employee?employeeId=${employeeId}`, 'GET');
    }
    
    static async searchEmployee(searchQuery: string, companyId: string) {
        return this.request(`/.netlify/functions/api/employee/employee?searchQuery=${searchQuery}&companyId=${companyId}`, 'GET');
    }

}

export default EmployeeService;
