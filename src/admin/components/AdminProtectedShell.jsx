/* ============================================
   AdminProtectedShell — lazy boundary for /admin/*
   --------------------------------------------
   Pairs `AdminAuthProvider` with `ProtectedRoute`. Exists so `App.jsx` can
   guard the admin routes through a single `lazy()` import instead of
   importing the auth context at module scope — which would pull the whole
   admin dependency graph into the public bundle (Prompt 12).

   Auth behaviour is unchanged: the same provider wrapping the same guard,
   just resolved one Suspense boundary later.
   ============================================ */

import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import ProtectedRoute from './ProtectedRoute';

const AdminProtectedShell = ({ children }) => (
  <AdminAuthProvider>
    <ProtectedRoute>{children}</ProtectedRoute>
  </AdminAuthProvider>
);

export default AdminProtectedShell;
