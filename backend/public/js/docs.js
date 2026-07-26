// docs.js - Interactive System Documentation & API Guide

window.DocsView = {
  render(container) {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>API Router — Documentation & Quickstart</h2>
          <p class="text-muted" style="font-size: 13px;">Everything you need to configure provider keys, generate developer credentials, and send OpenAI-compatible requests.</p>
        </div>
      </div>

      <!-- Quickstart Steps -->
      <div class="panel glass">
        <h3 style="margin-bottom: 16px;">🚀 Quickstart Guide (3 Steps)</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          <div style="background: rgba(0,0,0,0.2); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 6px;">Step 1</div>
            <h4 style="margin-bottom: 6px;">Add Upstream Provider Keys</h4>
            <p style="font-size: 13px; color: var(--text-muted);">Navigate to <strong>Provider Keys</strong> and submit your Groq API key (<code>gsk_...</code>). Keys are validated live against Groq's API and stored with AES-256-GCM encryption.</p>
          </div>

          <div style="background: rgba(0,0,0,0.2); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 6px;">Step 2</div>
            <h4 style="margin-bottom: 6px;">Generate Developer Key</h4>
            <p style="font-size: 13px; color: var(--text-muted);">Navigate to <strong>API Keys</strong> and generate a secret key (<code>apr_live_...</code>). Copy and save this key securely for your applications.</p>
          </div>

          <div style="background: rgba(0,0,0,0.2); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 6px;">Step 3</div>
            <h4 style="margin-bottom: 6px;">Route AI Requests</h4>
            <p style="font-size: 13px; color: var(--text-muted);">Point your OpenAI client or cURL requests to <code>http://localhost:3000/v1/chat/completions</code> using your developer key in the Bearer header.</p>
          </div>
        </div>
      </div>

      <!-- API Reference -->
      <div class="panel glass">
        <h3 style="margin-bottom: 16px;">📡 API Endpoint Reference</h3>

        <div style="margin-bottom: 20px;">
          <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 8px;">
            <span class="badge badge-active" style="font-weight:700; font-size:12px;">POST</span>
            <code style="font-size:14px;">/v1/chat/completions</code>
          </div>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom: 12px;">OpenAI-compatible chat completion endpoint. Smartly routes payload across available upstream provider keys.</p>

          <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 6px;">Headers required:</div>
            <pre style="color: var(--success); font-family: monospace; font-size: 12.5px;">Authorization: Bearer apr_live_YOUR_DEVELOPER_KEY
Content-Type: application/json</pre>
          </div>
        </div>
      </div>

      <!-- Code Examples -->
      <div class="panel glass">
        <h3 style="margin-bottom: 16px;">💻 Code Integration Examples</h3>

        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 14px; margin-bottom: 8px;">cURL Request</h4>
          <div style="background: rgba(0,0,0,0.4); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); overflow-x: auto;">
            <pre style="color: var(--text); font-family: monospace; font-size: 12.5px;">curl http://localhost:3000/v1/chat/completions \\
  -H "Authorization: Bearer apr_live_YOUR_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.1-8b-instant",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello world!"}
    ]
  }'</pre>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="font-size: 14px; margin-bottom: 8px;">Python (OpenAI SDK)</h4>
          <div style="background: rgba(0,0,0,0.4); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); overflow-x: auto;">
            <pre style="color: var(--text); font-family: monospace; font-size: 12.5px;">from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3000/v1",
    api_key="apr_live_YOUR_KEY_HERE"
)

response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": "What is an API Router?"}]
)

print(response.choices[0].message.content)</pre>
          </div>
        </div>

        <div>
          <h4 style="font-size: 14px; margin-bottom: 8px;">Node.js / JavaScript (OpenAI SDK)</h4>
          <div style="background: rgba(0,0,0,0.4); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); overflow-x: auto;">
            <pre style="color: var(--text); font-family: monospace; font-size: 12.5px;">import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://localhost:3000/v1',
  apiKey: 'apr_live_YOUR_KEY_HERE',
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Explain AI gateways' }],
    model: 'llama-3.1-8b-instant',
  });

  console.log(completion.choices[0].message.content);
}

main();</pre>
          </div>
        </div>
      </div>

      <!-- Architecture Concept -->
      <div class="panel glass">
        <h3 style="margin-bottom: 12px;">🛡️ Architecture & Security</h3>
        <ul style="list-style: disc; margin-left: 20px; font-size: 13.5px; color: var(--text-muted); line-height: 1.8;">
          <li><strong style="color:var(--text)">AES-256-GCM Encryption:</strong> Upstream provider keys (e.g. Groq GSK keys) are never stored in plaintext. They are encrypted using a SHA-256 derived 256-bit secret key.</li>
          <li><strong style="color:var(--text)">OpenAI Interface Compatibility:</strong> Request and response payloads follow standard OpenAI JSON formats, requiring zero changes to client code beyond `baseURL` and `apiKey`.</li>
          <li><strong style="color:var(--text)">Automatic Token Tracking:</strong> All prompt tokens, completion tokens, and HTTP response latencies are audited and surfaced on the Analytics tab.</li>
        </ul>
      </div>
    `;
  }
};
