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
const _sfc_main = {
  __name: "addTask",
  setup(__props) {
    const taskTitle = common_vendor.ref("");
    const duration = common_vendor.ref(25);
    const quickTimes = common_vendor.ref([15, 25, 30, 45, 60]);
    const selectedPriority = common_vendor.ref(1);
    const priorities = common_vendor.ref([
      { label: "低优先级", icon: "arrow-down" },
      { label: "中优先级", icon: "minus" },
      { label: "高优先级", icon: "arrow-up" }
    ]);
    const categories = common_vendor.ref(["工作", "学习", "生活", "会议", "沟通", "重要"]);
    const selectedCategory = common_vendor.ref("工作");
    const dueDate = common_vendor.ref(null);
    const notes = common_vendor.ref("");
    function selectDuration(time) {
      duration.value = time;
    }
    function selectPriority(index) {
      selectedPriority.value = index;
    }
    function selectCategory(category) {
      selectedCategory.value = category;
    }
    function openDatePicker() {
      const now = /* @__PURE__ */ new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      common_vendor.index.showDatePicker({
        date: dueDate.value ? dueDate.value : `${year}-${month}-${day}`,
        success: (e) => {
          dueDate.value = e.date;
        },
        fail: (e) => {
          console.log(e);
        }
      });
    }
    function formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    function goBack() {
      common_vendor.index.navigateBack();
    }
    function submitTask() {
      if (!taskTitle.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入任务名称",
          icon: "none"
        });
        return;
      }
      const newTask = {
        id: Date.now(),
        // 临时使用时间戳作为ID
        title: taskTitle.value,
        duration: duration.value,
        priority: selectedPriority.value,
        category: selectedCategory.value,
        dueDate: dueDate.value,
        notes: notes.value,
        completed: false,
        createTime: /* @__PURE__ */ new Date()
      };
      const tasks = common_vendor.index.getStorageSync("tasks") || [];
      tasks.push(newTask);
      common_vendor.index.setStorageSync("tasks", tasks);
      updateTreeExp();
      common_vendor.index.showToast({
        title: "添加成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1e3);
    }
    function updateTreeExp() {
      const treeData = common_vendor.index.getStorageSync("growingTree") || {
        level: 1,
        experience: 0,
        totalMinutes: 0,
        nextLevelExp: 60
      };
      treeData.experience += 1;
      if (treeData.experience >= treeData.nextLevelExp) {
        const levelUp = Math.floor(treeData.experience / treeData.nextLevelExp);
        treeData.level += levelUp;
        treeData.experience = treeData.experience % treeData.nextLevelExp;
      }
      common_vendor.index.setStorageSync("growingTree", treeData);
    }
    return (_ctx, _cache) => {
      return {
        a: taskTitle.value,
        b: common_vendor.o(($event) => taskTitle.value = $event.detail.value),
        c: common_vendor.f(categories.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category),
            b: index,
            c: common_vendor.n(selectedCategory.value === category ? "active" : ""),
            d: common_vendor.o(($event) => selectCategory(category), index)
          };
        }),
        d: duration.value,
        e: common_vendor.o(($event) => duration.value = $event.detail.value),
        f: common_vendor.f(quickTimes.value, (time, k0, i0) => {
          return {
            a: common_vendor.t(time),
            b: time,
            c: common_vendor.n(duration.value === time ? "active" : ""),
            d: common_vendor.o(($event) => selectDuration(time), time)
          };
        }),
        g: common_vendor.f(priorities.value, (item, index, i0) => {
          return {
            a: "1e30f14d-0-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "16",
              color: selectedPriority.value === index ? "#ffffff" : "#6b7280"
            }),
            c: common_vendor.t(item.label),
            d: index,
            e: common_vendor.n(selectedPriority.value === index ? "active" : ""),
            f: common_vendor.o(($event) => selectPriority(index), index)
          };
        }),
        h: common_vendor.t(dueDate.value ? formatDate(dueDate.value) : "选择日期（可选）"),
        i: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#6b7280"
        }),
        j: common_vendor.o(openDatePicker),
        k: notes.value,
        l: common_vendor.o(($event) => notes.value = $event.detail.value),
        m: common_vendor.o(goBack),
        n: common_vendor.o(submitTask)
      };
    };
  }
};
wx.createPage(_sfc_main);
