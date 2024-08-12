// MetricsHelper.js

const TaskMetrics = require('../models/taskActivityModel');

class MetricsHelper {
  constructor() {
    this.actions = {
      start: this.handleStart,
      pause: this.handlePause,
      resume: this.handleResume,
      complete: this.handleComplete,
      startBreak: this.handleStartBreak,
      endBreak: this.handleEndBreak,
    };
  }

  async updateTaskMetrics(action, taskId, userId, projectId) {
    let metrics = await TaskMetrics.findOne({ task: taskId, user: userId, project: projectId });
    if (!metrics) {
      metrics = new TaskMetrics({
        task: taskId,
        user: userId,
        project: projectId,
        activityType: 'task_metrics',
      });
    }

    const now = new Date();

    if (this.actions[action]) {
      this.actions[action].call(this, metrics, now);
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    await metrics.save();
    return metrics;
  }

  handleStart(metrics, now) {
    metrics.startCount += 1;
    metrics.lastStartTime = now;
    if (!metrics.sessionHistory) {
      metrics.sessionHistory = [];
    }
    metrics.sessionHistory.push({ startTime: now });
  }

  handlePause(metrics, now) {
    metrics.pauseCount += 1;
    metrics.lastPauseTime = now;
    this.updateSessionHistory(metrics, now);
  }

  handleResume(metrics, now) {
    metrics.resumeCount += 1;
    metrics.lastResumeTime = now;
    if (!metrics.sessionHistory) {
      metrics.sessionHistory = [];
    }
    metrics.sessionHistory.push({ startTime: now });
  }

  handleComplete(metrics, now) {
    metrics.completionCount += 1;
    metrics.lastCompletionTime = now;
    this.updateSessionHistory(metrics, now);
  }

  handleStartBreak(metrics, now) {
    metrics.breakCount += 1;
    if (!metrics.breakHistory) {
      metrics.breakHistory = [];
    }
    metrics.breakHistory.push({ startTime: now });
  }

  handleEndBreak(metrics, now) {
    this.updateBreakHistory(metrics, now);
  }

  updateSessionHistory(metrics, endTime) {
    if (!metrics.sessionHistory) {
      metrics.sessionHistory = [];
      return;
    }
    const lastSession = metrics.sessionHistory[metrics.sessionHistory.length - 1];
    if (lastSession && !lastSession.endTime) {
      lastSession.endTime = endTime;
      lastSession.duration = endTime - lastSession.startTime;
      metrics.totalTimeSpent = (metrics.totalTimeSpent || 0) + lastSession.duration;
      metrics.avgSessionDuration = metrics.totalTimeSpent / metrics.startCount;
    }
  }

  updateBreakHistory(metrics, endTime) {
    if (!metrics.breakHistory) {
      metrics.breakHistory = [];
      return;
    }
    const lastBreak = metrics.breakHistory[metrics.breakHistory.length - 1];
    if (lastBreak && !lastBreak.endTime) {
      lastBreak.endTime = endTime;
      lastBreak.duration = endTime - lastBreak.startTime;
      metrics.totalBreakTime = (metrics.totalBreakTime || 0) + lastBreak.duration;
      metrics.avgBreakDuration = metrics.totalBreakTime / metrics.breakCount;
    }
  }
}

module.exports = new MetricsHelper();
