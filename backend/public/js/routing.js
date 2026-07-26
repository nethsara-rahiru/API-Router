// routing.js - Strategy Configuration

window.RoutingView = {
  render(container) {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h2>Gateway Routing Engine</h2>
          <p class="text-muted" style="font-size: 13px;">Configure how requests are dispatched across your provider key pool.</p>
        </div>
      </div>

      <div class="routing-grid">
        <div class="routing-card glass selected" data-strategy="round_robin">
          <h4>Round Robin (Active)</h4>
          <p>Distributes incoming requests evenly across all healthy provider keys in the pool.</p>
        </div>
        <div class="routing-card glass" data-strategy="least_usage">
          <h4>Least Usage</h4>
          <p>Routes requests to the key that has processed the fewest total tokens/requests.</p>
        </div>
        <div class="routing-card glass" data-strategy="fastest">
          <h4>Fastest Response</h4>
          <p>Dynamically measures key response latencies and routes to the lowest-latency key.</p>
        </div>
        <div class="routing-card glass" data-strategy="smart">
          <h4>Smart Routing</h4>
          <p>Combines latency, error rates, and remaining provider rate limits.</p>
        </div>
      </div>
    `;

    container.querySelectorAll('.routing-card').forEach(card => {
      card.addEventListener('click', (e) => {
        container.querySelectorAll('.routing-card').forEach(c => c.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        App.toast(`Routing strategy set to: ${e.currentTarget.querySelector('h4').textContent}`, 'success');
      });
    });
  }
};
