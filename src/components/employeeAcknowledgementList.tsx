import { useEffect, useState } from "react";
import PolicyService from "@/service/policyService";
import { useUser } from "@/context";
import { AcknowledgementRequest } from "@prisma/client";

export const EmployeeAcknowledgementList = ({ onSelectPolicy }: { onSelectPolicy: (policy: string | null) => void }) => {
    const { user } = useUser();
    const [ackRequests, setAckRequests] = useState<AcknowledgementRequest[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchAcknowledgements();
        }
    }, [user]);

    const fetchAcknowledgements = async () => {
        try {
            if (user) {
                const data = await PolicyService.getPendingAcknowledgements(user.id);
                setAckRequests(data);
            }
        } catch (err) {
            setError("Error fetching acknowledgement requests.");
        }
    };

    return (
        <div className="acknowledgement-list">
            <h2>Pending Policy Acknowledgements</h2>

            {error && <p className="error">{error}</p>}

            {ackRequests.length > 0 ? (
                <ul>
                    {ackRequests.map((ack) => (
                        <li key={ack.id} onClick={() => onSelectPolicy(ack.policyId)} className="policy-item">
                            {ack.policyId} (Due: {new Date(ack.dueDate).toLocaleDateString()})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending acknowledgements.</p>
            )}
        </div>
    );
};
