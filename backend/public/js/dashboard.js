// dashboard.js - Main Overview Metrics & Recent Activity

window.DashboardView = {
  render(container) {
    container.innerHTML = `
      <div class="section-header">
        <h2>Dashboard Overview</h2>
        <button id="refresh-dash-btn" class="btn btn-secondary btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refresh
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card glass">
          <div class="stat-label">Requests Today</div>
          <div class="stat-value" id="stat-req-today">-</div>
          <div class="stat-sub" id="stat-err-today">0 errors</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-label">Tokens Today</div>
          <div class="stat-value" id="stat-tokens-today">-</div>
          <div class="stat-sub">Tokens processed</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-label">Monthly Requests</div>
          <div class="stat-value" id="stat-req-month">-</div>
          <div class="stat-sub">This billing cycle</div>
        </div>
        <div class="stat-card glass">
          <div class="stat-label">Total Requests</div>
          <div class="stat-value" id="stat-total">-</div>
          <div class="stat-sub">All-time gateway traffic</div>
        </div>
      </div>

      <div class="panel glass">
        <div class="section-header" style="margin-bottom: 16px;">
          <h3>7-Day Traffic Activity</h3>
        </div>
        <div id="chart-area" class="loading-state"><span class="spinner"></span> Loading charts...</div>
      </div>

      <div class="panel glass">
        <div class="section-header" style="margin-bottom: 16px;">
          <h3>Recent Gateway Logs</h3>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Provider</th>
                <th>Model</th>
                <th>Tokens (In / Out / Total)</th>
                <th>Latency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="dashboard-logs-body">
              <tr><td colspan="6" class="table-empty"><span class="spinner"></span> Loading logs...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('refresh-dash-btn').addEventListener('click', () => this.loadData());
    this.loadData();
  },

  async loadData() {
    try {
      const [stats, logsData, chartData] = await Promise.all([
        App.api('/usage/stats'),
        App.api('/usage/logs?limit=10'),
        App.api('/usage/chart?days=7')
      ]);

      // Populate Stats
      const reqToday = document.getElementById('stat-req-today');
      const tokensToday = document.getElementById('stat-tokens-today');
      const errToday = document.getElementById('stat-err-today');
      const reqMonth = document.getElementById('stat-req-month');
      const reqTotal = document.getElementById('stat-total');

      if (reqToday) reqToday.textContent = stats.today?.requests.toLocaleString() || '0';
      if (tokensToday) tokensToday.textContent = stats.today?.tokens.toLocaleString() || '0';
      if (errToday) errToday.textContent = `${stats.today?.errors || 0} errors`;
      if (reqMonth) reqMonth.textContent = stats.month?.requests.toLocaleString() || '0';
      if (reqTotal) reqTotal.textContent = stats.total?.toLocaleString() || '0';

      // Render Logs
      const tbody = document.getElementById('dashboard-logs-body');
      if (tbody) {
        if (!logsData.logs || logsData.logs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No API requests recorded yet. Make a request via /v1/chat/completions</td></tr>';
        } else {
          tbody.innerHTML = logsData.logs.map(log => `
            <tr>
              <td>${new Date(log.createdAt).toLocaleTimeString()}</td>
              <td><span class="badge badge-active">${log.provider}</span></td>
              <td><code>${log.model}</code></td>
              <td>${log.inputTokens} / ${log.outputTokens} / <strong>${log.totalTokens}</strong></td>
              <td>${log.responseTimeMs ? log.responseTimeMs + ' ms' : '-'}</td>
              <td><span class="badge ${log.status < 400 ? 'badge-active' : 'badge-invalid'}">${log.status}</span></td>
            </tr>
          `).join('');
        }
      }

      // Render Chart
      const chartArea = document.getElementById('chart-area');
      if (chartArea) {
        if (!chartData.data || chartData.data.length === 0) {
          chartArea.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px;">No historical usage data yet.</p>';
        } else {
          const maxReqs = Math.max(...chartData.data.map(d => d.requests), 1);
          chartArea.innerHTML = `
            <div class="chart-bar-container">
              ${chartData.data.map(d => {
                const heightPct = Math.max((d.requests / maxReqs) * 100, 5);
                return `
                  <div class="chart-bar-wrap">
                    <div class="chart-bar" style="height: ${heightPct}%" title="${d.requests} reqs (${d.tokens} tokens)"></div>
                    <div class="chart-bar-label">${d._id.substring(5)}</div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }
      }
    } catch (err) {
      App.toast('Failed to load dashboard data', 'error');
    }
  }
};
