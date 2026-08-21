import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = () => {
  return (
    <div className="app-main-layout">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-content-wrapper">
        <TopBar />
        <main className="app-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
