/* FM: Defines the semantic structure of the app. Centralizes layout authority and exposes namespaced subcomponents for Sidebar and Main. */

// Layout.jsx
export function Layout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            {children}
        </div>
    );
}

function Sidebar({ children, width = '450px' }) {
    return (
        <div style={{ width, height: '100%' }}>
            {children}
        </div>
    );
}

function Main({ children }) {
    return (
        <div style={{ flex: 1 }}>
            {children}
        </div>
    );
}

Layout.Sidebar = Sidebar;
Layout.Main = Main;
