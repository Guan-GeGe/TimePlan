<template>
  <view class="container">
    <view class="header">
      <text class="header-title">专注计时器</text>
    </view>

    <!-- 模式选择器 -->
    <view class="mode-selector">
      <view
        :class="['mode-btn', focusMode === 'pomodoro' ? 'active' : '']"
        @tap="changeMode('pomodoro')"
      >
        <text>番茄钟</text>
      </view>
      <view
        :class="['mode-btn', focusMode === 'timer' ? 'active' : '']"
        @tap="changeMode('timer')"
      >
        <text>计时器</text>
      </view>
      <view
        :class="['mode-btn', focusMode === 'stopwatch' ? 'active' : '']"
        @tap="changeMode('stopwatch')"
      >
        <text>秒表</text>
      </view>
    </view>

    <!-- 任务选择 -->
    <view class="task-selector" v-if="focusMode !== 'stopwatch'">
      <view class="selector-wrapper" @tap="selectTask">
        <text class="selector-text">{{
          currentTask ? currentTask.title : "选择要专注的任务..."
        }}</text>
        <uni-icons type="arrow-down" size="14" color="#6b7280"></uni-icons>
      </view>
    </view>

    <!-- 计时器 -->
    <view class="timer-container">
      <view class="timer-circle" :style="timerCircleStyle">
        <view class="timer-inner-circle"></view>
        <text class="timer-display">{{ formatTime(remainingTime) }}</text>
      </view>
      <text class="timer-label">{{ timerLabel }}</text>
    </view>

    <!-- 控制按钮 -->
    <view class="timer-controls">
      <view class="timer-btn" @tap="resetTimer">
        <uni-icons type="refresh" size="24" color="#4f46e5"></uni-icons>
      </view>
      <view class="timer-btn primary" @tap="toggleTimer">
        <uni-icons
          :type="isStarted && !isPaused ? 'pause' : 'play'"
          size="28"
          color="#ffffff"
        ></uni-icons>
      </view>
      <view class="timer-btn" @tap="stopTimer">
        <uni-icons type="close" size="24" color="#4f46e5"></uni-icons>
      </view>
    </view>

    <!-- 专注统计 -->
    <view class="stats-container">
      <view class="stat-card">
        <text class="stat-value">{{ todayFocusCount }}</text>
        <text class="stat-label">今日专注</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ todayFocusMinutes }}</text>
        <text class="stat-label">专注分钟</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ completedTasks }}</text>
        <text class="stat-label">完成任务</text>
      </view>
    </view>

    <!-- 历史记录 -->
    <view class="card history-container" v-if="focusHistory.length > 0">
      <view class="card-header">
        <text class="card-title">最近专注</text>
        <text class="view-more" @tap="viewAllHistory">查看全部</text>
      </view>
      <view class="history-list">
        <view
          class="history-item"
          v-for="(item, index) in recentHistory"
          :key="index"
        >
          <view class="history-content">
            <text class="history-task">{{
              item.taskTitle || "未命名任务"
            }}</text>
            <text class="history-time"
              >{{ formatHistoryTime(item.completedAt) }} ·
              {{ item.duration }}分钟</text
            >
          </view>
          <view :class="['history-tag', `tag-${item.category || 'default'}`]">
            {{ item.category || "专注" }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

import { onShow } from "@dcloudio/uni-app"
// 状态变量
const focusMode = ref("pomodoro") // pomodoro, timer, stopwatch
const currentTask = ref(null)
const isStarted = ref(false)
const isPaused = ref(false)
const remainingTime = ref(25 * 60) // 默认25分钟
const totalTime = ref(25 * 60)
const timer = ref(null)

// 统计数据
const todayFocusCount = ref(0)
const todayFocusMinutes = ref(0)
const completedTasks = ref(0)
const focusHistory = ref([])

// 模式时间设置
const pomodoroTime = 25 * 60
const timerTime = 45 * 60
const progress = ref(0) // 进度百分比 0-100

// 计算属性
const timerCircleStyle = computed(() => {
  const progressValue = isStarted.value
    ? (1 - remainingTime.value / totalTime.value) * 100
    : 0
  return {
    background: `conic-gradient(#4f46e5 ${progressValue}%, transparent ${progressValue}%)`,
  }
})

const timerLabel = computed(() => {
  if (focusMode.value === "pomodoro") return "专注时间"
  if (focusMode.value === "timer") return "计时器"
  return "秒表"
})

const recentHistory = computed(() => {
  return focusHistory.value.slice(0, 3) // 只显示最近3条
})

// 生命周期钩子
onMounted(() => {
  // 相当于 onLoad
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.$page?.options || {}

  if (options.mode === "select") {
    // 如果是从任务选择页面返回
    loadSelectedTask()
  }
  loadFocusHistory()
  calculateStats()
})

onShow(() => {
  loadSelectedTask()
})

onUnmounted(() => {
  clearTimer()
})

// 方法
function loadSelectedTask() {
  const task = uni.getStorageSync("selectedTask")
  if (task) {
    currentTask.value = task
    uni.removeStorageSync("selectedTask") // 清除选中的任务
  }
}

function changeMode(mode) {
  if (isStarted.value) {
    uni.showToast({
      title: "请先停止当前计时",
      icon: "none",
    })
    return
  }

  focusMode.value = mode

  // 根据模式设置时间
  if (mode === "pomodoro") {
    remainingTime.value = pomodoroTime
    totalTime.value = pomodoroTime
  } else if (mode === "timer") {
    remainingTime.value = timerTime
    totalTime.value = timerTime
  } else {
    // 秒表模式从0开始计时
    remainingTime.value = 0
    totalTime.value = 0
  }
}

function selectTask() {
  if (isStarted.value) {
    uni.showToast({
      title: "请先停止当前计时",
      icon: "none",
    })
    return
  }

  // 跳转到任务选择页面
  uni.navigateTo({
    url: "/pages/taskList/taskList?mode=select",
  })
}

function formatTime(seconds) {
  const minutes = Math.floor(Math.abs(seconds) / 60)
  const remainingSeconds = Math.abs(seconds) % 60
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`
}

function formatHistoryTime(dateStr) {
  const date = new Date(dateStr)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

function toggleTimer() {
  if (focusMode.value !== "stopwatch" && !currentTask.value) {
    uni.showToast({
      title: "请先选择任务",
      icon: "none",
    })
    return
  }

  if (!isStarted.value) {
    startTimer()
  } else if (isPaused.value) {
    resumeTimer()
  } else {
    pauseTimer()
  }
}

function startTimer() {
  isStarted.value = true
  isPaused.value = false

  // 清除可能存在的计时器
  if (timer.value) {
    clearInterval(timer.value)
  }

  // 根据模式设置计时器行为
  if (focusMode.value === "stopwatch") {
    // 秒表模式向上计时
    timer.value = setInterval(() => {
      remainingTime.value++

      // 保存计时状态到本地
      uni.setStorageSync("timerState", {
        mode: focusMode.value,
        remaining: remainingTime.value,
        total: totalTime.value,
        isStarted: isStarted.value,
        isPaused: isPaused.value,
        startTime: Date.now(),
      })
    }, 1000)
  } else {
    // 番茄钟和计时器向下计时
    timer.value = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--

        // 保存计时状态到本地
        uni.setStorageSync("timerState", {
          mode: focusMode.value,
          remaining: remainingTime.value,
          total: totalTime.value,
          isStarted: isStarted.value,
          isPaused: isPaused.value,
          startTime: Date.now(),
        })

        // 如果倒计时结束
        if (remainingTime.value === 0) {
          completeTimer()
        }
      }
    }, 1000)
  }
}

function pauseTimer() {
  isPaused.value = true
  clearInterval(timer.value)
}

function resumeTimer() {
  isPaused.value = false

  if (focusMode.value === "stopwatch") {
    // 秒表模式向上计时
    timer.value = setInterval(() => {
      remainingTime.value++

      // 保存计时状态到本地
      uni.setStorageSync("timerState", {
        mode: focusMode.value,
        remaining: remainingTime.value,
        total: totalTime.value,
        isStarted: isStarted.value,
        isPaused: isPaused.value,
        startTime: Date.now(),
      })
    }, 1000)
  } else {
    // 番茄钟和计时器向下计时
    timer.value = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--

        // 保存计时状态到本地
        uni.setStorageSync("timerState", {
          mode: focusMode.value,
          remaining: remainingTime.value,
          total: totalTime.value,
          isStarted: isStarted.value,
          isPaused: isPaused.value,
          startTime: Date.now(),
        })

        // 如果倒计时结束
        if (remainingTime.value === 0) {
          completeTimer()
        }
      }
    }, 1000)
  }
}

function resetTimer() {
  // 停止计时器
  clearInterval(timer.value)

  // 重置状态
  isStarted.value = false
  isPaused.value = false

  // 清除本地存储的计时状态
  uni.removeStorageSync("timerState")

  // 根据当前模式重置时间
  if (focusMode.value === "pomodoro") {
    remainingTime.value = pomodoroTime
    totalTime.value = pomodoroTime
  } else if (focusMode.value === "timer") {
    remainingTime.value = timerTime
    totalTime.value = timerTime
  } else {
    // 秒表模式重置为0
    remainingTime.value = 0
    totalTime.value = 0
  }

  // 如果用户手动重置，不保存记录
  if (isStarted.value) {
    uni.showToast({
      title: "计时已重置",
      icon: "none",
    })
  }

  // 允许重新选择任务
  if (focusMode.value !== "stopwatch") {
    // 可选：清除当前任务
    // currentTask.value = null;
  }
}

function stopTimer() {
  // 如果计时器未启动，不做任何处理
  if (!isStarted.value) {
    return
  }

  // 如果是番茄钟或计时器模式，且已经开始但未完成
  if (focusMode.value !== "stopwatch" && remainingTime.value > 0) {
    // 显示确认对话框
    uni.showModal({
      title: "确认停止",
      content: "确定要停止当前计时吗？您的进度将不会被保存。",
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定

          // 停止计时器
          clearInterval(timer.value)

          // 重置状态
          isStarted.value = false
          isPaused.value = false

          // 清除本地存储的计时状态
          uni.removeStorageSync("timerState")

          // 根据当前模式重置时间
          if (focusMode.value === "pomodoro") {
            remainingTime.value = pomodoroTime
            totalTime.value = pomodoroTime
          } else if (focusMode.value === "timer") {
            remainingTime.value = timerTime
            totalTime.value = timerTime
          }

          uni.showToast({
            title: "计时已停止",
            icon: "none",
          })
        }
      },
    })
  } else if (focusMode.value === "stopwatch") {
    // 秒表模式直接保存记录
    saveFocusRecord()

    // 停止计时器
    clearInterval(timer.value)

    // 重置状态
    isStarted.value = false
    isPaused.value = false

    // 重置时间
    remainingTime.value = 0
    totalTime.value = 0

    // 清除本地存储的计时状态
    uni.removeStorageSync("timerState")

    uni.showToast({
      title: "记录已保存",
      icon: "success",
    })
  }
}

function completeTimer() {
  // 停止计时器
  clearInterval(timer.value)

  // 播放提示音
  const innerAudioContext = uni.createInnerAudioContext()
  innerAudioContext.src = "/static/audio/complete.mp3"
  innerAudioContext.play()

  // 震动提醒
  uni.vibrateShort({
    success: function () {
      console.log("震动成功")
    },
  })

  // 保存记录
  saveFocusRecord()

  // 重置状态
  isStarted.value = false
  isPaused.value = false

  // 清除本地存储的计时状态
  uni.removeStorageSync("timerState")

  // 根据当前模式重置时间
  if (focusMode.value === "pomodoro") {
    remainingTime.value = pomodoroTime
    totalTime.value = pomodoroTime
  } else if (focusMode.value === "timer") {
    remainingTime.value = timerTime
    totalTime.value = timerTime
  }

  // 显示完成提示
  uni.showToast({
    title: "专注时间完成！",
    icon: "success",
  })
}

function saveFocusRecord() {
  // 创建记录对象
  let record = {
    id: Date.now().toString(),
    mode: focusMode.value,
    completedAt: new Date().toISOString(),
    duration: 0, // 实际专注分钟数
  }

  // 根据不同模式计算持续时间
  if (focusMode.value === "stopwatch") {
    // 秒表模式直接用累计时间
    record.duration = Math.round(remainingTime.value / 60)
  } else {
    // 番茄钟和计时器用已经消耗的时间
    record.duration = Math.round((totalTime.value - remainingTime.value) / 60)
  }

  // 如果有关联任务，记录任务信息
  if (currentTask.value) {
    record.taskId = currentTask.value.id
    record.taskTitle = currentTask.value.title
    record.category = currentTask.value.category
  }

  // 获取现有历史记录
  let history = uni.getStorageSync("focusHistory") || []

  // 添加新记录
  history.unshift(record)

  // 更新本地存储
  uni.setStorageSync("focusHistory", history)

  // 更新状态
  focusHistory.value = history

  // 更新统计数据
  calculateStats()

  // 更新任务完成情况（如果有关联任务）
  if (currentTask.value) {
    // 获取任务列表
    let tasks = uni.getStorageSync("tasks") || []

    // 查找并更新任务
    const taskIndex = tasks.findIndex(
      (task) => task.id === currentTask.value.id
    )
    if (taskIndex !== -1) {
      // 更新任务完成时长
      tasks[taskIndex].completedMinutes =
        (tasks[taskIndex].completedMinutes || 0) + record.duration

      // 如果完成时长超过计划时长，标记为完成
      if (
        tasks[taskIndex].completedMinutes >= tasks[taskIndex].plannedMinutes
      ) {
        tasks[taskIndex].completed = true
        tasks[taskIndex].completedAt = new Date().toISOString()
      }

      // 更新任务列表
      uni.setStorageSync("tasks", tasks)
    }
  }

  // 更新树木生长
  updateTreeGrowth(record.duration)
}

function updateTreeGrowth(minutes) {
  // 获取当前树木状态
  let tree = uni.getStorageSync("growingTree") || {
    level: 1,
    experience: 0,
    totalMinutes: 0,
    nextLevelExp: 60, // 初始下一级所需经验
  }

  // 更新总专注分钟数
  tree.totalMinutes += minutes

  // 添加经验值（1分钟 = 1经验）
  tree.experience += minutes

  // 检查是否升级
  while (tree.experience >= tree.nextLevelExp) {
    // 升级
    tree.level += 1
    tree.experience -= tree.nextLevelExp

    // 下一级所需经验值增加 (简单公式：下一级 = 当前级 * 1.5)
    tree.nextLevelExp = Math.round(tree.nextLevelExp * 1.5)

    // 显示升级提示
    uni.showToast({
      title: `树木升级到 Lv.${tree.level}！`,
      icon: "success",
      duration: 2000,
    })
  }

  // 保存树木状态
  uni.setStorageSync("growingTree", tree)
}

function loadFocusHistory() {
  focusHistory.value = uni.getStorageSync("focusHistory") || []
}

function calculateStats() {
  // 获取今天的日期（格式为 YYYY-MM-DD）
  const today = new Date().toISOString().split("T")[0]

  // 今日专注次数和时间
  todayFocusCount.value = 0
  todayFocusMinutes.value = 0

  // 遍历历史记录
  focusHistory.value.forEach((record) => {
    // 检查是否是今天的记录
    const recordDate = new Date(record.completedAt).toISOString().split("T")[0]
    if (recordDate === today) {
      todayFocusCount.value++
      todayFocusMinutes.value += record.duration
    }
  })

  // 计算完成的任务数量
  const tasks = uni.getStorageSync("tasks") || []
  completedTasks.value = tasks.filter((task) => task.completed).length
}

function viewAllHistory() {
  uni.navigateTo({
    url: "/pages/focusHistory/focusHistory",
  })
}

function clearTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}
</script>

<style>
.container {
  padding: 0 16px;
  padding-bottom: 83px;
}

.header {
  padding: 16px 0;
  text-align: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.timer-circle {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 30px;
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.2);
}

.timer-inner-circle {
  position: absolute;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

.timer-display {
  position: relative;
  z-index: 2;
  font-size: 56px;
  font-weight: 700;
  color: #4f46e5;
  font-variant-numeric: tabular-nums;
}

.timer-label {
  font-size: 16px;
  margin-top: 8px;
  color: #6b7280;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 30px;
}

.timer-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  color: #4f46e5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timer-btn.primary {
  background-color: #4f46e5;
  color: white;
  width: 70px;
  height: 70px;
}

.timer-btn:active {
  transform: scale(0.95);
}

.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 4px;
  width: fit-content;
  margin: 0 auto 30px;
}

.mode-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.mode-btn.active {
  background-color: #4f46e5;
  color: white;
}

.task-selector {
  width: 100%;
  max-width: 320px;
  margin: 0 auto 20px;
}

.selector-wrapper {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selector-text {
  font-size: 16px;
  color: #374151;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #4f46e5;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.history-container {
  margin-top: 30px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.view-more {
  color: #4f46e5;
  font-size: 14px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.history-item:last-child {
  border-bottom: none;
}

.history-content {
  display: flex;
  flex-direction: column;
}

.history-task {
  font-weight: 600;
  color: #374151;
}

.history-time {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.history-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  background-color: #e5e7eb;
  color: #374151;
}

.tag-work {
  background-color: #dbeafe;
  color: #1e40af;
}

.tag-study {
  background-color: #dcfce7;
  color: #166534;
}

.tag-life {
  background-color: #fef3c7;
  color: #92400e;
}
</style>
