import { HomePageTabs, MenuProps } from "@/types"



export const Menu = (props: MenuProps) => {
    const { setHomePageTab } = props;
    return (
        <div className="menu">
            <ul>
                {
                    (Object.keys(HomePageTabs) as Array<keyof typeof HomePageTabs>).map((key, index) => <li className="menu-item" key={index} onClick={() => setHomePageTab(HomePageTabs[key])}>{HomePageTabs[key]}</li>)
                }
            </ul>
        </div>
    )
}