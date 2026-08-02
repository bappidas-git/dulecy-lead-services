/* ============================================
   NotFoundPage — branded catch-all
   --------------------------------------------
   Rendered by the `*` route inside the shared shell, so an unknown
   URL still gets the Dulcey header, menu and footer.
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => (
  <section className={styles.wrap}>
    <p className="eyebrow">404</p>
    <h1 className="display display--sm">Page not found</h1>
    <p className="lede">
      The page you were looking for doesn&rsquo;t exist or has moved.
    </p>
    <Link to="/" className={`btn btn--primary ${styles.cta}`}>
      Back to Home <span aria-hidden="true">&rarr;</span>
    </Link>
  </section>
);

export default NotFoundPage;
