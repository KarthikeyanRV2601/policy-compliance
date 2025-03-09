import { requestApi } from "./utils";

class EmployeeService {

    static async getCompanyEmployee(companyId: string) {
        return requestApi(`/employee?companyId=${companyId}`, 'GET');
    }
    static async getEmployee(employeeId: string) {
        return requestApi(`/employee?employeeId=${employeeId}`, 'GET');
    }
    
    static async searchEmployee(searchQuery: string, companyId: string) {
        return requestApi(`/employee?searchQuery=${searchQuery}&companyId=${companyId}`, 'GET');
    }

}

export default EmployeeService;
