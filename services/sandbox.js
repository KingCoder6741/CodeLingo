import { ivm } from 'isolated-vm';

// Timeout for code execution
const CODE_TIMEOUT = 5000; // 5 seconds
const MAX_OUTPUT = 10000; // 10KB output limit

export async function execCode(code, language) {
  if (language === 'javascript') {
    return execJavaScript(code);
  } else if (language === 'python') {
    throw new Error('Python execution coming soon - use JavaScript for now');
  } else {
    throw new Error('Unsupported language');
  }
}

async function execJavaScript(code) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = isolate.createContextSync();

  let output = '';
  const jail = context.global;

  // Capture console.log
  jail.setSync('console', {
    log: function(...args) {
      output += args.map(arg => {
        if (typeof arg === 'object') {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      }).join(' ') + '\n';

      if (output.length > MAX_OUTPUT) {
        throw new Error('Output too large');
      }
    },
  });

  try {
    const script = isolate.compileCodeSync(code);
    const result = script.runSync(context, { timeout: CODE_TIMEOUT });
    
    if (result !== undefined) {
      output += String(result);
    }

    return output || '(no output)';
  } catch (err) {
    if (err.message.includes('timeout')) {
      throw new Error('Code execution timed out (5s limit)');
    }
    throw new Error(`Execution error: ${err.message}`);
  }
}
