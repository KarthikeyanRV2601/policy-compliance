"use client"
import type { PolicyTemplate } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PolicyTemplateForm } from "./policyTemplateForm";
import { useUser } from "@/context";
import TemplateService from "@/service/templateService";

const PolicyTemplate = () => {
    const [policyTemplates, setPolicyTemplates] = useState<PolicyTemplate[]>([]);
    const { user } = useUser();

    const customTemplate: PolicyTemplate = useMemo(() => {
        return {
            name: 'custom template',
            content: 'Edit your custom content',
            type: 'custom',
            id: 'id',
            createdBy: user?.id || 'userId'
        }
    }, [user]);

    const [templateToEdit, setTemplateToEdit] = useState<PolicyTemplate>(customTemplate);
    const [editTemplate, setEditTemplate] = useState<boolean>();


    const fetchPolicyTemplates = useCallback(async () => {
        const policyTemplatesResponse = await TemplateService.getPolicyTemplates();
        setPolicyTemplates(policyTemplatesResponse);
    }, [])

    useEffect(() => {
        fetchPolicyTemplates();
    }, [])

    const handleTemplateEdit = useCallback((template: PolicyTemplate) => {
        setTemplateToEdit(template);
        setEditTemplate(true);
    }, []);

    const handleEditTemplateFormClose = useCallback(() => {
        setTemplateToEdit(customTemplate);
        setEditTemplate(false);
    }, [customTemplate]);


    const handlePolicyTemplateDelete = useCallback(async (id: string) => {
        await TemplateService.deletePolicyTemplates(id);
        setPolicyTemplates((prev) => prev.filter((template) => template.id !== id))
    }, [customTemplate]);



    return (
        user && <div className="policy-template-container">
            {
                !editTemplate ?
                    <>
                        <h2>Policy Templates</h2>
                        <div className="policy-grid">
                            {
                                policyTemplates.map((template, index) => (
                                    <div className="policy-card" key={index}>
                                        <h3>{template.name}</h3>
                                        <p>{template.content}</p>
                                        <div className="action-buttons">
                                            <button className="create-button" onClick={() => handleTemplateEdit(template)}>Create Policy</button>
                                            {
                                                template.type === 'custom' && <button className="delete-button" onClick={() => handlePolicyTemplateDelete(template.id)}>Delete template</button>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            <div className="policy-card">
                                <h3>Custom template</h3>
                                <button className="create-button" onClick={() => handleTemplateEdit(customTemplate)}>Create Policy</button>
                            </div>
                        </div>
                    </> :
                    <PolicyTemplateForm template={templateToEdit} onClose={handleEditTemplateFormClose} />
            }
        </div>
    );
};

export default PolicyTemplate;
