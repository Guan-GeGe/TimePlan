"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      tasks: [],
      isSelectMode: false,
      showFilters: false,
      statusFilter: "pending",
      // all, pending, completed
      categoryFilter: "all",
      priorityFilter: "all",
      categories: ["工作", "学习", "生活", "会议", "沟通", "重要"]
    };
  },
  computed: {
    filteredTasks() {
      return this.tasks.filter((task) => {
        if (this.statusFilter === "pending" && task.completed)
          return false;
        if (this.statusFilter === "completed" && !task.completed)
          return false;
        if (this.categoryFilter !== "all" && task.category !== this.categoryFilter)
          return false;
        if (this.priorityFilter !== "all" && task.priority !== this.priorityFilter)
          return false;
        return true;
      });
    },
    completedCount() {
      return this.tasks.filter((task) => task.completed).length;
    }
  },
  onLoad(options) {
    this.isSelectMode = options.mode === "select";
    this.loadTasks();
  },
  onShow() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      const tasks = common_vendor.index.getStorageSync("tasks") || [];
      this.tasks = tasks;
    },
    selectTask(task) {
      if (this.isSelectMode) {
        common_vendor.index.setStorageSync("selectedTask", task);
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.showActionSheet({
          itemList: ["编辑任务", "开始专注", "删除任务"],
          success: (res) => {
            switch (res.tapIndex) {
              case 0:
                this.editTask(task);
                break;
              case 1:
                this.startFocus(task);
                break;
              case 2:
                this.deleteTask(task);
                break;
            }
          }
        });
      }
    },
    toggleTaskStatus(task) {
      task.completed = !task.completed;
      common_vendor.index.setStorageSync("tasks", this.tasks);
      if (task.completed) {
        this.updateTreeGrowth();
      }
    },
    updateTreeGrowth() {
      const treeData = common_vendor.index.getStorageSync("treeData") || {
        level: 1,
        exp: 0,
        totalMinutes: 0
      };
      treeData.exp += 2;
      const levelUpExp = 60;
      if (treeData.exp >= levelUpExp) {
        const levelUp = Math.floor(treeData.exp / levelUpExp);
        treeData.level += levelUp;
        treeData.exp = treeData.exp % levelUpExp;
        common_vendor.index.showToast({
          title: `树木长大啦！现在 ${treeData.level} 级`,
          icon: "none",
          duration: 2e3
        });
      }
      common_vendor.index.setStorageSync("treeData", treeData);
    },
    editTask(task) {
      common_vendor.index.showToast({
        title: "编辑功能开发中",
        icon: "none"
      });
    },
    startFocus(task) {
      common_vendor.index.setStorageSync("selectedTask", task);
      common_vendor.index.navigateTo({
        url: "/pages/focus/focus"
      });
    },
    deleteTask(task) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个任务吗？",
        success: (res) => {
          if (res.confirm) {
            const index = this.tasks.findIndex((t) => t.id === task.id);
            if (index !== -1) {
              this.tasks.splice(index, 1);
              common_vendor.index.setStorageSync("tasks", this.tasks);
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
            }
          }
        }
      });
    },
    goToAddTask() {
      common_vendor.index.navigateTo({
        url: "/pages/addTask/addTask"
      });
    },
    showFilterOptions() {
      this.showFilters = !this.showFilters;
    },
    setStatusFilter(status) {
      this.statusFilter = status;
    },
    setCategoryFilter(category) {
      this.categoryFilter = category;
    },
    setPriorityFilter(priority) {
      this.priorityFilter = priority;
    },
    clearCompletedTasks() {
      common_vendor.index.showModal({
        title: "确认清除",
        content: "确定要清除所有已完成的任务吗？",
        success: (res) => {
          if (res.confirm) {
            this.tasks = this.tasks.filter((task) => !task.completed);
            common_vendor.index.setStorageSync("tasks", this.tasks);
            common_vendor.index.showToast({
              title: "清除成功",
              icon: "success"
            });
          }
        }
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    getEmptyStateText() {
      if (this.isSelectMode) {
        return "没有可选择的任务";
      }
      if (this.tasks.length === 0) {
        return "暂无任务，点击下方按钮添加";
      }
      if (this.statusFilter === "completed") {
        return "暂无已完成的任务";
      }
      if (this.statusFilter === "pending") {
        return "暂无待完成的任务";
      }
      return "没有符合筛选条件的任务";
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
    a: common_vendor.t($data.isSelectMode ? "选择任务" : "任务列表"),
    b: !$data.isSelectMode
  }, !$data.isSelectMode ? {
    c: common_vendor.p({
      type: "filter",
      size: "20",
      color: "#4f46e5"
    }),
    d: common_vendor.o((...args) => $options.showFilterOptions && $options.showFilterOptions(...args)),
    e: common_vendor.p({
      type: "plusempty",
      size: "20",
      color: "#4f46e5"
    }),
    f: common_vendor.o((...args) => $options.goToAddTask && $options.goToAddTask(...args))
  } : {}, {
    g: $data.showFilters
  }, $data.showFilters ? {
    h: common_vendor.n($data.statusFilter === "all" ? "active" : ""),
    i: common_vendor.o(($event) => $options.setStatusFilter("all")),
    j: common_vendor.n($data.statusFilter === "pending" ? "active" : ""),
    k: common_vendor.o(($event) => $options.setStatusFilter("pending")),
    l: common_vendor.n($data.statusFilter === "completed" ? "active" : ""),
    m: common_vendor.o(($event) => $options.setStatusFilter("completed")),
    n: common_vendor.n($data.categoryFilter === "all" ? "active" : ""),
    o: common_vendor.o(($event) => $options.setCategoryFilter("all")),
    p: common_vendor.f($data.categories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category),
        b: category,
        c: common_vendor.n($data.categoryFilter === category ? "active" : ""),
        d: common_vendor.o(($event) => $options.setCategoryFilter(category), category)
      };
    }),
    q: common_vendor.n($data.priorityFilter === "all" ? "active" : ""),
    r: common_vendor.o(($event) => $options.setPriorityFilter("all")),
    s: common_vendor.n($data.priorityFilter === 0 ? "active" : ""),
    t: common_vendor.o(($event) => $options.setPriorityFilter(0)),
    v: common_vendor.n($data.priorityFilter === 1 ? "active" : ""),
    w: common_vendor.o(($event) => $options.setPriorityFilter(1)),
    x: common_vendor.n($data.priorityFilter === 2 ? "active" : ""),
    y: common_vendor.o(($event) => $options.setPriorityFilter(2))
  } : {}, {
    z: $options.filteredTasks.length > 0
  }, $options.filteredTasks.length > 0 ? {
    A: common_vendor.f($options.filteredTasks, (task, k0, i0) => {
      return common_vendor.e(!$data.isSelectMode ? {
        a: "45144c5f-2-" + i0,
        b: common_vendor.p({
          type: task.completed ? "checkbox-filled" : "circle",
          size: "20",
          color: task.completed ? "#10b981" : "#d1d5db"
        }),
        c: common_vendor.o(($event) => $options.toggleTaskStatus(task), task.id)
      } : {}, {
        d: common_vendor.t(task.title),
        e: common_vendor.n(`priority-${task.priority}`),
        f: "45144c5f-3-" + i0,
        g: common_vendor.t(task.dueDate ? $options.formatDate(task.dueDate) : "无截止日期"),
        h: "45144c5f-4-" + i0,
        i: common_vendor.t(task.duration),
        j: task.category
      }, task.category ? {
        k: "45144c5f-5-" + i0,
        l: common_vendor.p({
          type: "tag",
          size: "12",
          color: "#6b7280"
        }),
        m: common_vendor.t(task.category)
      } : {}, {
        n: "45144c5f-6-" + i0,
        o: common_vendor.n(task.completed ? "completed" : ""),
        p: task.id,
        q: common_vendor.o(($event) => $options.selectTask(task), task.id)
      });
    }),
    B: !$data.isSelectMode,
    C: common_vendor.p({
      type: "calendar",
      size: "12",
      color: "#6b7280"
    }),
    D: common_vendor.p({
      type: "clock",
      size: "12",
      color: "#6b7280"
    }),
    E: common_vendor.p({
      type: $data.isSelectMode ? "arrow-right" : "more-filled",
      size: "16",
      color: "#6b7280"
    })
  } : common_vendor.e({
    F: common_assets._imports_4,
    G: common_vendor.t($options.getEmptyStateText()),
    H: !$data.isSelectMode
  }, !$data.isSelectMode ? {
    I: common_vendor.o((...args) => $options.goToAddTask && $options.goToAddTask(...args))
  } : {}), {
    J: !$data.isSelectMode && $options.filteredTasks.length > 0
  }, !$data.isSelectMode && $options.filteredTasks.length > 0 ? common_vendor.e({
    K: common_vendor.t($data.tasks.length),
    L: common_vendor.t($options.completedCount),
    M: common_vendor.o((...args) => $options.goToAddTask && $options.goToAddTask(...args)),
    N: $options.completedCount > 0
  }, $options.completedCount > 0 ? {
    O: common_vendor.o((...args) => $options.clearCompletedTasks && $options.clearCompletedTasks(...args))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
