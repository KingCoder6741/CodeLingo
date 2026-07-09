// Code Sandbox Integration

let codeEditor = null;
let codeOutput = null;

function initCodeSandbox() {
  codeEditor = document.getElementById('code-editor');
  codeOutput = document.getElementById('code-output');

  if (!codeEditor) return; // Sandbox not on this page
}

async function runCode() {
  const code = codeEditor.value;
  const language = document.getElementById('code-language')?.value || 'javascript';

  if (!code.trim()) {
    notify('Please write some code first.');
    return;
  }

  if (!authToken) {
    notify('Please sign in to run code.');
    openAuth();
    return;
  }

  // Show loading
  codeOutput.innerText = 'Running...';
  codeOutput.style.color = '#5f6b80';

  try {
    const response = await apiCall('/sandbox/run', 'POST', {
      code,
      language
    });

    codeOutput.innerText = response.output || '(no output)';
    codeOutput.style.color = 'var(--green)';
  } catch (err) {
    codeOutput.innerText = err.message;
    codeOutput.style.color = '#ff6b6b';
  }
}

function clearEditor() {
  codeEditor.value = '';
  codeOutput.innerText = 'Click "Run Code" to see output...';
  codeOutput.style.color = 'var(--text-soft)';
}

function openSandbox() {
  document.getElementById('sandbox').style.display = 'block';
  document.getElementById('lessons').style.display = 'none';
  document.getElementById('analytics').style.display = 'none';
  document.getElementById('dashboard').style.display = 'none';
  scrollToSection('sandbox');
  if (!codeEditor) {
    initCodeSandbox();
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  initCodeSandbox();
});
