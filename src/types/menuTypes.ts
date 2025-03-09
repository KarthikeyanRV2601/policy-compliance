import { HomePageTabs } from "./policyTypes";

export interface MenuProps {
    currentTab: HomePageTabs;
    setHomePageTab: (tab: HomePageTabs) => void;
}