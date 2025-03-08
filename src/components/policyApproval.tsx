import { useUser } from "@/context";
import PolicyService from "@/service/policyService";
import { ROLE_PERMISSIONS } from "@/types";
import { Policy } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

enum PolicyStatus {
    ALL = "all",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export const PolicyApproval = () => {
    const { user } = useUser();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [selectedStatus, setSelectedStatus] = useState<PolicyStatus>(PolicyStatus.PENDING);

    useEffect(() => {
        if(user) {
            fetchPolicies();
        }
    }, [user, selectedStatus]);

    const fetchPolicies = async () => {
        if(user) {
            try {
                const data = await PolicyService.getPolicies(user.companyId);
                if (selectedStatus === PolicyStatus.ALL) {
                    setPolicies(data);
                } else {
                    setPolicies(data.filter((p: Policy) => p.status === selectedStatus));
                }
            } catch (error) {
                console.error("Error fetching policies:", error);
            }

        }
    };

    const approvePolicy = useCallback(async (policyId: string, policyType: string) => {
        if (user) {
            await PolicyService.approvePolicy(policyId, user.id, user.role, policyType);
            alert("Policy Approved!");
        }

    }, [])

    const rejectPolicy = useCallback(async (policyId: string, policyType: string) => {
        if (user) {
            await PolicyService.rejectPolicy(policyId, user.id, user.role, policyType);
            alert("Policy Rejected!");
        }
    }, [])

    const undoPolicy = useCallback(async (policyId: string, policyType: string) => {
        if (user) {
            await PolicyService.undoPolicyApproveRejectAction(policyId, user.id, user.role, policyType);
            alert("Policy Undone!");
        }
    }, [])


    const handleAction = async (policyId: string, policyType: string, action: "approve" | "reject" | "undo") => {
        if (user) {
            setLoading((prev) => ({ ...prev, [policyId]: true }));
            try {
                if (action === "approve") {
                    await approvePolicy(policyId, policyType);
                } else if (action === "reject") {
                    await rejectPolicy(policyId, policyType);
                } else {
                    await undoPolicy(policyId, policyType);
                }
                fetchPolicies();
            } catch (error) {
                alert(`Error performing ${action} action`);
                console.error(error);
            } finally {
                setLoading((prev) => ({ ...prev, [policyId]: false }));
            }
        }
    };

    const canUndo = (updatedAt: Date) => {
        const timeDiff = (new Date().getTime() - new Date(updatedAt).getTime()) / 1000;
        return timeDiff <= 60;
    };

    return (
        user && (
            <div className="policy-approval-container">
                <h2>Policy Approval</h2>

                <div className="status-tabs">
                    {Object.values(PolicyStatus).map((status) => (
                        <button
                            key={status}
                            className={`${selectedStatus === status ? "active" : "tab-button"}`}
                            onClick={() => setSelectedStatus(status as PolicyStatus)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {policies.length === 0 ? (
                    <p>No policies found for this status.</p>
                ) : (
                    <div className="policy-approval-list">
                        {policies.map((policy) => (
                            <div key={policy.id} className="policy-approval-item">
                                <p>
                                    {policy.name} - <strong>{policy.status.toUpperCase()}</strong>
                                </p>

                                {policy.status === "pending" ? (
                                    ROLE_PERMISSIONS[user.role]?.includes("ALL") ||
                                        ROLE_PERMISSIONS[user.role]?.includes(policy.type) ? (
                                        <div className="policy-approval-actions">
                                            <button
                                                onClick={() => handleAction(policy.id, policy.type, "approve")}
                                                disabled={loading[policy.id]}
                                                className="approve-btn"
                                            >
                                                {loading[policy.id] ? "Approving..." : "Approve"}
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() => handleAction(policy.id, policy.type, "reject")}
                                                disabled={loading[policy.id]}
                                            >
                                                {loading[policy.id] ? "Rejecting..." : "Reject"}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="no-access">No Approval Rights</span>
                                    )
                                ) : (
                                    <>
                                        <span className={`status-badge ${policy.status}`}>
                                            {policy.status.toUpperCase()}
                                        </span>

                                        {policy.status !== "pending" && canUndo(policy.updatedAt) && (
                                            <button
                                                className="undo-btn"
                                                onClick={() => handleAction(policy.id, policy.type, "undo")}
                                                disabled={loading[policy.id]}
                                            >
                                                {loading[policy.id] ? "Undoing..." : "Undo"}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    );
};
