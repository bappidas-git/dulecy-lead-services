/* ============================================
   AdminLoginRoute — lazy boundary for /admin/login
   --------------------------------------------
   Pairs `AdminAuthProvider` with `AdminLogin`. Exists so `App.jsx` can
   reach the login screen through a single `lazy()` import instead of
   importing the auth context at module scope — which would pull the whole
   admin dependency graph into the public bundle (Prompt 12).

   Auth behaviour is unchanged: this is the same provider wrapping the same
   screen, just resolved one Suspense boundary later.
   ============================================ */

import React from 'react';
import { AdminAuthProvider } from '../context/AdminAuthContext';
import AdminLogin from './AdminLogin';

const AdminLoginRoute = () => (
  <AdminAuthProvider>
    <AdminLogin />
  </AdminAuthProvider>
);

export default AdminLoginRoute;
