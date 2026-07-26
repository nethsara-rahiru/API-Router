// analytics.js - Usage Logs & Performance Reporting

window.AnalyticsView = {
  render(container) {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Analytics & Request Logs</h2>
          <p class="text-muted" style="font-size: 13px;">Full audit log of requests processed by the API gateway.</p>
        </div>
        <button id="refresh-analytics-btn" class="btn btn-secondary btn-sm">Refresh Logs</button>
      </div>

      <div class="panel glass">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Provider</th>
                <th>Model</th>
                <th>Input Tokens</th>
                <th>Output Tokens</th>
                <th>Total Tokens</th>
                <th>Latency</th>
                <th>HTTP Code</th>
              </tr>
            </thead>
            <tbody id="analytics-logs-body">
              <tr><td colspan="8" class="table-empty"><span class="spinner"></span> Loading full logs...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('refresh-analytics-btn').addEventListener('click', () => this.loadLogs());
    this.loadLogs();
  },

  async loadLogs() {
    const tbody = document.getElementById('analytics-logs-body');
    if (!tbody) return;
    try {
      const res = await App.api('/usage/logs?limit=50');
      if (!res.logs || res.logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="table-empty">No requests recorded yet. Send a POST to /v1/chat/completions to see activity here.</td></tr>';
        return;
      }

      tbody.innerHTML = res.logs.map(log => `
        <tr>
          <td>${new Date(log.createdAt).toLocaleString()}</td>
          <td><span class="badge badge-active">${log.provider}</span></td>
          <td><code>${log.model}</code></td>
          <td>${log.inputTokens}</td>
          <td>${log.outputTokens}</td>
          <td><strong>${log.totalTokens}</strong></td>
          <td>${log.responseTimeMs ? log.responseTimeMs + ' ms' : '-'}</td>
          <td><span class="badge ${log.status < 400 ? 'badge-active' : 'badge-invalid'}">${log.status}</span></td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="8" class="table-empty" style="color:var(--danger);">${err.message}</td></tr>`;
    }
  }
};
