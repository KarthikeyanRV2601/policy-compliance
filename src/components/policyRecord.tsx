"use client"
import { useUser } from "@/context";
import PolicyService from "@/service/policyService";
import { Policy } from "@prisma/client";
import { useState, useEffect } from "react";

export const PolicyRecord = () => {
    const { user } = useUser();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
    const [editContent, setEditContent] = useState("");
    const [editName, setEditName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchPolicies();
        }
    }, [user]);

    const fetchPolicies = async () => {
        try {
            if (user) {
                const data = await PolicyService.getPolicies(user?.companyId);
                setPolicies(data);
            }
        } catch (error) {
            console.error("Error fetching policies:", error);
        }
    };

    const handleEdit = (policy: Policy) => {
        setSelectedPolicy(policy);
        setEditName(policy.name);
        setEditContent(policy.content);
    };

    const handleDelete = async (id: string) => {
        await PolicyService.deletePolicy(id);
        setPolicies((prev) => prev.filter((policy) => policy.id !== id));
    }

    const handleSave = async () => {
        if (!selectedPolicy) return;

        setLoading(true);
        try {
            await PolicyService.updatePolicy(editName, editContent, selectedPolicy.id, selectedPolicy.companyId, selectedPolicy.policyType);
            alert("Policy updated successfully!");
            fetchPolicies();
            setSelectedPolicy(null);
        } catch (error) {
            console.error("Error updating policy:", error);
            alert("Error updating policy");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="policy-record">
            <div className="policy-container">
                <h2>All Policies</h2>

                {policies.length === 0 ? (
                    <p>No policies found.</p>
                ) : (
                    <table className="policy-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Version</th>
                                <th>Status</th>
                                <th>PolicyCycle</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy) => (
                                <tr key={policy.id}>
                                    <td>{policy.name}</td>
                                    <td>{policy.type}</td>
                                    <td>{policy.version}</td>
                                    <td>{policy.status}</td>
                                    <td>{policy.policyType}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(policy)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(policy.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedPolicy && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Edit Policy</h3>
                            <input
                                className="policy-name-editor"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <textarea
                                className="policy-editor"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setSelectedPolicy(null)}>Cancel</button>
                                <button className="save-btn" onClick={handleSave} disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};