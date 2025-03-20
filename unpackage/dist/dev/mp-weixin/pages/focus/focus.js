"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const pomodoroTime = 25 * 60;
const timerTime = 45 * 60;
const _sfc_main = {
  __name: "focus",
  setup(__props) {
    const focusMode = common_vendor.ref("pomodoro");
    const currentTask = common_vendor.ref(null);
    const isStarted = common_vendor.ref(false);
    const isPaused = common_vendor.ref(false);
    const remainingTime = common_vendor.ref(25 * 60);
    const totalTime = common_vendor.ref(25 * 60);
    const timer = common_vendor.ref(null);
    const todayFocusCount = common_vendor.ref(0);
    const todayFocusMinutes = common_vendor.ref(0);
    const completedTasks = common_vendor.ref(0);
    const focusHistory = common_vendor.ref([]);
    common_vendor.ref(0);
    const timerCircleStyle = common_vendor.computed(() => {
      const progressValue = isStarted.value ? (1 - remainingTime.value / totalTime.value) * 100 : 0;
      return {
        background: `conic-gradient(#4f46e5 ${progressValue}%, transparent ${progressValue}%)`
      };
    });
    const timerLabel = common_vendor.computed(() => {
      if (focusMode.value === "pomodoro")
        return "专注时间";
      if (focusMode.value === "timer")
        return "计时器";
      return "秒表";
    });
    const recentHistory = common_vendor.computed(() => {
      return focusHistory.value.slice(0, 3);
    });
    common_vendor.onMounted(() => {
      var _a;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = ((_a = currentPage.$page) == null ? void 0 : _a.options) || {};
      if (options.mode === "select") {
        loadSelectedTask();
      }
      loadFocusHistory();
      calculateStats();
    });
    common_vendor.onShow(() => {
      loadSelectedTask();
    });
    common_vendor.onUnmounted(() => {
      clearTimer();
    });
    function loadSelectedTask() {
      const task = common_vendor.index.getStorageSync("selectedTask");
      if (task) {
        currentTask.value = task;
        common_vendor.index.removeStorageSync("selectedTask");
      }
    }
    function changeMode(mode) {
      if (isStarted.value) {
        common_vendor.index.showToast({
          title: "请先停止当前计时",
          icon: "none"
        });
        return;
      }
      focusMode.value = mode;
      if (mode === "pomodoro") {
        remainingTime.value = pomodoroTime;
        totalTime.value = pomodoroTime;
      } else if (mode === "timer") {
        remainingTime.value = timerTime;
        totalTime.value = timerTime;
      } else {
        remainingTime.value = 0;
        totalTime.value = 0;
      }
    }
    function selectTask() {
      if (isStarted.value) {
        common_vendor.index.showToast({
          title: "请先停止当前计时",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/taskList/taskList?mode=select"
      });
    }
    function formatTime(seconds) {
      const minutes = Math.floor(Math.abs(seconds) / 60);
      const remainingSeconds = Math.abs(seconds) % 60;
      return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    }
    function formatHistoryTime(dateStr) {
      const date = new Date(dateStr);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    function toggleTimer() {
      if (focusMode.value !== "stopwatch" && !currentTask.value) {
        common_vendor.index.showToast({
          title: "请先选择任务",
          icon: "none"
        });
        return;
      }
      if (!isStarted.value) {
        startTimer();
      } else if (isPaused.value) {
        resumeTimer();
      } else {
        pauseTimer();
      }
    }
    function startTimer() {
      isStarted.value = true;
      isPaused.value = false;
      if (timer.value) {
        clearInterval(timer.value);
      }
      if (focusMode.value === "stopwatch") {
        timer.value = setInterval(() => {
          remainingTime.value++;
          common_vendor.index.setStorageSync("timerState", {
            mode: focusMode.value,
            remaining: remainingTime.value,
            total: totalTime.value,
            isStarted: isStarted.value,
            isPaused: isPaused.value,
            startTime: Date.now()
          });
        }, 1e3);
      } else {
        timer.value = setInterval(() => {
          if (remainingTime.value > 0) {
            remainingTime.value--;
            common_vendor.index.setStorageSync("timerState", {
              mode: focusMode.value,
              remaining: remainingTime.value,
              total: totalTime.value,
              isStarted: isStarted.value,
              isPaused: isPaused.value,
              startTime: Date.now()
            });
            if (remainingTime.value === 0) {
              completeTimer();
            }
          }
        }, 1e3);
      }
    }
    function pauseTimer() {
      isPaused.value = true;
      clearInterval(timer.value);
    }
    function resumeTimer() {
      isPaused.value = false;
      if (focusMode.value === "stopwatch") {
        timer.value = setInterval(() => {
          remainingTime.value++;
          common_vendor.index.setStorageSync("timerState", {
            mode: focusMode.value,
            remaining: remainingTime.value,
            total: totalTime.value,
            isStarted: isStarted.value,
            isPaused: isPaused.value,
            startTime: Date.now()
          });
        }, 1e3);
      } else {
        timer.value = setInterval(() => {
          if (remainingTime.value > 0) {
            remainingTime.value--;
            common_vendor.index.setStorageSync("timerState", {
              mode: focusMode.value,
              remaining: remainingTime.value,
              total: totalTime.value,
              isStarted: isStarted.value,
              isPaused: isPaused.value,
              startTime: Date.now()
            });
            if (remainingTime.value === 0) {
              completeTimer();
            }
          }
        }, 1e3);
      }
    }
    function resetTimer() {
      clearInterval(timer.value);
      isStarted.value = false;
      isPaused.value = false;
      common_vendor.index.removeStorageSync("timerState");
      if (focusMode.value === "pomodoro") {
        remainingTime.value = pomodoroTime;
        totalTime.value = pomodoroTime;
      } else if (focusMode.value === "timer") {
        remainingTime.value = timerTime;
        totalTime.value = timerTime;
      } else {
        remainingTime.value = 0;
        totalTime.value = 0;
      }
      if (isStarted.value) {
        common_vendor.index.showToast({
          title: "计时已重置",
          icon: "none"
        });
      }
      if (focusMode.value !== "stopwatch")
        ;
    }
    function stopTimer() {
      if (!isStarted.value) {
        return;
      }
      if (focusMode.value !== "stopwatch" && remainingTime.value > 0) {
        common_vendor.index.showModal({
          title: "确认停止",
          content: "确定要停止当前计时吗？您的进度将不会被保存。",
          success: (res) => {
            if (res.confirm) {
              clearInterval(timer.value);
              isStarted.value = false;
              isPaused.value = false;
              common_vendor.index.removeStorageSync("timerState");
              if (focusMode.value === "pomodoro") {
                remainingTime.value = pomodoroTime;
                totalTime.value = pomodoroTime;
              } else if (focusMode.value === "timer") {
                remainingTime.value = timerTime;
                totalTime.value = timerTime;
              }
              common_vendor.index.showToast({
                title: "计时已停止",
                icon: "none"
              });
            }
          }
        });
      } else if (focusMode.value === "stopwatch") {
        saveFocusRecord();
        clearInterval(timer.value);
        isStarted.value = false;
        isPaused.value = false;
        remainingTime.value = 0;
        totalTime.value = 0;
        common_vendor.index.removeStorageSync("timerState");
        common_vendor.index.showToast({
          title: "记录已保存",
          icon: "success"
        });
      }
    }
    function completeTimer() {
      clearInterval(timer.value);
      const innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.src = "/static/audio/complete.mp3";
      innerAudioContext.play();
      common_vendor.index.vibrateShort({
        success: function() {
          console.log("震动成功");
        }
      });
      saveFocusRecord();
      isStarted.value = false;
      isPaused.value = false;
      common_vendor.index.removeStorageSync("timerState");
      if (focusMode.value === "pomodoro") {
        remainingTime.value = pomodoroTime;
        totalTime.value = pomodoroTime;
      } else if (focusMode.value === "timer") {
        remainingTime.value = timerTime;
        totalTime.value = timerTime;
      }
      common_vendor.index.showToast({
        title: "专注时间完成！",
        icon: "success"
      });
    }
    function saveFocusRecord() {
      let record = {
        id: Date.now().toString(),
        mode: focusMode.value,
        completedAt: (/* @__PURE__ */ new Date()).toISOString(),
        duration: 0
        // 实际专注分钟数
      };
      if (focusMode.value === "stopwatch") {
        record.duration = Math.round(remainingTime.value / 60);
      } else {
        record.duration = Math.round((totalTime.value - remainingTime.value) / 60);
      }
      if (currentTask.value) {
        record.taskId = currentTask.value.id;
        record.taskTitle = currentTask.value.title;
        record.category = currentTask.value.category;
      }
      let history = common_vendor.index.getStorageSync("focusHistory") || [];
      history.unshift(record);
      common_vendor.index.setStorageSync("focusHistory", history);
      focusHistory.value = history;
      calculateStats();
      if (currentTask.value) {
        let tasks = common_vendor.index.getStorageSync("tasks") || [];
        const taskIndex = tasks.findIndex(
          (task) => task.id === currentTask.value.id
        );
        if (taskIndex !== -1) {
          tasks[taskIndex].completedMinutes = (tasks[taskIndex].completedMinutes || 0) + record.duration;
          if (tasks[taskIndex].completedMinutes >= tasks[taskIndex].plannedMinutes) {
            tasks[taskIndex].completed = true;
            tasks[taskIndex].completedAt = (/* @__PURE__ */ new Date()).toISOString();
          }
          common_vendor.index.setStorageSync("tasks", tasks);
        }
      }
      updateTreeGrowth(record.duration);
    }
    function updateTreeGrowth(minutes) {
      let tree = common_vendor.index.getStorageSync("growingTree") || {
        level: 1,
        experience: 0,
        totalMinutes: 0,
        nextLevelExp: 60
        // 初始下一级所需经验
      };
      tree.totalMinutes += minutes;
      tree.experience += minutes;
      while (tree.experience >= tree.nextLevelExp) {
        tree.level += 1;
        tree.experience -= tree.nextLevelExp;
        tree.nextLevelExp = Math.round(tree.nextLevelExp * 1.5);
        common_vendor.index.showToast({
          title: `树木升级到 Lv.${tree.level}！`,
          icon: "success",
          duration: 2e3
        });
      }
      common_vendor.index.setStorageSync("growingTree", tree);
    }
    function loadFocusHistory() {
      focusHistory.value = common_vendor.index.getStorageSync("focusHistory") || [];
    }
    function calculateStats() {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      todayFocusCount.value = 0;
      todayFocusMinutes.value = 0;
      focusHistory.value.forEach((record) => {
        const recordDate = new Date(record.completedAt).toISOString().split("T")[0];
        if (recordDate === today) {
          todayFocusCount.value++;
          todayFocusMinutes.value += record.duration;
        }
      });
      const tasks = common_vendor.index.getStorageSync("tasks") || [];
      completedTasks.value = tasks.filter((task) => task.completed).length;
    }
    function viewAllHistory() {
      common_vendor.index.navigateTo({
        url: "/pages/focusHistory/focusHistory"
      });
    }
    function clearTimer() {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(focusMode.value === "pomodoro" ? "active" : ""),
        b: common_vendor.o(($event) => changeMode("pomodoro")),
        c: common_vendor.n(focusMode.value === "timer" ? "active" : ""),
        d: common_vendor.o(($event) => changeMode("timer")),
        e: common_vendor.n(focusMode.value === "stopwatch" ? "active" : ""),
        f: common_vendor.o(($event) => changeMode("stopwatch")),
        g: focusMode.value !== "stopwatch"
      }, focusMode.value !== "stopwatch" ? {
        h: common_vendor.t(currentTask.value ? currentTask.value.title : "选择要专注的任务..."),
        i: common_vendor.p({
          type: "arrow-down",
          size: "14",
          color: "#6b7280"
        }),
        j: common_vendor.o(selectTask)
      } : {}, {
        k: common_vendor.t(formatTime(remainingTime.value)),
        l: common_vendor.s(timerCircleStyle.value),
        m: common_vendor.t(timerLabel.value),
        n: common_vendor.p({
          type: "refresh",
          size: "24",
          color: "#4f46e5"
        }),
        o: common_vendor.o(resetTimer),
        p: common_vendor.p({
          type: isStarted.value && !isPaused.value ? "pause" : "play",
          size: "28",
          color: "#ffffff"
        }),
        q: common_vendor.o(toggleTimer),
        r: common_vendor.p({
          type: "close",
          size: "24",
          color: "#4f46e5"
        }),
        s: common_vendor.o(stopTimer),
        t: common_vendor.t(todayFocusCount.value),
        v: common_vendor.t(todayFocusMinutes.value),
        w: common_vendor.t(completedTasks.value),
        x: focusHistory.value.length > 0
      }, focusHistory.value.length > 0 ? {
        y: common_vendor.o(viewAllHistory),
        z: common_vendor.f(recentHistory.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.taskTitle || "未命名任务"),
            b: common_vendor.t(formatHistoryTime(item.completedAt)),
            c: common_vendor.t(item.duration),
            d: common_vendor.t(item.category || "专注"),
            e: common_vendor.n(`tag-${item.category || "default"}`),
            f: index
          };
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
