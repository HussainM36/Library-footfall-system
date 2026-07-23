// frontend/src/pages/DashboardHome.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  GraduationCap, 
  UserCheck, 
  Clock, 
  Compass, 
  FileSpreadsheet, 
  FileText, 
  Filter,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api/axios';

export const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(new Date());

  // Default state initialized to 0 / loading states
  const [metrics, setMetrics] = useState({
    totalToday: 0,
    studentsToday: 0,
    facultyToday: 0,
    peakHour: 'Loading...',
    topPurpose: 'Loading...',
  });

  const [hourlyTrafficData, setHourlyTrafficData] = useState([]);
  const [purposeDistributionData, setPurposeDistributionData] = useState([]);
  const [visitLogs, setVisitLogs] = useState([]);

  // Report Filters State
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');

  // FETCH LIVE DATA FROM DATABASE (WITH CACHE-BUSTING & EXACT DB DEPT MAPPING)
  const fetchDashboardData = useCallback(async (isManualSync = false) => {
    if (isManualSync) setSyncing(true);
    setError(null);

    // Map UI "D.Ed" value to match "D. Ed." exactly as saved in MySQL database
    const mappedDepartment = selectedDept === 'D.Ed' ? 'D. Ed.' : selectedDept;

    try {
      const response = await api.get('/analytics/dashboard-summary', {
        params: {
          dateRange,
          startDate: dateRange === 'custom' ? startDate : undefined,
          endDate: dateRange === 'custom' ? endDate : undefined,
          role: selectedRole,
          department: mappedDepartment,
          _t: Date.now() // Cache buster parameter to avoid 304 Not Modified
        },
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      const resData = response.data.data || response.data;

      setMetrics({
        totalToday: resData.totalToday || 0,
        studentsToday: resData.studentsToday || 0,
        facultyToday: resData.facultyToday || 0,
        peakHour: resData.peakHour || 'No entries today',
        topPurpose: resData.topPurpose || 'N/A',
      });

      setHourlyTrafficData(resData.hourlyTraffic || []);
      setPurposeDistributionData(resData.purposeDistribution || []);
      setVisitLogs(resData.visitLogs || []);
      setLastSynced(new Date());
    } catch (err) {
      console.error("Dashboard Analytics Fetch Error:", err);
      setError("Unable to connect to live database. Please check backend server.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [dateRange, startDate, endDate, selectedRole, selectedDept]);

  // Initial Fetch on load or when filters change
  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Auto-Polling Interval (Updates every 5 seconds dynamically)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false); // Silent background fetch
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Export to Excel
  const exportToExcel = () => {
    if (!visitLogs || !visitLogs.length) {
      return alert('No database records available for export.');
    }
    const ws = XLSX.utils.json_to_sheet(visitLogs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Library_Visits_Report");
    XLSX.writeFile(wb, `Library_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      if (!visitLogs || visitLogs.length === 0) {
        alert('No database records available for export.');
        return;
      }

      const doc = new jsPDF();

      // Title & Header Information
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("LMS Library Visit & Occupancy Report", 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Generated: ${new Date().toLocaleString()} | Filter: ${dateRange.toUpperCase()}`, 14, 22);

      // Define Table Headers
      const tableColumn = ["Visit ID", "User Name", "Role", "Department", "Purpose", "Time"];

      // Map Data Rows Safely
      const tableRows = visitLogs.map((log, index) => [
        log.id || log.log_id || log.entry_id || (index + 1),
        log.userName || log.name || log.full_name || 'N/A',
        log.userRole || log.role || log.designation || 'N/A',
        log.department || log.dept || log.department_name || 'N/A',
        log.purpose || log.purpose_name || 'General Visit',
        log.time || log.entry_time || log.visit_time || 'N/A'
      ]);

      // Execute autoTable directly using imported function
      autoTable(doc, {
        startY: 28,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { 
          fillColor: [0, 82, 204],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 9, 
          cellPadding: 3 
        },
        alternateRowStyles: { 
          fillColor: [248, 250, 252] 
        }
      });

      // Save PDF Document
      doc.save(`Library_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF report. Check browser console for details.");
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Library Activity & Analytics Dashboard</h1>
          <p style={styles.pageSubtitle}>
            Live database tracking • Auto-synced at {lastSynced.toLocaleTimeString()}
          </p>
        </div>
        <button 
          onClick={() => fetchDashboardData(true)} 
          style={{ ...styles.refreshBtn, opacity: syncing ? 0.7 : 1 }} 
          disabled={syncing || loading}
        >
          <RefreshCw size={16} className={syncing ? 'spin' : ''} /> 
          {syncing ? 'Syncing...' : 'Sync Database'}
        </button>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* TOP METRICS CARDS */}
      <div style={styles.statsGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Today's Total Visitors</span>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#e0f2fe' }}>
              <Users size={20} color="#0052cc" />
            </div>
          </div>
          <div style={styles.cardValue}>{metrics.totalToday}</div>
          <span style={styles.cardFootnote}>Total Footfall Recorded</span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Students</span>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#e6f4ff' }}>
              <GraduationCap size={20} color="#0958d9" />
            </div>
          </div>
          <div style={styles.cardValue}>{metrics.studentsToday}</div>
          <span style={styles.cardFootnote}>
            {metrics.totalToday > 0 ? Math.round((metrics.studentsToday / metrics.totalToday) * 100) : 0}% of today's visitors
          </span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Faculty & Staff</span>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#e6fffb' }}>
              <UserCheck size={20} color="#08979c" />
            </div>
          </div>
          <div style={styles.cardValue}>{metrics.facultyToday}</div>
          <span style={styles.cardFootnote}>
            {metrics.totalToday > 0 ? Math.round((metrics.facultyToday / metrics.totalToday) * 100) : 0}% of today's visitors
          </span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Peak Traffic Hour</span>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#fff7ed' }}>
              <Clock size={20} color="#ea580c" />
            </div>
          </div>
          <div style={{ ...styles.cardValue, fontSize: '18px', paddingTop: '6px' }}>{metrics.peakHour}</div>
          <span style={styles.cardFootnote}>Highest Gate Surge</span>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Top Visit Purpose</span>
            <div style={{ ...styles.iconWrapper, backgroundColor: '#f3e8ff' }}>
              <Compass size={20} color="#9333ea" />
            </div>
          </div>
          <div style={{ ...styles.cardValue, fontSize: '18px', paddingTop: '6px' }}>{metrics.topPurpose}</div>
          <span style={styles.cardFootnote}>Primary Activity</span>
        </div>
      </div>

      {/* REPORT GENERATOR PANEL */}
      <div style={styles.reportPanel}>
        <div style={styles.reportHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="#0052cc" />
            <h3 style={styles.sectionTitle}>Generate Customized Visit Reports</h3>
          </div>
          <div style={styles.exportButtons}>
            <button onClick={exportToExcel} style={styles.excelBtn}>
              <FileSpreadsheet size={16} /> Export Excel
            </button>
            <button onClick={exportToPDF} style={styles.pdfBtn}>
              <FileText size={16} /> Export PDF
            </button>
          </div>
        </div>

        <div style={styles.filterGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Time Period</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={styles.selectInput}>
              <option value="today">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={styles.selectInput} />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={styles.selectInput} />
              </div>
            </>
          )}

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Member Designation</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={styles.selectInput}>
              <option value="all">All Members</option>
              <option value="student">Students Only</option>
              <option value="faculty">Faculty & Staff Only</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Department</label>
            <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={styles.selectInput}>
              <option value="all">All Departments</option>
              <option value="B.Ed">B.Ed</option>
              <option value="D.Ed">D.Ed</option>
              <option value="IIL">IIL</option>
            </select>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>
            <BarChart2 size={18} color="#0052cc" /> Today's Traffic Flow Heatmap
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={hourlyTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0052cc" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0052cc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0052cc" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Purpose of Visit Breakdown</h3>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={purposeDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {purposeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#0052cc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
              {purposeDistributionData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color || '#0052cc' }}></span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#334155' },
  errorBanner: { backgroundColor: '#ffebe9', color: '#d9381e', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(217, 56, 30, 0.2)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  card: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardLabel: { fontSize: '13px', color: '#64748b', fontWeight: '600' },
  iconWrapper: { padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardValue: { fontSize: '26px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' },
  cardFootnote: { fontSize: '12px', color: '#16a34a', fontWeight: '500' },
  reportPanel: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '24px' },
  reportHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 },
  exportButtons: { display: 'flex', gap: '10px' },
  excelBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#107c41', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  pdfBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: '#d9381e', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  filterLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  selectInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#ffffff', color: '#334155' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' },
  chartCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' },
  chartTitle: { fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }
};