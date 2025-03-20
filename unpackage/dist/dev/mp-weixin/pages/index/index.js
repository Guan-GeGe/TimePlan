"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const greeting = common_vendor.ref("");
    const currentDate = common_vendor.ref("");
    const efficiencyScore = common_vendor.ref(92);
    const scoreTrend = common_vendor.ref(5);
    const todayTasks = common_vendor.ref([]);
    const completedTasks = common_vendor.computed(() => todayTasks.value.filter((t) => t.completed).length);
    const aiRecommendation = common_vendor.ref("");
    const weeklyProductivity = common_vendor.ref([
      { label: "一", value: 60 },
      { label: "二", value: 80 },
      { label: "三", value: 45 },
      { label: "四", value: 70 },
      { label: "五", value: 90 },
      { label: "六", value: 30 },
      { label: "日", value: 20 }
    ]);
    common_vendor.onMounted(() => {
      setGreeting();
      setCurrentDate();
      loadTasks();
      generateAiRecommendation();
    });
    common_vendor.onShow(() => {
      loadTasks();
      updateEfficiencyScore();
    });
    function setGreeting() {
      const now = /* @__PURE__ */ new Date();
      const hours = now.getHours();
      let username = "时间管理大师";
      try {
        username = common_vendor.index.getStorageSync("username") || username;
      } catch (e) {
        console.error("获取用户名时出错:", e);
      }
      let greetingText = "";
      if (hours < 6) {
        greetingText = "凌晨好";
      } else if (hours < 11) {
        greetingText = "早上好";
      } else if (hours < 14) {
        greetingText = "中午好";
      } else if (hours < 18) {
        greetingText = "下午好";
      } else {
        greetingText = "晚上好";
      }
      greeting.value = `${greetingText}，${username}`;
    }
    function setCurrentDate() {
      const now = /* @__PURE__ */ new Date();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      const day = days[now.getDay()];
      currentDate.value = `今天是${day}，${month}月${date}日`;
    }
    function loadTasks() {
      let tasks = [];
      try {
        tasks = common_vendor.index.getStorageSync("tasks") || [];
      } catch (e) {
        console.error("获取任务时出错:", e);
      }
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      todayTasks.value = tasks.filter(
        (task) => task.date === today || !task.date && !task.completed
      ).sort((a, b) => {
        if (a.completed !== b.completed)
          return a.completed ? 1 : -1;
        if (a.startTime && b.startTime) {
          return a.startTime.localeCompare(b.startTime);
        }
        if (a.startTime && !b.startTime)
          return -1;
        if (!a.startTime && b.startTime)
          return 1;
        return 0;
      });
    }
    function toggleTask(taskId) {
      const task = todayTasks.value.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        try {
          const allTasks = common_vendor.index.getStorageSync("tasks") || [];
          const taskIndex = allTasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            allTasks[taskIndex].completed = task.completed;
            common_vendor.index.setStorageSync("tasks", allTasks);
          }
          updateEfficiencyScore();
          if (task.completed) {
            common_vendor.index.showToast({
              title: "太棒了，又完成一项任务！",
              icon: "none"
            });
          }
        } catch (e) {
          console.error("更新任务状态时出错:", e);
          common_vendor.index.showToast({
            title: "保存任务状态失败",
            icon: "none"
          });
        }
      }
    }
    function updateEfficiencyScore() {
      const totalTasks = todayTasks.value.length;
      if (totalTasks === 0)
        return;
      const completed = completedTasks.value;
      const completionRatio = completed / totalTasks;
      const baseScore = Math.round(60 + completionRatio * 40);
      const randomFactor = Math.floor(Math.random() * 11) - 5;
      const newScore = Math.min(100, Math.max(60, baseScore + randomFactor));
      const oldScore = efficiencyScore.value;
      const trend = Math.round((newScore - oldScore) / oldScore * 100);
      efficiencyScore.value = newScore;
      scoreTrend.value = trend;
    }
    function generateAiRecommendation() {
      if (todayTasks.value.length > 0) {
        const incompleteTasks = todayTasks.value.filter((task) => !task.completed);
        if (incompleteTasks.length > 0) {
          const highPriorityTasks = incompleteTasks.filter(
            (task) => task.priority === "high" || task.priority === 2
          );
          if (highPriorityTasks.length > 0) {
            const task = highPriorityTasks[0];
            aiRecommendation.value = `建议优先完成"${task.title}"任务，这是今天的高优先级任务。`;
          } else {
            const currentHour = (/* @__PURE__ */ new Date()).getHours();
            if (currentHour < 12) {
              aiRecommendation.value = "早上精力充沛，建议先处理需要高度专注的任务。";
            } else if (currentHour < 15) {
              aiRecommendation.value = "午后容易犯困，建议安排一些相对轻松的任务，或进行短时间的休息。";
            } else {
              aiRecommendation.value = "下午是第二个高效时段，可以处理重要但不紧急的任务。";
            }
          }
        } else {
          aiRecommendation.value = "今天的任务已全部完成，建议制定明天的计划或进行一些自我提升的活动。";
        }
      } else {
        aiRecommendation.value = "暂无任务安排，建议添加今日计划以提高时间利用效率。";
      }
    }
    function acceptAiSuggestion() {
      common_vendor.index.showToast({
        title: "已采纳建议",
        icon: "success"
      });
      setTimeout(() => {
        aiRecommendation.value = "";
      }, 1e3);
    }
    function ignoreAiSuggestion() {
      common_vendor.index.showToast({
        title: "已忽略建议",
        icon: "none"
      });
      aiRecommendation.value = "";
    }
    function addTask() {
      common_vendor.index.navigateTo({
        url: "/pages/addTask/addTask"
      });
    }
    function viewStats() {
      common_vendor.index.navigateTo({
        url: "/pages/analytics/analytics"
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(greeting.value),
        b: common_vendor.t(currentDate.value),
        c: common_vendor.t(efficiencyScore.value),
        d: scoreTrend.value > 0
      }, scoreTrend.value > 0 ? {
        e: common_vendor.p({
          type: "arrow-up",
          size: "14",
          color: "#34d399"
        })
      } : scoreTrend.value < 0 ? {
        g: common_vendor.p({
          type: "arrow-down",
          size: "14",
          color: "#ef4444"
        })
      } : {}, {
        f: scoreTrend.value < 0,
        h: scoreTrend.value !== 0
      }, scoreTrend.value !== 0 ? {
        i: common_vendor.t(scoreTrend.value > 0 ? "+" : ""),
        j: common_vendor.t(scoreTrend.value),
        k: common_vendor.n(scoreTrend.value > 0 ? "trend-up" : "trend-down")
      } : {}, {
        l: common_vendor.p({
          type: "bolt",
          size: "24",
          color: "#fbbf24"
        }),
        m: common_vendor.p({
          type: "plus",
          size: "24",
          color: "#4f46e5"
        }),
        n: common_vendor.o(addTask),
        o: common_vendor.t(completedTasks.value),
        p: common_vendor.t(todayTasks.value.length),
        q: todayTasks.value.length > 0
      }, todayTasks.value.length > 0 ? {
        r: common_vendor.f(todayTasks.value, (task, index, i0) => {
          return common_vendor.e({
            a: task.completed
          }, task.completed ? {
            b: "1cf27b2a-4-" + i0,
            c: common_vendor.p({
              type: "checkmark",
              size: "12",
              color: "#ffffff"
            })
          } : {}, {
            d: common_vendor.n(task.completed ? "checked" : ""),
            e: common_vendor.t(task.title),
            f: common_vendor.n(task.completed ? "completed" : ""),
            g: task.startTime && task.endTime
          }, task.startTime && task.endTime ? {
            h: common_vendor.t(task.startTime),
            i: common_vendor.t(task.endTime)
          } : {}, {
            j: common_vendor.t(task.category || "其他"),
            k: common_vendor.n(`tag-${task.category || "default"}`),
            l: index,
            m: common_vendor.o(($event) => toggleTask(task.id), index)
          });
        })
      } : {
        s: common_assets._imports_4,
        t: common_vendor.o(addTask)
      }, {
        v: common_vendor.o(viewStats),
        w: common_vendor.f(weeklyProductivity.value, (day, index, i0) => {
          return {
            a: `${day.value}%`,
            b: common_vendor.t(day.label),
            c: index
          };
        }),
        x: aiRecommendation.value
      }, aiRecommendation.value ? {
        y: common_vendor.p({
          type: "info",
          size: "20",
          color: "#ffffff"
        }),
        z: common_vendor.t(aiRecommendation.value),
        A: common_vendor.o(acceptAiSuggestion),
        B: common_vendor.o(ignoreAiSuggestion)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
