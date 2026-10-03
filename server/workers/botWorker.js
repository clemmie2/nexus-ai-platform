class WorkerManager {
  constructor() {
    this.workers = new Map();
  }

  start(name, worker) {
    this.workers.set(name, worker);
    return worker;
  }

  stop(name) {
    const worker = this.workers.get(name);
    if (worker && typeof worker.stop === 'function') worker.stop();
    this.workers.delete(name);
  }
}

module.exports = { WorkerManager };
