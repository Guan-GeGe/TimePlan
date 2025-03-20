"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      greeting: "下午好，今天也要加油哦",
      currentDate: "",
      completedTasks: 0,
      focusTime: "0h",
      todayTasks: [],
      // 树木养成系统数据
      treeLevel: 1,
      currentExp: 0,
      levelUpExp: 60,
      // 每60分钟升一级
      showCelebration: false,
      totalFocusMinutes: 0
    };
  },
  onLoad() {
    this.setGreeting();
    this.setCurrentDate();
    this.loadTasks();
    this.loadTreeData();
  },
  onShow() {
    this.loadTasks();
  },
  methods: {
    setGreeting() {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      let greeting = "";
      if (hour < 6) {
        greeting = "凌晨好";
      } else if (hour < 11) {
        greeting = "早上好";
      } else if (hour < 14) {
        greeting = "中午好";
      } else if (hour < 18) {
        greeting = "下午好";
      } else {
        greeting = "晚上好";
      }
      this.greeting = `${greeting}，今天也要加油哦`;
    },
    setCurrentDate() {
      const date = /* @__PURE__ */ new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];
      this.currentDate = `${year}年${month}月${day}日 星期${weekDay}`;
    },
    toggleTask(taskId) {
      const task = this.todayTasks.find((t) => t.id === taskId);
      task.completed = !task.completed;
      this.completedTasks = this.todayTasks.filter((t) => t.completed).length;
    },
    startFocus() {
      common_vendor.index.navigateTo({
        url: "/pages/focus/focus"
      });
    },
    addTask() {
      common_vendor.index.navigateTo({
        url: "/pages/addTask/addTask"
      });
    },
    viewStats() {
      common_vendor.index.navigateTo({
        url: "/pages/statistics/statistics"
      });
    },
    viewAllTasks() {
      common_vendor.index.navigateTo({
        url: "/pages/taskList/taskList"
      });
    },
    loadTasks() {
      const tasks = common_vendor.index.getStorageSync("tasks") || [];
      const today = (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
      this.todayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createTime).setHours(0, 0, 0, 0);
        return taskDate === today;
      });
      this.completedTasks = this.todayTasks.filter((t) => t.completed).length;
    },
    loadTreeData() {
      const treeData = common_vendor.index.getStorageSync("treeData") || {
        level: 1,
        exp: 0,
        totalMinutes: 0
      };
      this.treeLevel = treeData.level;
      this.currentExp = treeData.exp;
      this.totalFocusMinutes = treeData.totalMinutes;
    },
    updateTreeExp(minutes) {
      this.currentExp += minutes;
      this.totalFocusMinutes += minutes;
      while (this.currentExp >= this.levelUpExp) {
        this.currentExp -= this.levelUpExp;
        this.treeLevel++;
        this.showCelebration = true;
        common_vendor.index.showToast({
          title: `树木长大啦！现在 ${this.treeLevel} 级`,
          icon: "none",
          duration: 2e3
        });
        setTimeout(() => {
          this.showCelebration = false;
        }, 2e3);
      }
      common_vendor.index.setStorageSync("treeData", {
        level: this.treeLevel,
        exp: this.currentExp,
        totalMinutes: this.totalFocusMinutes
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.greeting),
    b: common_vendor.t($data.currentDate),
    c: $data.treeLevel >= 3
  }, $data.treeLevel >= 3 ? {} : {}, {
    d: $data.treeLevel >= 4
  }, $data.treeLevel >= 4 ? {} : {}, {
    e: common_vendor.n(`tree-level-${$data.treeLevel}`),
    f: common_vendor.n({
      "tree-celebrate": $data.showCelebration
    }),
    g: common_vendor.t($data.treeLevel),
    h: `${$data.currentExp / $data.levelUpExp * 100}%`,
    i: common_vendor.t($data.currentExp),
    j: common_vendor.t($data.levelUpExp),
    k: common_assets._imports_0,
    l: common_assets._imports_1,
    m: common_vendor.t($data.completedTasks),
    n: common_assets._imports_2,
    o: common_vendor.t($data.focusTime),
    p: common_vendor.p({
      type: "calendar",
      size: "30",
      color: "#4CAF50"
    }),
    q: common_vendor.o((...args) => $options.startFocus && $options.startFocus(...args)),
    r: common_vendor.p({
      type: "plus",
      size: "30",
      color: "#4CAF50"
    }),
    s: common_vendor.o((...args) => $options.addTask && $options.addTask(...args)),
    t: common_vendor.p({
      type: "bars",
      size: "30",
      color: "#4CAF50"
    }),
    v: common_vendor.o((...args) => $options.viewStats && $options.viewStats(...args)),
    w: common_assets._imports_3,
    x: common_vendor.o((...args) => $options.viewAllTasks && $options.viewAllTasks(...args)),
    y: $data.todayTasks.length > 0
  }, $data.todayTasks.length > 0 ? {
    z: common_vendor.f($data.todayTasks, (item, k0, i0) => {
      return {
        a: item.completed,
        b: common_vendor.o(($event) => $options.toggleTask(item.id), item.id),
        c: common_vendor.t(item.title),
        d: item.completed ? 1 : "",
        e: item.id
      };
    })
  } : {
    A: common_assets._imports_4
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
