/* FM: Defines the semantic structure of the app. Centralizes layout authority and exposes namespaced subcomponents for Sidebar and Main. */

// Layout.jsx
export function Layout({ children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
            {children}
        </div>
    );
}

function Sidebar({ children, width = '300px' }) {
    console.log('Layout.Sidebar rendered');
    return (
        <div style={{ width, height: '100%' }}>
            {children}
        </div>
    );
}

function MainArea({ children }) {
    console.log('Layout.MainArea rendered');
    return (
        <div style={{ flex: 1, height: '100%' }}>
            {children}
        </div>
    );
}

Layout.Sidebar = Sidebar;
Layout.MainArea = MainArea;
