import { useState } from "react";
import { EmployeeAcknowledgementList } from "./employeeAcknowledgementList";
import { EmployeePolicyView } from "./employeePolicyView";

export const EmployeeAcknowledgementPage = () => {
    const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

    return (
        <div className="policy-employee-acknowledgement">
            {!selectedPolicyId ? (
                <EmployeeAcknowledgementList onSelectPolicy={setSelectedPolicyId} />
            ) : (
                <EmployeePolicyView policyId={selectedPolicyId} onAcknowledged={() => setSelectedPolicyId(null)} />
            )}
        </div>
    );
};
