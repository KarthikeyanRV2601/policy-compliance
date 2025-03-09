import { HomePageTabs, MenuProps } from "@/types"



export const Menu = (props: MenuProps) => {
    const { setHomePageTab, currentTab } = props;
    return (
        <div className="menu">
            
            <h1>Policy Compliance System</h1>
            <ul>
                {
                    (Object.keys(HomePageTabs) as Array<keyof typeof HomePageTabs>).map((key, index) => <li className={`menu-item ${currentTab === HomePageTabs[key] as any ? 'active' : ''}`}key={index} onClick={() => setHomePageTab(HomePageTabs[key])}>{HomePageTabs[key]}</li>)
                }
            </ul>
        </div>
    )
}