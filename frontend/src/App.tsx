import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/header components/Header";
import Dashboard from "./pages/Dashboard";
import Entry from "./pages/Entry";

// 1. Create a Layout component inside App.tsx (or in its own file)
function Layout() {
    return (
        <div className="min-h-screen bg-[#f6f7f8] font-display antialiased text-slate-900">
            <Header />
            {/* The Outlet is where the Dashboard or Entry components will render */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 2. Wrap the routes with the Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/entry" element={<Entry />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;