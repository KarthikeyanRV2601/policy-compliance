"use client"
import { useCallback, useEffect, useState } from "react";
import PolicyService from "@/service/policyService";
import { Employee, Policy } from "@prisma/client";
import EmployeeService from "@/service/employeeService";
import { useUser } from "@/context";

export const PolicyAcknowledgmentRequest = () => {
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedEmployee) {
            fetchApprovedPolicies(selectedEmployee.companyId);
        }
    }, [selectedEmployee]);

    const searchEmployees = async () => {
        setEmployees([]);
        if (!searchQuery.trim()) return;
        if (user) {
            setLoading(true);
            setError(null);

            try {
                const results = await EmployeeService.searchEmployee(searchQuery, user?.companyId);
                setEmployees(results);
            } catch (error) {
                setError("Error fetching employees");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchApprovedPolicies = async (companyId: string) => {
        setLoading(true);
        setError(null);

        try {
            const policies = await PolicyService.getPolicies(companyId);
            setPolicies(policies);
        } catch (error) {
            setError("Error fetching policies");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePolicySelection = (policyId: string) => {
        setSelectedPolicies((prev) =>
            prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId]
        );
    };

    const requestAcknowledgment = async () => {
        if (!selectedEmployee || selectedPolicies.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            await PolicyService.requestAcknowledgment(selectedEmployee.id, selectedPolicies);
            alert("Acknowledgment requested successfully!");
            setSelectedPolicies([]); // Reset selection
        } catch (error) {
            setError("Error requesting acknowledgment");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-policy-container">
            <h2>Request Policy Acknowledgment</h2>

            {/* Search Employees */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search employee by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={searchEmployees} disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {/* Employee List */}
            {employees.length > 0 && (
                <div className="employee-list">
                    <h3>Select an Employee:</h3>
                    {employees.map((emp) => (
                        <div
                            key={emp.id}
                            className={`employee-item ${selectedEmployee?.id === emp.id ? "selected" : ""}`}
                            onClick={() => setSelectedEmployee(emp)}
                        >
                            {emp.name} ({emp.email})
                        </div>
                    ))}
                </div>
            )}

            {/* Policy List */}
            {selectedEmployee && (
                <div className="policy-list">
                    <h3>Approved Policies for {selectedEmployee.name}</h3>

                    {loading ? (
                        <p>Loading policies...</p>
                    ) : policies.length === 0 ? (
                        <p>No approved policies found.</p>
                    ) : (
                        <ul>
                            {policies.map((policy) => (
                                <li key={policy.id} className="policy-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedPolicies.includes(policy.id)}
                                        onChange={() => handlePolicySelection(policy.id)}
                                    />
                                    {policy.name}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button onClick={requestAcknowledgment} disabled={selectedPolicies.length === 0 || loading}>
                        {loading ? "Requesting..." : "Request Acknowledgment"}
                    </button>
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};
