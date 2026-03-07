const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function checkOllamaInstalled() {
  try {
    await execAsync('which ollama');
    return true;
  } catch {
    return false;
  }
}

async function isOllamaServerRunning() {
  try {
    const { stdout } = await execAsync('curl -s -o /dev/null -w "%{http_code}" http://localhost:11434/api/tags');
    return stdout.trim() === '200';
  } catch {
    return false;
  }
}

async function startOllama() {
  console.log('\n🤖 Attempting to start Ollama server (phi4-mini)...\n');

  const hasOllama = await checkOllamaInstalled();

  if (!hasOllama) {
    console.log('⚠️  Ollama not found - skipping LLM startup');
    console.log('   To use the LLM, install Ollama from: https://ollama.ai\n');
    return null;
  }

  const alreadyRunning = await isOllamaServerRunning();

  if (alreadyRunning) {
    console.log('✓ Ollama server is already running\n');
    return null;
  }

  try {
    console.log('🚀 Starting Ollama server in background...\n');

    // Start the Ollama server daemon (not `ollama run` which is interactive)
    const ollamaProcess = spawn('ollama', ['serve'], {
      detached: true,
      stdio: 'ignore'
    });

    ollamaProcess.unref();

    // Give the server a moment to come up
    await new Promise(resolve => setTimeout(resolve, 2000));

    const started = await isOllamaServerRunning();
    if (started) {
      console.log('✓ Ollama server started successfully\n');
    } else {
      console.log('⚠️  Ollama server may not have started yet (will retry in-game)\n');
    }

    return ollamaProcess;
  } catch (error) {
    console.log('⚠️  Could not start Ollama server:', error.message);
    console.log('   Try running: ollama serve  (then: ollama pull phi4-mini)\n');
    return null;
  }
}

async function startDevServer() {
  console.log('🎮 Starting development server...\n');
  
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  devServer.on('close', (code) => {
    console.log(`\n👋 Development server exited with code ${code}`);
    process.exit(code);
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('🎮 derGeselle - Game with AI');
  console.log('='.repeat(60));
  
  // Try to start Ollama server (won't block if it fails)
  await startOllama();
  
  // Always start the dev server
  await startDevServer();
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down...');
  process.exit(0);
});

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
