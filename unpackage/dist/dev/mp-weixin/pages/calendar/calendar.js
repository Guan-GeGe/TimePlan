"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
      currentMonth: (/* @__PURE__ */ new Date()).getMonth(),
      today: /* @__PURE__ */ new Date(),
      selectedDate: /* @__PURE__ */ new Date(),
      calendarDays: [],
      events: [
        {
          id: 1,
          title: "项目会议",
          date: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
          startTime: "09:00",
          endTime: "10:30",
          location: "会议室A",
          priority: 1,
          // 高优先级
          description: "讨论项目进度和下一步计划"
        },
        {
          id: 2,
          title: "学习新技能",
          date: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
          startTime: "14:00",
          endTime: "16:00",
          location: "",
          priority: 2,
          // 中优先级
          description: "学习新的编程语言"
        },
        {
          id: 3,
          title: "健身时间",
          date: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
          startTime: "18:30",
          endTime: "19:30",
          location: "健身房",
          priority: 3,
          // 低优先级
          description: "进行有氧运动和力量训练"
        }
      ]
    };
  },
  computed: {
    selectedDateFormatted() {
      const year = this.selectedDate.getFullYear();
      const month = this.selectedDate.getMonth() + 1;
      const day = this.selectedDate.getDate();
      const weekday = this.weekdays[this.selectedDate.getDay()];
      return `${year}年${month}月${day}日 星期${weekday}`;
    },
    selectedDayEvents() {
      return this.events.filter(
        (event) => this.isSameDay(event.date, this.selectedDate)
      ).sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
    }
  },
  mounted() {
    this.generateCalendar();
  },
  methods: {
    generateCalendar() {
      const year = this.currentYear;
      const month = this.currentMonth;
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDay.getDay();
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      const days = [];
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const date = new Date(year, month - 1, day);
        days.push({
          day,
          date,
          isCurrentMonth: false,
          isToday: this.isSameDay(date, this.today),
          isSelected: this.isSameDay(date, this.selectedDate),
          hasEvents: this.hasEvents(date),
          events: this.getEventsForDay(date)
        });
      }
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({
          day: i,
          date,
          isCurrentMonth: true,
          isToday: this.isSameDay(date, this.today),
          isSelected: this.isSameDay(date, this.selectedDate),
          hasEvents: this.hasEvents(date),
          events: this.getEventsForDay(date)
        });
      }
      const daysNeeded = 42 - days.length;
      for (let i = 1; i <= daysNeeded; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          day: i,
          date,
          isCurrentMonth: false,
          isToday: this.isSameDay(date, this.today),
          isSelected: this.isSameDay(date, this.selectedDate),
          hasEvents: this.hasEvents(date),
          events: this.getEventsForDay(date)
        });
      }
      this.calendarDays = days;
    },
    isSameDay(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    },
    hasEvents(date) {
      return this.events.some((event) => this.isSameDay(event.date, date));
    },
    getEventsForDay(date) {
      return this.events.filter((event) => this.isSameDay(event.date, date));
    },
    selectDay(day) {
      this.selectedDate = day.date;
      this.calendarDays = this.calendarDays.map((d) => ({
        ...d,
        isSelected: this.isSameDay(d.date, this.selectedDate)
      }));
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentYear--;
        this.currentMonth = 11;
      } else {
        this.currentMonth--;
      }
      this.generateCalendar();
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentYear++;
        this.currentMonth = 0;
      } else {
        this.currentMonth++;
      }
      this.generateCalendar();
    },
    showToday() {
      this.currentYear = this.today.getFullYear();
      this.currentMonth = this.today.getMonth();
      this.selectedDate = new Date(this.today);
      this.generateCalendar();
    },
    showAddEvent() {
      common_vendor.index.showToast({
        title: "添加事件功能开发中",
        icon: "none"
      });
    },
    viewEvent(event) {
      common_vendor.index.showToast({
        title: "查看事件详情功能开发中",
        icon: "none"
      });
    },
    formatTime(timeString) {
      return timeString;
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
    a: common_vendor.o((...args) => $options.showToday && $options.showToday(...args)),
    b: common_vendor.p({
      type: "plusempty",
      size: "20",
      color: "#4f46e5"
    }),
    c: common_vendor.o((...args) => $options.showAddEvent && $options.showAddEvent(...args)),
    d: common_vendor.p({
      type: "left",
      size: "20",
      color: "#6b7280"
    }),
    e: common_vendor.o((...args) => $options.prevMonth && $options.prevMonth(...args)),
    f: common_vendor.t($data.currentYear),
    g: common_vendor.t($data.currentMonth + 1),
    h: common_vendor.p({
      type: "right",
      size: "20",
      color: "#6b7280"
    }),
    i: common_vendor.o((...args) => $options.nextMonth && $options.nextMonth(...args)),
    j: common_vendor.f($data.weekdays, (day, index, i0) => {
      return {
        a: common_vendor.t(day),
        b: index
      };
    }),
    k: common_vendor.f($data.calendarDays, (day, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.day),
        b: day.hasEvents
      }, day.hasEvents ? {
        c: common_vendor.f(day.events.slice(0, 3), (event, eIndex, i1) => {
          return {
            a: eIndex,
            b: common_vendor.n(`priority-${event.priority}`)
          };
        })
      } : {}, {
        d: index,
        e: common_vendor.n(day.isCurrentMonth ? "" : "other-month"),
        f: common_vendor.n(day.isToday ? "today" : ""),
        g: common_vendor.n(day.isSelected ? "selected" : ""),
        h: common_vendor.n(day.hasEvents ? "has-events" : ""),
        i: common_vendor.o(($event) => $options.selectDay(day), index)
      });
    }),
    l: common_vendor.t($options.selectedDateFormatted),
    m: common_vendor.t($options.selectedDayEvents.length),
    n: $options.selectedDayEvents.length === 0
  }, $options.selectedDayEvents.length === 0 ? {
    o: common_assets._imports_0$1,
    p: common_vendor.o((...args) => $options.showAddEvent && $options.showAddEvent(...args))
  } : {}, {
    q: common_vendor.f($options.selectedDayEvents, (event, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($options.formatTime(event.startTime)),
        b: common_vendor.t($options.formatTime(event.endTime)),
        c: common_vendor.n(`priority-${event.priority}`),
        d: common_vendor.t(event.title),
        e: event.location
      }, event.location ? {
        f: "6791d6bf-3-" + i0,
        g: common_vendor.p({
          type: "location",
          size: "14",
          color: "#6b7280"
        }),
        h: common_vendor.t(event.location)
      } : {}, {
        i: "6791d6bf-4-" + i0,
        j: index,
        k: common_vendor.n(`priority-${event.priority}`),
        l: common_vendor.o(($event) => $options.viewEvent(event), index)
      });
    }),
    r: common_vendor.p({
      type: "right",
      size: "16",
      color: "#6b7280"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
