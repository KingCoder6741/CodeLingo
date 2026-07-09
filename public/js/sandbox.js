// Code Sandbox Integration

let codeEditor = null;
let codeOutput = null;

function initCodeSandbox() {
  codeEditor = document.getElementById('code-editor');
  codeOutput = document.getElementById('code-output');

  if (!codeEditor) return; // Sandbox not on this page

  // Add run button listener
  document.getElementById('run-code-btn')?.addEventListener('click', runCode);
  
  // Ctrl+Enter to run
  codeEditor?.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      runCode();
    }
  });
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  initCodeSandbox();
});
