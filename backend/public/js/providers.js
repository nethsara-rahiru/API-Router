// providers.js - AI Provider Keys Management

window.ProvidersView = {
  render(container) {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Provider Keys (Upstream AI Keys)</h2>
          <p class="text-muted" style="font-size: 13px;">Add provider keys (e.g. Groq GSK keys). Keys are validated against the provider API before being stored encrypted with AES-256-GCM.</p>
        </div>
        <button id="add-prov-key-btn" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Provider Key
        </button>
      </div>

      <div class="panel glass">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Validation</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="provider-keys-body">
              <tr><td colspan="5" class="table-empty"><span class="spinner"></span> Loading provider keys...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('add-prov-key-btn').addEventListener('click', () => this.showAddModal());
    this.loadKeys();
  },

  async loadKeys() {
    const tbody = document.getElementById('provider-keys-body');
    if (!tbody) return;
    try {
      const res = await App.api('/providers/keys');
      if (!res.keys || res.keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No upstream provider keys added yet. Add a Groq key to enable gateway routing.</td></tr>';
        return;
      }

      tbody.innerHTML = res.keys.map(key => `
        <tr>
          <td><strong style="text-transform:uppercase;">${key.provider}</strong></td>
          <td><span class="badge badge-${key.validationStatus}">${key.validationStatus}</span></td>
          <td><span class="badge badge-${key.status}">${key.status}</span></td>
          <td>${new Date(key.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-danger btn-sm delete-prov-key-btn" data-id="${key._id}">Delete</button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.delete-prov-key-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.deleteKey(e.currentTarget.dataset.id));
      });
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--danger);">${err.message}</td></tr>`;
    }
  },

  showAddModal() {
    const bodyHtml = `
      <form id="add-prov-key-form">
        <div class="input-group">
          <label for="provider-code">Provider</label>
          <select id="provider-code" required>
            <option value="groq">Groq (gsk_...)</option>
          </select>
        </div>
        <div class="input-group">
          <label for="provider-key">API Key Secret</label>
          <input type="password" id="provider-key" placeholder="gsk_..." required>
        </div>
        <div id="modal-error" class="form-error" style="display:none;"></div>
        <button type="submit" id="save-key-btn" class="btn btn-primary btn-full">Validate & Save Key</button>
      </form>
    `;
    App.showModal('Add Upstream Provider Key', bodyHtml);

    document.getElementById('add-prov-key-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const provider = document.getElementById('provider-code').value;
      const key = document.getElementById('provider-key').value.trim();
      const btn = document.getElementById('save-key-btn');
      const errEl = document.getElementById('modal-error');

      try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Validating against Groq...';
        errEl.style.display = 'none';

        await App.api('/providers/keys', {
          method: 'POST',
          body: JSON.stringify({ provider, key })
        });

        App.closeModal();
        App.toast('Provider Key validated & saved!', 'success');
        this.loadKeys();
      } catch (err) {
        errEl.textContent = err.message || 'Validation failed';
        errEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Validate & Save Key';
      }
    });
  },

  async deleteKey(id) {
    if (!confirm('Are you sure you want to remove this provider key from the gateway pool?')) return;
    try {
      await App.api(`/providers/keys/${id}`, { method: 'DELETE' });
      App.toast('Provider key removed', 'info');
      this.loadKeys();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
