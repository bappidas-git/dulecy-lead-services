/* ============================================
   Dashboard Page — Nilachal Infracon Lead Management
   ============================================ */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Chip, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getLeadStats, exportLeadsCSV, getLeads, syncLeadsFromServer, onLeadsChanged } from '../utils/leadService';
import { getStatusConfig } from '../utils/leadStatus';
import styles from './Dashboard.module.css';

const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Short "x ago" label for the recent-enquiries table.
const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const fullDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const trendLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

/* ── 14-day enquiry trend — hand-rolled SVG bar sparkline (no chart lib) ── */
const TrendChart = ({ data = [] }) => {
  const VB_W = 280;
  const VB_H = 70;
  const PAD_BOTTOM = 2;
  const usableH = VB_H - 8;
  const n = data.length || 1;
  const slot = VB_W / n;
  const barW = slot * 0.6;
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={styles.trendSvg}
      role="img"
      aria-label="Enquiries received over the last 14 days"
    >
      {data.map((d, i) => {
        const h = d.count === 0 ? 2 : Math.max(2, (d.count / max) * usableH);
        const x = i * slot + (slot - barW) / 2;
        const y = VB_H - PAD_BOTTOM - h;
        return (
          <rect
            key={d.date}
            x={x}
            y={y}
            width={barW}
            height={h}
            rx={2}
            fill={d.count > 0 ? 'var(--admin-accent)' : 'var(--admin-border)'}
          >
            <title>{`${trendLabel(d.date)}: ${d.count} ${d.count === 1 ? 'enquiry' : 'enquiries'}`}</title>
          </rect>
        );
      })}
    </svg>
  );
};

/* ── Status breakdown — stacked proportion bar + chip-count legend ── */
const StatusBreakdown = ({ breakdown = [], total = 0 }) => (
  <>
    <div className={styles.breakdownBar}>
      {total === 0 ? (
        <div className={styles.breakdownEmptyBar} />
      ) : (
        breakdown
          .filter((s) => s.count > 0)
          .map((s) => (
            <div
              key={s.value}
              className={styles.breakdownSegment}
              style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
              title={`${s.label}: ${s.count}`}
            />
          ))
      )}
    </div>
    <div className={styles.breakdownLegend}>
      {breakdown.map((s) => (
        <div key={s.value} className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: s.color }} />
          <span className={styles.legendLabel}>{s.label}</span>
          <span className={styles.legendCount}>{s.count}</span>
        </div>
      ))}
    </div>
  </>
);

const Dashboard = () => {
  useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const refresh = () => setStats(getLeadStats());
    refresh();

    // Initial server sync so leads submitted on other devices appear. React to
    // BOTH new leads and updated ones (e.g. a status change made on another
    // device) so the recent-enquiries status chips stay current.
    syncLeadsFromServer().then((result) => {
      if (!result.error && (result.added > 0 || result.updated > 0)) refresh();
    });

    // Reflect new leads and admin edits from any tab/window of this browser.
    const unsubscribe = onLeadsChanged(refresh);

    // Poll the server every 15s while visible to catch new leads and status
    // changes synced from other devices.
    const POLL_MS = 15000;
    let intervalId = null;
    const poll = () => {
      if (document.visibilityState !== "visible") return;
      syncLeadsFromServer().then((result) => {
        if (!result.error && (result.added > 0 || result.updated > 0)) refresh();
      });
    };
    const startPolling = () => {
      if (!intervalId) intervalId = setInterval(poll, POLL_MS);
    };
    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        poll();
        refresh();
        startPolling();
      } else {
        stopPolling();
      }
    };

    if (document.visibilityState === "visible") startPolling();

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopPolling();
      unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const statCards = [
    { label: 'Total Enquiries', value: stats?.totalLeads ?? 0, icon: 'mdi:account-multiple-outline', colorClass: 'statIconNavy' },
    { label: 'New Today', value: stats?.newLeads24h ?? 0, icon: 'mdi:account-plus-outline', colorClass: 'statIconGreen' },
    { label: 'This Week', value: stats?.weekLeads ?? 0, icon: 'mdi:calendar-week-outline', colorClass: 'statIconTeal' },
    { label: 'Conversion Rate', value: `${stats?.conversionRate ?? 0}%`, icon: 'mdi:trending-up', colorClass: 'statIconAmber' },
  ];

  const recentLeads = stats?.recentLeads || [];
  const trend = stats?.trend || [];
  const trendTotal = trend.reduce((sum, d) => sum + d.count, 0);
  const breakdown = stats?.statusBreakdown || [];

  const handleExportCSV = () => {
    const leads = getLeads();
    exportLeadsCSV(leads);
  };

  const handleViewLead = (leadId) => {
    navigate(`/admin/lms/lead/${leadId}`);
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const result = await syncLeadsFromServer();
      setStats(getLeadStats());
      if (result.error) {
        setSnackbar({ open: true, message: `Refresh failed: ${result.error}`, severity: "error" });
      } else if (result.added > 0) {
        setSnackbar({
          open: true,
          message: `Refreshed — ${result.added} new enquir${result.added === 1 ? "y" : "ies"} synced`,
          severity: "success",
        });
      } else {
        setSnackbar({ open: true, message: "Refreshed — already up to date", severity: "success" });
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Nilachal Infracon — Lead Management</h1>
          <p className={styles.pageSubtitle}>
            Welcome back. Here&rsquo;s your latest enquiry overview.
          </p>
        </div>
        <div className={styles.headerRight}>
          <Tooltip title="Refresh enquiries">
            <span>
              <IconButton
                size="small"
                onClick={handleRefresh}
                disabled={refreshing}
                aria-label="Refresh enquiries"
                sx={{
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text-secondary)",
                  "&:hover": {
                    borderColor: "var(--admin-accent)",
                    color: "var(--admin-accent)",
                  },
                }}
              >
                <Icon
                  icon="mdi:refresh"
                  width={20}
                  className={refreshing ? styles.refreshSpinning : undefined}
                />
              </IconButton>
            </span>
          </Tooltip>
          <div className={styles.headerDate}>
            <Icon icon="mdi:calendar-outline" width={18} height={18} />
            <span>{formatDate()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[stat.colorClass]}`}>
              <Icon icon={stat.icon} width={22} height={22} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Insights: 14-day trend + status breakdown */}
      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <h2 className={styles.insightTitle}>14-Day Enquiry Trend</h2>
            <span className={styles.insightMeta}>{trendTotal} in last 14 days</span>
          </div>
          <TrendChart data={trend} />
          {trend.length > 0 && (
            <div className={styles.trendAxis}>
              <span>{trendLabel(trend[0].date)}</span>
              <span>{trendLabel(trend[trend.length - 1].date)}</span>
            </div>
          )}
        </div>

        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <h2 className={styles.insightTitle}>Status Breakdown</h2>
            <span className={styles.insightMeta}>{stats?.totalLeads ?? 0} total</span>
          </div>
          <StatusBreakdown breakdown={breakdown} total={stats?.totalLeads ?? 0} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Link to="/admin/lms" className={styles.actionSolid}>
          <Icon icon="mdi:account-group-outline" width={18} height={18} />
          View All Leads
        </Link>
        <button className={styles.actionOutlined} onClick={handleExportCSV}>
          <Icon icon="mdi:download-outline" width={18} height={18} />
          Export CSV
        </button>
      </div>

      {/* Recent Enquiries Section */}
      <div className={styles.recentSection}>
        <div className={styles.recentHeader}>
          <h2 className={styles.sectionTitle}>Recent Enquiries</h2>
          <Link to="/admin/lms" className={styles.viewAllLink}>
            View All <Icon icon="mdi:arrow-right" width={16} height={16} style={{ verticalAlign: 'middle' }} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Icon icon="mdi:inbox-outline" width={56} height={56} />
            </div>
            <p className={styles.emptyText}>No enquiries yet</p>
            <p className={styles.emptySubtext}>
              New enquiries will appear here as they come in from your website forms.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.recentTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Interested In</th>
                    <th>State</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead, idx) => {
                    const sc = getStatusConfig(lead.status);
                    return (
                      <tr key={lead.lead_id} className={idx % 2 === 1 ? styles.rowAlt : undefined}>
                        <td className={styles.leadName}>{lead.name || '—'}</td>
                        <td>{lead.mobile || '—'}</td>
                        <td>{lead.service_interest || '—'}</td>
                        <td>{lead.state || '—'}</td>
                        <td>
                          <Chip
                            label={sc.label}
                            size="small"
                            sx={{
                              bgcolor: sc.bg,
                              color: sc.color,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </td>
                        <td className={styles.leadDate} title={fullDate(lead.submitted_at)}>
                          {timeAgo(lead.submitted_at)}
                        </td>
                        <td>
                          <IconButton
                            size="small"
                            onClick={() => handleViewLead(lead.lead_id)}
                            sx={{ color: 'var(--admin-accent)' }}
                          >
                            <Icon icon="mdi:eye-outline" width={18} height={18} />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className={styles.mobileCards}>
              {recentLeads.map((lead) => {
                const sc = getStatusConfig(lead.status);
                return (
                  <div
                    key={lead.lead_id}
                    className={styles.mobileCard}
                    onClick={() => handleViewLead(lead.lead_id)}
                  >
                    <div className={styles.mobileCardTop}>
                      <span className={styles.mobileCardName}>{lead.name || '—'}</span>
                      <Chip
                        label={sc.label}
                        size="small"
                        sx={{
                          bgcolor: sc.bg,
                          color: sc.color,
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          height: 22,
                        }}
                      />
                    </div>
                    <div className={styles.mobileCardRow}>
                      <Icon icon="mdi:phone-outline" width={14} height={14} />
                      <span>{lead.mobile || '—'}</span>
                    </div>
                    <div className={styles.mobileCardRow}>
                      <Icon icon="mdi:tag-outline" width={14} height={14} />
                      <span>{lead.service_interest || '—'}</span>
                    </div>
                    <div className={styles.mobileCardBottom}>
                      <Chip
                        label={lead.state || '—'}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 22 }}
                      />
                      <span className={styles.mobileCardDate}>
                        {timeAgo(lead.submitted_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer Badge */}
      <p className={styles.footerBadge}>
        Nilachal Infracon Private Limited · Admin Panel
      </p>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
