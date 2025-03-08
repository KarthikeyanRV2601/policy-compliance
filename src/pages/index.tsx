import { useCallback, useState } from "react";
import { HomePageTabs } from "../types";
import PolicyTemplate from "../components/policyTemplate";
import { EmployeeAcknowledgementPage, Menu, PolicyAcknowledgmentRequest, PolicyApproval, PolicyRecord } from "@/components";
import '../styles/globals.css'
import { UserProvider } from "@/context";


export default function Home() {
  const [homePageTab, setHomePageTab] = useState<HomePageTabs>(HomePageTabs.POLICY_CREATION)

  const renderComponent = useCallback(() => {
    switch (homePageTab) {
      case HomePageTabs.POLICY_CREATION: return <PolicyTemplate />;
      case HomePageTabs.POLICY_RECORD: return <PolicyRecord />;
      case HomePageTabs.POLICY_APPROVAL: return <PolicyApproval />;
      case HomePageTabs.POLICY_ACKNOWLEDGEMENT: return <EmployeeAcknowledgementPage />;
      case HomePageTabs.POLICY_ACKNOWLEDGEMENT_REQUEST: return <PolicyAcknowledgmentRequest />;
    }
  }, [homePageTab])

  return (
    <UserProvider>
      <div className="home-page">
        <Menu setHomePageTab={setHomePageTab} />
        <div className="rendering-component">
          {renderComponent()}
        </div>
      </div>
    </UserProvider>
  );
}
