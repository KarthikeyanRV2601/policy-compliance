import { requestApi } from "./utils";

class EmployeeService {

    static async getCompanyEmployee(companyId: string) {
        return requestApi(`/employee/employee?companyId=${companyId}`, 'GET');
    }
    static async getEmployee(employeeId: string) {
        return requestApi(`/employee/employee?employeeId=${employeeId}`, 'GET');
    }
    
    static async searchEmployee(searchQuery: string, companyId: string) {
        return requestApi(`/employee/employee?searchQuery=${searchQuery}&companyId=${companyId}`, 'GET');
    }

}

export default EmployeeService;
