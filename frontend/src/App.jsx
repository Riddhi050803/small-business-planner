import React from "react";
import { Route, Routes, BrowserRouter as Router, useLocation } from "react-router-dom";
import './index.css';
import { AuthProvider, useAuth } from "./utils/authProvider";
import AuthenticatedRoute from "./utils/useAuthContext";

import Landing from "./pages/Landing";
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";

import Dashboard from "./pages/HomeDash";
import SignUpForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import { ThemeProvider } from "../components/ui/ThemeContext";
import IncomeS from "./pages/IncomeS";
import StockDataInput from "./pages/StockDataInput";
import SubscriptionPage from "./pages/SubscriptionPage";
import About from "./pages/About";
import Chatbot from "./Components/Chatbot";
import StockAnalysis from "./pages/StockAnalysis";
import AnalyticsPage from "./pages/AnalyticsPage";
import EMICalculator from "./pages/EMICalculator";
import SIPCalculator from "./pages/SIPCalculator";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import CommunityPage from "./pages/CommunityPage";
import CreateCommunityForm from "./pages/CreateCommunityForm";

const routeDefinitions = [
  { path: "/", element: <Landing />, protected: false },
  { path: "/login", element: <LoginForm />, protected: false },
  { path: "/signup", element: <SignUpForm />, protected: false },
  { path: "/dash", element: <Dashboard />, protected: true },
  { path: "/incomeS", element: <IncomeS />, protected: true },
  { path: "/stockInput", element: <StockDataInput />, protected: true },
  { path: "/subscription", element: <SubscriptionPage />, protected: false },
  { path: "/subscription-details", element: <SubscriptionDetails />, protected: true },
  { path: "/about", element: <About />, protected: false },
  { path: "/stock-analysis", element: <StockAnalysis />, protected: true },
  { path: "/analysis", element: <AnalyticsPage />, protected: true },
  { path: "/emi", element: <EMICalculator />, protected: false },
  { path: "/sip", element: <SIPCalculator/>, protected: false},
  { path: "/community", element: <CommunityPage/>, protected: false},
  { path: "/createcommunity", element: <CreateCommunityForm/>, protected: false},
];

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      {routeDefinitions.map(({ path, element, protected: isProtected }) => {
        const routeElement = isProtected ? (
          <AuthenticatedRoute element={element} />
        ) : (
          element
        );
        return <Route key={path} path={path} element={routeElement} />;
      })}
    </Routes>
  );
}

export default function App() {
  const location = useLocation();
  const isDefinedRoute = routeDefinitions.some(
    (route) => route.path === location.pathname
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <div className="md:ml-60">
        <AppRoutes />
        <Footer />
        <Chatbot />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
