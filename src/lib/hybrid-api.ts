/**
 * Hybrid API Bridge
 * Unified interface for Aurora UI to control Ghost V2 + Automation
 * 
 * Usage:
 * const hybrid = getHybridAPI();
 * await hybrid.automation.queueTask("npm run build", "high");
 * await hybrid.devtools.gitCommit("Aurora integration");
 * await hybrid.ecosystem.installExtension("https://example.com/ext.sh");
 */

import { getGhostClient } from './ghost-backend';

export interface HybridAPI {
  automation: AutomationAPI;
  devtools: DevToolsAPI;
  ecosystem: EcosystemAPI;
  events: EventsAPI;
}

// ============================================================================
// AUTOMATION API (Macros, Task Queue, Scheduling, Background Jobs)
// ============================================================================

export interface AutomationAPI {
  // Macros
  playMacro(name: string): Promise<void>;
  recordMacro(name: string, steps: string[]): Promise<void>;
  deleteMacro(name: string): Promise<void>;
  listMacros(): Promise<any[]>;

  // Task Queue
  queueTask(task: string, priority?: 'high' | 'normal' | 'low'): Promise<string>;
  executeQueue(): Promise<void>;
  listQueue(): Promise<any[]>;

  // Scheduling
  scheduleJob(schedule: string, command: string, name?: string): Promise<void>;
  listJobs(): Promise<any[]>;

  // Background Jobs
  runBackground(command: string, name?: string): Promise<string>;
  stopBackground(name: string): Promise<void>;
  listBackground(): Promise<any[]>;
}

// ============================================================================
// DEV TOOLS API (Git, Docker, Packages, Servers, SSH)
// ============================================================================

export interface DevToolsAPI {
  // Git
  git: {
    commit(message: string): Promise<void>;
    push(remote?: string, branch?: string): Promise<void>;
    pull(remote?: string, branch?: string): Promise<void>;
    status(): Promise<void>;
    branch(action: string, name?: string): Promise<void>;
  };

  // Docker
  docker: {
    start(container: string): Promise<void>;
    stop(container: string): Promise<void>;
    restart(container: string): Promise<void>;
    build(image: string, dockerfile?: string): Promise<void>;
    run(image: string, name: string, args?: string[]): Promise<void>;
    list(): Promise<void>;
  };

  // Packages
  pkg: {
    update(): Promise<void>;
    install(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    search(query: string): Promise<void>;
    list(): Promise<void>;
  };

  // Servers
  server: {
    start(type: string, port?: number, dir?: string): Promise<void>;
    stop(): Promise<void>;
    status(): Promise<void>;
  };

  // SSH
  ssh: {
    connect(host: string, user?: string): Promise<void>;
    exec(host: string, command: string, user?: string): Promise<void>;
    copy(source: string, dest: string, host: string, user?: string): Promise<void>;
  };
}

// ============================================================================
// ECOSYSTEM API (Webhooks, Extensions, Profiles, Wake Words, Remote API)
// ============================================================================

export interface EcosystemAPI {
  // Webhooks
  webhook: {
    register(event: string, url: string): Promise<void>;
    remove(event: string): Promise<void>;
    list(): Promise<any[]>;
  };

  // Extensions
  extension: {
    install(source: string, name?: string): Promise<void>;
    load(name: string): Promise<void>;
    unload(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    list(): Promise<string[]>;
  };

  // Profiles
  profile: {
    create(name: string): Promise<void>;
    switch(name: string): Promise<void>;
    delete(name: string): Promise<void>;
    list(): Promise<string[]>;
  };

  // Wake Words
  wakeWord: {
    add(word: string): Promise<void>;
    remove(word: string): Promise<void>;
    list(): Promise<string[]>;
  };

  // Remote API
  api: {
    start(port?: number): Promise<void>;
    stop(): Promise<void>;
    status(): Promise<void>;
  };
}

// ============================================================================
// EVENTS API (Aurora ↔ Ghost Event Bridge)
// ============================================================================

export interface EventsAPI {
  on(eventType: string, callback: Function): void;
  off(eventType: string, callback: Function): void;
  emit(eventType: string, data: any): void;
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

class HybridAPIImpl implements HybridAPI {
  private ghost: any;
  private eventCallbacks: Map<string, Function[]> = new Map();

  constructor() {
    this.ghost = getGhostClient();

    // Forward Ghost events to Aurora subscribers
    this.ghost.on('ghost.task.queue', (data: any) =>
      this.emit('automation.taskQueued', data)
    );
    this.ghost.on('ghost.macro.play', (data: any) =>
      this.emit('automation.macroPlayed', data)
    );
    this.ghost.on('ghost.job.schedule', (data: any) =>
      this.emit('automation.jobScheduled', data)
    );
    this.ghost.on('ghost.git.commit', (data: any) =>
      this.emit('devtools.gitCommitted', data)
    );
    this.ghost.on('ghost.docker.start', (data: any) =>
      this.emit('devtools.dockerStarted', data)
    );
    this.ghost.on('ghost.extension.install', (data: any) =>
      this.emit('ecosystem.extensionInstalled', data)
    );
    this.ghost.on('ghost.profile.switch', (data: any) =>
      this.emit('ecosystem.profileSwitched', data)
    );
  }

  // AUTOMATION API
  automation: AutomationAPI = {
    playMacro: (name: string) => this.ghost.playMacro(name),
    recordMacro: (name: string, steps: string[]) => this.ghost.recordMacro(name, steps),
    deleteMacro: (name: string) => this.ghost.deleteMacro(name),
    listMacros: () => this.ghost.listMacros(),

    queueTask: (task: string, priority = 'normal') =>
      this.ghost.queueTask(task, priority),
    executeQueue: () => this.ghost.executeQueue(),
    listQueue: () => this.ghost.listQueue(),

    scheduleJob: (schedule: string, command: string, name?: string) =>
      this.ghost.scheduleJob(schedule, command, name),
    listJobs: () => this.ghost.listJobs(),

    runBackground: (command: string, name?: string) =>
      this.ghost.runBackground(command, name),
    stopBackground: (name: string) => this.ghost.stopBackground(name),
    listBackground: async () => {
      // Would fetch from background-jobs.json
      return [];
    },
  };

  // DEV TOOLS API
  devtools: DevToolsAPI = {
    git: {
      commit: (msg) => this.ghost.gitCommit(msg),
      push: (remote = 'origin', branch = 'main') =>
        this.ghost.gitPush(remote, branch),
      pull: (remote = 'origin', branch = 'main') =>
        this.ghost.gitPull(remote, branch),
      status: () => this.ghost.processIntent('dev.git.status', ''),
      branch: (action, name) => this.ghost.gitBranch(action, name),
    },

    docker: {
      start: (container) => this.ghost.dockerStart(container),
      stop: (container) => this.ghost.dockerStop(container),
      restart: (container) =>
        this.ghost.processIntent('dev.docker.restart', container),
      build: (image, dockerfile) => this.ghost.dockerBuild(image, dockerfile),
      run: (image, name, args) =>
        this.ghost.processIntent('dev.docker.run', `${image} ${name}`),
      list: () => this.ghost.processIntent('dev.docker.list', ''),
    },

    pkg: {
      update: () => this.ghost.packageUpdate(),
      install: (name) => this.ghost.packageInstall(name),
      remove: (name) => this.ghost.processIntent('dev.pkg.remove', name),
      search: (query) =>
        this.ghost.processIntent('dev.pkg.search', query),
      list: () => this.ghost.processIntent('dev.pkg.list', ''),
    },

    server: {
      start: (type, port, dir) => this.ghost.serverStart(type, port, dir),
      stop: () => this.ghost.serverStop(),
      status: () =>
        this.ghost.processIntent('dev.server.status', ''),
    },

    ssh: {
      connect: (host, user) =>
        this.ghost.sshConnect(host, user),
      exec: (host, command, user) =>
        this.ghost.sshExec(host, command, user),
      copy: (source, dest, host, user) =>
        this.ghost.processIntent('dev.ssh.copy', source),
    },
  };

  // ECOSYSTEM API
  ecosystem: EcosystemAPI = {
    webhook: {
      register: (event, url) =>
        this.ghost.registerWebhook(event, url),
      remove: (event) =>
        this.ghost.processIntent('ecosystem.webhook.remove', event),
      list: () => this.ghost.listWebhooks(),
    },

    extension: {
      install: (source, name) =>
        this.ghost.installExtension(source, name),
      load: (name) => this.ghost.loadExtension(name),
      unload: (name) =>
        this.ghost.processIntent('ecosystem.extension.unload', name),
      remove: (name) =>
        this.ghost.processIntent('ecosystem.extension.remove', name),
      list: () => this.ghost.listExtensions(),
    },

    profile: {
      create: (name) => this.ghost.createProfile(name),
      switch: (name) => this.ghost.switchProfile(name),
      delete: (name) =>
        this.ghost.processIntent('ecosystem.profile.delete', name),
      list: () => this.ghost.listProfiles(),
    },

    wakeWord: {
      add: (word) => this.ghost.addWakeWord(word),
      remove: (word) => this.ghost.removeWakeWord(word),
      list: async () => [],
    },

    api: {
      start: (port) =>
        this.ghost.processIntent('ecosystem.api.start', `${port || 8765}`),
      stop: () =>
        this.ghost.processIntent('ecosystem.api.stop', ''),
      status: () =>
        this.ghost.processIntent('ecosystem.api.status', ''),
    },
  };

  // EVENTS API
  events: EventsAPI = {
    on: (eventType: string, callback: Function) => {
      if (!this.eventCallbacks.has(eventType)) {
        this.eventCallbacks.set(eventType, []);
      }
      this.eventCallbacks.get(eventType)!.push(callback);
    },
    off: (eventType: string, callback: Function) => {
      const callbacks = this.eventCallbacks.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      }
    },
    emit: this.emit.bind(this),
  };

  private emit(eventType: string, data: any): void {
    const callbacks = this.eventCallbacks.get(eventType);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`[Hybrid API] Event callback error for ${eventType}`, e);
        }
      });
    }
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let hybridAPI: HybridAPIImpl | null = null;

export function getHybridAPI(): HybridAPI {
  if (!hybridAPI) {
    hybridAPI = new HybridAPIImpl();
  }
  return hybridAPI;
}

export default getHybridAPI;
