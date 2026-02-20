import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { BottomNav } from './components/BottomNav';
import { useAuth } from './contexts/AuthContext';

export function Layout() {
  const { user } = useAuth();
  const unreadCount = 0; // Will be fetched from backend notifications

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Outlet />
      <BottomNav notificationCount={unreadCount} />
    </div>
  );
}