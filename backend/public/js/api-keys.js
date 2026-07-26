// api-keys.js - Developer API Keys Management

window.ApiKeysView = {
  render(container) {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Developer API Keys</h2>
          <p class="text-muted" style="font-size: 13px;">Use these keys to authenticate your requests against the /v1/chat/completions endpoint.</p>
        </div>
        <button id="create-key-btn" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create New Key
        </button>
      </div>

      <div class="panel glass">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key Prefix</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="api-keys-body">
              <tr><td colspan="5" class="table-empty"><span class="spinner"></span> Loading keys...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('create-key-btn').addEventListener('click', () => this.showCreateModal());
    this.loadKeys();
  },

  async loadKeys() {
    const tbody = document.getElementById('api-keys-body');
    if (!tbody) return;
    try {
      const res = await App.api('/keys');
      if (!res.keys || res.keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No developer API keys created yet. Click "Create New Key" above.</td></tr>';
        return;
      }

      tbody.innerHTML = res.keys.map(key => `
        <tr>
          <td><strong>${key.name}</strong></td>
          <td><code>${key.prefix}...</code></td>
          <td><span class="badge ${key.status === 'active' ? 'badge-active' : 'badge-revoked'}">${key.status}</span></td>
          <td>${new Date(key.createdAt).toLocaleDateString()}</td>
          <td>
            ${key.status === 'active' ? `
              <button class="btn btn-danger btn-sm revoke-key-btn" data-id="${key._id}">Revoke</button>
            ` : '<span class="text-muted" style="font-size:12px;">Revoked</span>'}
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.revoke-key-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.revokeKey(e.currentTarget.dataset.id));
      });
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--danger);">${err.message}</td></tr>`;
    }
  },

  showCreateModal() {
    const bodyHtml = `
      <form id="create-key-form">
        <div class="input-group">
          <label for="key-name">Key Name / Description</label>
          <input type="text" id="key-name" placeholder="e.g. Production Web App" required>
        </div>
        <div id="modal-error" class="form-error" style="display:none;"></div>
        <button type="submit" class="btn btn-primary btn-full">Generate API Key</button>
      </form>
    `;
    App.showModal('Create Developer API Key', bodyHtml);

    document.getElementById('create-key-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('key-name').value.trim();
      const errEl = document.getElementById('modal-error');
      
      try {
        const res = await App.api('/keys', {
          method: 'POST',
          body: JSON.stringify({ name })
        });

        App.showModal('API Key Created Successfully', `
          <p class="text-muted" style="font-size:13px;">Save this secret API key now! You won't be able to see it again.</p>
          <div class="key-display">${res.rawKey}</div>
          <button class="btn btn-primary btn-full" onclick="App.closeModal(); ApiKeysView.loadKeys();">Done & Copy</button>
        `);
        
        App.toast('API Key generated', 'success');
      } catch (err) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    });
  },

  async revokeKey(id) {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access immediately.')) return;
    try {
      await App.api(`/keys/${id}/revoke`, { method: 'PATCH' });
      App.toast('Key revoked', 'info');
      this.loadKeys();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
