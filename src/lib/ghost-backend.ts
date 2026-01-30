/**
 * Ghost Backend Integration Layer
 * Aurora UI communicates with Ghost V2 automation backend
 * 
 * Bridges:
 * - Aurora visual commands → Ghost shell automation
 * - Ghost task queue → Aurora UI feedback
 * - Ghost macros/scheduling → Aurora spontaneous dreaming
 * - Ghost webhooks → Aurora event system
 */

export interface GhostBackendConfig {
  ghostReposPath: string;
  autoLogPath: string;
  macrosFile: string;
  queueFile: string;
  jobsFile: string;
  websocketPort: number;
}

export interface GhostMacro {
  name: string;
  description: string;
  steps: string[];
  created: string;
  runs: number;
}

export interface GhostTask {
  id: string;
  task: string;
  priority: 'high' | 'normal' | 'low';
  created: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
}

export interface GhostJob {
  name: string;
  command: string;
  schedule: string;
  cron_expr: string;
  created: string;
  runs: number;
}

export interface GhostEvent {
  type: string;
  data: any;
  timestamp: string;
}

// ============================================================================
// GHOST BACKEND COMMUNICATION
// ============================================================================

class GhostBackendClient {
  private config: GhostBackendConfig;
  private websocket: WebSocket | null = null;
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor(config: Partial<GhostBackendConfig> = {}) {
    this.config = {
      ghostReposPath: config.ghostReposPath || `${process.env.HOME}/ghost-repos`,
      autoLogPath: config.autoLogPath || `${process.env.HOME}/ghost-repos/automation-engine.log`,
      macrosFile: config.macrosFile || `${process.env.HOME}/.ghost-config/macros.json`,
      queueFile: config.queueFile || `${process.env.HOME}/.ghost-config/task-queue.json`,
      jobsFile: config.jobsFile || `${process.env.HOME}/.ghost-config/background-jobs.json`,
      websocketPort: config.websocketPort || 8765,
    };
  }

  // =========================================================================
  // WEBSOCKET CONNECTION (FOR REAL-TIME EVENTS)
  // =========================================================================

  async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://localhost:${this.config.websocketPort}`;
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
          console.log('[Ghost] WebSocket connected');
          resolve();
        };

        this.websocket.onmessage = (event) => {
          try {
            const ghostEvent: GhostEvent = JSON.parse(event.data);
            this.dispatchEvent(ghostEvent.type, ghostEvent.data);
          } catch (e) {
            console.error('[Ghost] Failed to parse event', e);
          }
        };

        this.websocket.onerror = (error) => {
          console.warn('[Ghost] WebSocket error', error);
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log('[Ghost] WebSocket disconnected');
          this.websocket = null;
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  // =========================================================================
  // EVENT SUBSCRIPTION (LOCAL + REMOTE)
  // =========================================================================

  on(eventType: string, callback: Function): void {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, []);
    }
    this.eventCallbacks.get(eventType)!.push(callback);
  }

  off(eventType: string, callback: Function): void {
    const callbacks = this.eventCallbacks.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  private dispatchEvent(eventType: string, data: any): void {
    const callbacks = this.eventCallbacks.get(eventType);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[Ghost] Event callback error for ${eventType}`, e);
        }
      });
    }
  }

  // =========================================================================
  // MACRO OPERATIONS (CONNECTS TO GHOST AUTOMATION-ENGINE.SH)
  // =========================================================================

  async listMacros(): Promise<GhostMacro[]> {
    try {
      // Would fetch from macros.json in real implementation
      // For now, return empty array
      return [];
    } catch (e) {
      console.error('[Ghost] Failed to list macros', e);
      return [];
    }
  }

  async playMacro(macroName: string): Promise<void> {
    // Emit event to trigger ghost shell command
    this.dispatchEvent('ghost.macro.play', { macro: macroName });
  }

  async recordMacro(macroName: string, steps: string[]): Promise<void> {
    this.dispatchEvent('ghost.macro.record', { macro: macroName, steps });
  }

  async deleteMacro(macroName: string): Promise<void> {
    this.dispatchEvent('ghost.macro.delete', { macro: macroName });
  }

  // =========================================================================
  // TASK QUEUE OPERATIONS (CONNECTS TO AUTOMATION-ENGINE.SH)
  // =========================================================================

  async queueTask(task: string, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
    const taskId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.dispatchEvent('ghost.task.queue', {
      id: taskId,
      task,
      priority,
      status: 'pending',
    });

    return taskId;
  }

  async executeQueue(): Promise<void> {
    this.dispatchEvent('ghost.queue.execute', {});
  }

  async listQueue(): Promise<GhostTask[]> {
    try {
      // Would fetch from task-queue.json in real implementation
      return [];
    } catch (e) {
      console.error('[Ghost] Failed to list queue', e);
      return [];
    }
  }

  // =========================================================================
  // SCHEDULED JOB OPERATIONS (CONNECTS TO AUTOMATION-ENGINE.SH)
  // =========================================================================

  async scheduleJob(schedule: string, command: string, jobName?: string): Promise<void> {
    const name = jobName || `job-${Date.now()}`;
    
    this.dispatchEvent('ghost.job.schedule', {
      name,
      schedule,
      command,
    });
  }

  async listJobs(): Promise<GhostJob[]> {
    try {
      // Would fetch from background-jobs.json in real implementation
      return [];
    } catch (e) {
      console.error('[Ghost] Failed to list jobs', e);
      return [];
    }
  }

  // =========================================================================
  // BACKGROUND JOB OPERATIONS (CONNECTS TO AUTOMATION-ENGINE.SH)
  // =========================================================================

  async runBackground(command: string, jobName?: string): Promise<string> {
    const name = jobName || `bg-job-${Date.now()}`;
    
    this.dispatchEvent('ghost.job.background', {
      name,
      command,
    });

    return name;
  }

  async stopBackground(jobName: string): Promise<void> {
    this.dispatchEvent('ghost.job.stop', { name: jobName });
  }

  // =========================================================================
  // ECOSYSTEM OPERATIONS (CONNECTS TO ECOSYSTEM.SH)
  // =========================================================================

  async registerWebhook(event: string, webhookUrl: string): Promise<void> {
    this.dispatchEvent('ghost.webhook.register', { event, webhookUrl });
  }

  async listWebhooks(): Promise<Array<{ event: string; url: string }>> {
    try {
      return [];
    } catch (e) {
      console.error('[Ghost] Failed to list webhooks', e);
      return [];
    }
  }

  // Extensions
  async installExtension(source: string, name?: string): Promise<void> {
    this.dispatchEvent('ghost.extension.install', { source, name });
  }

  async loadExtension(name: string): Promise<void> {
    this.dispatchEvent('ghost.extension.load', { name });
  }

  async listExtensions(): Promise<string[]> {
    try {
      return [];
    } catch (e) {
      console.error('[Ghost] Failed to list extensions', e);
      return [];
    }
  }

  // Profiles
  async createProfile(profileName: string): Promise<void> {
    this.dispatchEvent('ghost.profile.create', { name: profileName });
  }

  async switchProfile(profileName: string): Promise<void> {
    this.dispatchEvent('ghost.profile.switch', { name: profileName });
  }

  async listProfiles(): Promise<string[]> {
    try {
      return [];
    } catch (e) {
      console.error('[Ghost] Failed to list profiles', e);
      return [];
    }
  }

  // Wake Words
  async addWakeWord(word: string): Promise<void> {
    this.dispatchEvent('ghost.wake_word.add', { word });
  }

  async removeWakeWord(word: string): Promise<void> {
    this.dispatchEvent('ghost.wake_word.remove', { word });
  }

  // =========================================================================
  // DEV TOOLS OPERATIONS (CONNECTS TO DEV-TOOLS.SH)
  // =========================================================================

  async gitCommit(message: string): Promise<void> {
    this.dispatchEvent('ghost.git.commit', { message });
  }

  async gitPush(remote: string = 'origin', branch: string = 'main'): Promise<void> {
    this.dispatchEvent('ghost.git.push', { remote, branch });
  }

  async gitPull(remote: string = 'origin', branch: string = 'main'): Promise<void> {
    this.dispatchEvent('ghost.git.pull', { remote, branch });
  }

  async gitBranch(action: string, branchName?: string): Promise<void> {
    this.dispatchEvent('ghost.git.branch', { action, branchName });
  }

  async dockerStart(container: string): Promise<void> {
    this.dispatchEvent('ghost.docker.start', { container });
  }

  async dockerStop(container: string): Promise<void> {
    this.dispatchEvent('ghost.docker.stop', { container });
  }

  async dockerBuild(imageName: string, dockerfile?: string): Promise<void> {
    this.dispatchEvent('ghost.docker.build', { imageName, dockerfile });
  }

  async packageUpdate(): Promise<void> {
    this.dispatchEvent('ghost.pkg.update', {});
  }

  async packageInstall(packageName: string): Promise<void> {
    this.dispatchEvent('ghost.pkg.install', { package: packageName });
  }

  async serverStart(type: string, port?: number, dir?: string): Promise<void> {
    this.dispatchEvent('ghost.server.start', { type, port, dir });
  }

  async serverStop(): Promise<void> {
    this.dispatchEvent('ghost.server.stop', {});
  }

  async sshConnect(host: string, user?: string): Promise<void> {
    this.dispatchEvent('ghost.ssh.connect', { host, user });
  }

  async sshExec(host: string, command: string, user?: string): Promise<void> {
    this.dispatchEvent('ghost.ssh.exec', { host, command, user });
  }

  // =========================================================================
  // INTENT ROUTER (NATURAL LANGUAGE → GHOST COMMANDS)
  // =========================================================================

  async processIntent(intent: string, query: string, confidence: number = 1.0): Promise<void> {
    // Parse natural language intent and route to appropriate Ghost function
    this.dispatchEvent('ghost.intent.process', { intent, query, confidence });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let ghostClient: GhostBackendClient | null = null;

export function getGhostClient(config?: Partial<GhostBackendConfig>): GhostBackendClient {
  if (!ghostClient) {
    ghostClient = new GhostBackendClient(config);
  }
  return ghostClient;
}

export function createGhostClient(config: Partial<GhostBackendConfig>): GhostBackendClient {
  return new GhostBackendClient(config);
}

export default GhostBackendClient;
