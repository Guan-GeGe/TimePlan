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
  __name: "analytics",
  setup(__props) {
    const periods = common_vendor.ref(["本周", "本月", "本季度", "本年"]);
    const selectedPeriod = common_vendor.ref("本周");
    function selectPeriod(period) {
      selectedPeriod.value = period;
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(periods.value, (period, index, i0) => {
          return {
            a: common_vendor.t(period),
            b: index,
            c: common_vendor.n(selectedPeriod.value === period ? "active" : ""),
            d: common_vendor.o(($event) => selectPeriod(period), index)
          };
        }),
        b: common_vendor.p({
          type: "info",
          size: "16",
          color: "#4f46e5"
        }),
        c: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#FFFFFF"
        }),
        d: common_vendor.p({
          type: "flag",
          size: "16",
          color: "#FFFFFF"
        }),
        e: common_vendor.p({
          type: "checkmarkempty",
          size: "16",
          color: "#FFFFFF"
        }),
        f: common_vendor.p({
          type: "refreshempty",
          size: "16",
          color: "#FFFFFF"
        }),
        g: common_vendor.p({
          type: "flag",
          size: "20",
          color: "#4f46e5"
        }),
        h: common_vendor.p({
          type: "calendar",
          size: "20",
          color: "#4f46e5"
        }),
        i: common_vendor.p({
          type: "refreshempty",
          size: "20",
          color: "#4f46e5"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
