import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useAppContext } from './contexts/AppContext';
import { DashboardPage } from './components/DashboardPage';
import { ExpensesPage } from './components/ExpensesPage';
import { PartnerContributionsPage } from './components/PartnerContributionsPage';
import { FixedChargesPage } from './components/FixedChargesPage';
import { SettingsPage } from './components/SettingsPage';
import { APP_NAME } from './constants';
import { ChartBarIcon, DocumentChartBarIcon, UsersIcon, BanknotesIcon, CogIcon, CalendarDaysIcon, SunIcon, MoonIcon } from './components/icons/Icons';
import { Button } from './components/ui/Button';

const navLinkClasses = "flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors duration-150";
const activeNavLinkClasses = "bg-blue-500 dark:bg-blue-600 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 hover:text-white dark:hover:text-white";

const App: React.FC = () => {
  const { expenses, partners, categories, theme, toggleTheme } = useAppContext();

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <BanknotesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-semibold text-blue-700 dark:text-blue-400">{APP_NAME}</h1>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
            </NavLink>
            <NavLink to="/expenses" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              <DocumentChartBarIcon className="h-5 w-5 mr-3" /> Expenses
            </NavLink>
            <NavLink to="/partner-contributions" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              <UsersIcon className="h-5 w-5 mr-3" /> Partner Contributions
            </NavLink>
            <NavLink to="/fixed-charges" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
               <CalendarDaysIcon className="h-5 w-5 mr-3" /> Capital Expenditures
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
              <CogIcon className="h-5 w-5 mr-3" /> Settings
            </NavLink>
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
             <Button
                onClick={toggleTheme}
                variant="ghost"
                size="md"
                className="w-full flex items-center justify-center mb-3"
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
                {theme === 'light' ? <MoonIcon className="h-5 w-5 mr-2" /> : <SunIcon className="h-5 w-5 mr-2" />}
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </Button>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>&copy; {new Date().getFullYear()} {APP_NAME}</p>
              <p>Expenses: {expenses.length} | Partners: {partners.length} | Categories: {categories.length}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/partner-contributions" element={<PartnerContributionsPage />} />
            <Route path="/fixed-charges" element={<FixedChargesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;