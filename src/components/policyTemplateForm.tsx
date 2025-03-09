import { useUser } from "@/context";
import PolicyService from "@/service/policyService";
import TemplateService from "@/service/templateService";
import { PolicyTemplate } from "@prisma/client";
import { useCallback, useState } from "react";

interface PolicyFormProps {
  template: PolicyTemplate;
  onClose: () => void;
}

export const PolicyTemplateForm: React.FC<PolicyFormProps> = ({ template, onClose }) => {
  const {user} = useUser();
  const [policyData, setPolicyData] = useState<PolicyTemplate>(template);
  const policyCycleTypes = [
    'new_joining',
    'periodic',
    'manual',
  ]
  const [selectedPolicyCycle, setSelectedPolicyCycle] = useState<string>(policyCycleTypes[0]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPolicyData((prev) => ({ ...prev, [name]: value }));
  };

  const createPolicyTemplate = async () => {
    try {
      const templateResponse = await TemplateService.createPolicyTemplates(
        policyData.name,
        policyData.content,
        policyData.type
      );
      console.log("Template Response:", templateResponse);
    } catch (error: any) {
      alert(error.message)
    }
  }

  const createPolicy = async () => {
    if(user) {
      try {
        const policyResponse = await PolicyService.createPolicy(
          policyData.name,
          policyData.content,
          policyData.type,
          user.companyId,
          selectedPolicyCycle
        );
        console.log("Policy Response:", policyResponse);
      } catch (error: any) {
        alert(error.message)
      }

    }
  }

  const handleSubmit = async (saveTemplate: boolean) => {
    if (saveTemplate) {
      createPolicyTemplate();
    } else {
      createPolicy();
    }
    alert("Created Successfully!");
    onClose();
  };

  const handlePolicyCycleSelect = useCallback((event: any) => {
    setSelectedPolicyCycle(event.target.value);
  }, [])

  return (
    <div className="policy-form-container">
      <h2>Edit Policy Template</h2>
      <form>
        <div className="form-group">
          <label>Policy Name</label>
          <input
            type="text"
            name="name"
            value={policyData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Policy Content</label>
          <textarea
            name="content"
            value={policyData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Policy Cycle</label>

          <select onChange={handlePolicyCycleSelect} value={selectedPolicyCycle} className="select-field">
            {policyCycleTypes.map((company, index) => <option key={index} value={company}>{company}</option>)}
          </select>
        </div>

        <div className="form-actions">
          <button className="policy-template-edit-button save" onClick={() => handleSubmit(false)}>Save Policy</button>
          <button className="policy-template-edit-button save-template" onClick={() => handleSubmit(true)}>Create a template</button>
          <button className="policy-template-edit-button cancel" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

