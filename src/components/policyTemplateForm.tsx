import PolicyService from "@/service/policyService";
import { useCallback, useState } from "react";

interface PolicyTemplate {
  id: string;
  name: string;
  content: string;
  configuredValues?: Record<string, string>;
  type: string;
}

interface PolicyFormProps {
  template: PolicyTemplate;
  onClose: () => void;
}

export const PolicyTemplateForm: React.FC<PolicyFormProps> = ({ template, onClose }) => {
  const [policyData, setPolicyData] = useState<PolicyTemplate>(template);

  const companyData = [
    'Sprinto',
    'Apple',
    'Google',
    'Oracle'
  ]

  const [selectedCompany, setSelectedCompany] = useState<string>(companyData[0]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPolicyData((prev) => ({ ...prev, [name]: value }));
  };

  const createPolicyTemplate = async () => {
    try {
      const templateResponse = await PolicyService.createPolicyTemplates(
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

    try {
      const policyResponse = await PolicyService.createPolicy(
        policyData.name,
        policyData.content,
        policyData.type,
        selectedCompany
      );
      console.log("Policy Response:", policyResponse);
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleSubmit = async (saveTemplate: boolean) => {
    if (saveTemplate) {
      createPolicyTemplate();
    }
    createPolicy();
    alert("Created Successfully!");
    onClose();
  };


  const handleCompanySelect = useCallback((event: any) => {
    setSelectedCompany(event.target.value);
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
          <label>Company</label>
          <select onChange={handleCompanySelect} value={selectedCompany}>
            {companyData.map((company, index) => <option key={index} value={company}>{company}</option>)}
          </select>
        </div>

        <div className="form-actions">
          <button onClick={() => handleSubmit(false)}>Save Policy</button>
          <button onClick={() => handleSubmit(true)}>Save Template & Policy</button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

