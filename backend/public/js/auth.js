// auth.js - Sign In & Sign Up Form Handling

document.addEventListener('DOMContentLoaded', () => {
  const loginPanel = document.getElementById('login-panel');
  const registerPanel = document.getElementById('register-panel');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');

  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginPanel.style.display = 'none';
      registerPanel.style.display = 'block';
      loginError.style.display = 'none';
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerPanel.style.display = 'none';
      loginPanel.style.display = 'block';
      registerError.style.display = 'none';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const btn = document.getElementById('login-btn');

      if (!email || !password) {
        loginError.textContent = 'Please enter both email and password.';
        loginError.style.display = 'block';
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Signing in...';

        const res = await App.api('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });

        App.login(res.token, res.user);
      } catch (err) {
        loginError.textContent = err.message || 'Login failed';
        loginError.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      registerError.style.display = 'none';

      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const btn = document.getElementById('register-btn');

      if (!name || !email || !password) {
        registerError.textContent = 'Please fill out all fields.';
        registerError.style.display = 'block';
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Creating account...';

        await App.api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password })
        });

        App.toast('Account created! Logging in...', 'success');
        
        // Automatically login
        const loginRes = await App.api('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        App.login(loginRes.token, loginRes.user);

      } catch (err) {
        registerError.textContent = err.message || 'Registration failed';
        registerError.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
      }
    });
  }
});
