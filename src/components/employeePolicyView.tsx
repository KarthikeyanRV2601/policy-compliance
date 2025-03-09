import { useCallback, useEffect, useState } from "react";
import PolicyService from "@/service/policyService";
import { useUser } from "@/context";
import { Policy } from "@prisma/client";

export const EmployeePolicyView = ({ policyId, onAcknowledged }: { policyId: string; onAcknowledged: () => void }) => {
    const { user } = useUser();
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [policy, setPolicy] = useState<Policy>();

    const getPolicy = useCallback(async () => {
        const policyResponse = await PolicyService.getPolicy(policyId);
        setPolicy(policyResponse);
    }, [policyId])

    useEffect(() => {
        if (policyId) {
            getPolicy();
        }
    }, [getPolicy, policyId])

    const acknowledgePolicy = async () => {
        if (policyId && user) {
            if (!agreed) return;
            setLoading(true);
            setError(null);
            try {
                await PolicyService.acknowledgePolicy(policyId, user.id);
                alert("Policy acknowledged successfully!");
                onAcknowledged();
            } catch {
                setError("Error acknowledging policy.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        policy && <div className="policy-view">
            <h2>{policy.name}</h2>
            <div className="policy-content">{policy.content}</div>

            <div className="acknowledgement-section">
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    disabled={loading}
                />
                <label>I agree to abide by the policies</label>
            </div>

            {error && <p className="error">{error}</p>}

            <button onClick={acknowledgePolicy} disabled={!agreed || loading}>
                {loading ? "Acknowledging..." : "Acknowledge"}
            </button>
        </div>
    );
};
