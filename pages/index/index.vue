<template>
  <view class="container">
    <!-- 问候卡片 -->
    <view class="greeting-card glass-morphism animate-fade-in">
      <text class="greeting-title">{{ greeting }}</text>
      <text class="greeting-date">{{ currentDate }}</text>
      <view class="efficiency-section">
        <view class="efficiency-left">
          <text class="efficiency-label">今日效率评分</text>
          <view class="efficiency-score">
            <text class="score-value">{{ efficiencyScore }}</text>
            <view class="score-trend">
              <uni-icons
                v-if="scoreTrend > 0"
                type="arrow-up"
                size="14"
                color="#34d399"
              ></uni-icons>
              <uni-icons
                v-else-if="scoreTrend < 0"
                type="arrow-down"
                size="14"
                color="#ef4444"
              ></uni-icons>
              <text :class="scoreTrend > 0 ? 'trend-up' : 'trend-down'" v-if="scoreTrend !== 0">
                {{ scoreTrend > 0 ? "+" : "" }}{{ scoreTrend }}%
              </text>
            </view>
          </view>
        </view>
        <view class="efficiency-icon">
          <uni-icons type="bolt" size="24" color="#fbbf24"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="action-btn" @tap="addTask">
        <uni-icons type="plus" size="24" color="#4f46e5"></uni-icons>
        <text class="action-text">新建任务</text>
      </view>
      <!-- <view class="action-btn" @tap="startFocus">
        <uni-icons type="clock" size="24" color="#4f46e5"></uni-icons>
        <text class="action-text">开始专注</text>
      </view>
      <view class="action-btn" @tap="viewCalendar">
        <uni-icons type="calendar" size="24" color="#4f46e5"></uni-icons>
        <text class="action-text">查看日历</text>
      </view>
      <view class="action-btn" @tap="viewStats">
        <uni-icons type="chart" size="24" color="#4f46e5"></uni-icons>
        <text class="action-text">效率分析</text>
      </view> -->
    </view>

    <!-- 今日任务 -->
    <view class="card animate-slide-up">
      <view class="card-header">
        <text class="card-title">今日任务</text>
        <text class="task-progress">{{ completedTasks }}/{{ todayTasks.length }} 已完成</text>
      </view>
      <view class="task-list">
        <template v-if="todayTasks.length > 0">
          <view
            class="task-item"
            v-for="(task, index) in todayTasks"
            :key="index"
            @tap="toggleTask(task.id)"
          >
            <view
              :class="['task-checkbox', task.completed ? 'checked' : '']"
            >
              <uni-icons
                v-if="task.completed"
                type="checkmark"
                size="12"
                color="#ffffff"
              ></uni-icons>
            </view>
            <view class="task-content">
              <text
                :class="['task-title', task.completed ? 'completed' : '']"
                >{{ task.title }}</text
              >
              <text class="task-time" v-if="task.startTime && task.endTime"
                >{{ task.startTime }} - {{ task.endTime }}</text
              >
            </view>
            <view :class="['tag', `tag-${task.category || 'default'}`]">
              {{ task.category || "其他" }}
            </view>
          </view>
        </template>
        <view class="empty-tasks" v-else>
          <image
            class="empty-image"
            src="/static/images/empty-tasks.png"
            mode="aspectFit"
          ></image>
          <text class="empty-text">还没有待办任务哦</text>
          <button class="add-task-btn" @tap="addTask">添加任务</button>
        </view>
      </view>
    </view>

    <!-- 本周生产力 -->
    <view class="card productivity-card animate-slide-up">
      <view class="card-header">
        <text class="card-title">本周生产力</text>
        <text class="view-more" @tap="viewStats">查看详情</text>
      </view>
      <view class="productivity-chart">
        <view
          class="chart-column"
          v-for="(day, index) in weeklyProductivity"
          :key="index"
        >
          <view class="chart-bar" :style="{ height: `${day.value}%` }"></view>
          <text class="chart-label">{{ day.label }}</text>
        </view>
      </view>
    </view>

    <!-- AI建议 -->
    <view class="card-glass ai-card animate-slide-up" v-if="aiRecommendation">
      <view class="ai-content">
        <view class="ai-icon">
          <uni-icons type="info" size="20" color="#ffffff"></uni-icons>
        </view>
        <view class="ai-message">
          <text class="ai-title">AI助手建议</text>
          <text class="ai-text">{{ aiRecommendation }}</text>
          <view class="ai-actions">
            <button class="ai-btn ai-accept" @tap="acceptAiSuggestion">接受建议</button>
            <button class="ai-btn ai-ignore" @tap="ignoreAiSuggestion">忽略</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue"
import { onShow } from "@dcloudio/uni-app"

// 响应式状态
const greeting = ref("")
const currentDate = ref("")
const efficiencyScore = ref(92)
const scoreTrend = ref(5)
const todayTasks = ref([])
const completedTasks = computed(() => todayTasks.value.filter(t => t.completed).length)
const aiRecommendation = ref("")

// 本周生产力数据
const weeklyProductivity = ref([
  { label: "一", value: 60 },
  { label: "二", value: 80 },
  { label: "三", value: 45 },
  { label: "四", value: 70 },
  { label: "五", value: 90 },
  { label: "六", value: 30 },
  { label: "日", value: 20 },
])

// 生命周期钩子
onMounted(() => {
  setGreeting()
  setCurrentDate()
  loadTasks()
  generateAiRecommendation()
})

onShow(() => {
  loadTasks()
  updateEfficiencyScore()
})

// 方法
function setGreeting() {
  const now = new Date()
  const hours = now.getHours()
  let username = "时间管理大师"
  try {
    username = uni.getStorageSync("username") || username
  } catch (e) {
    console.error("获取用户名时出错:", e)
  }
  
  let greetingText = ""
  if (hours < 6) {
    greetingText = "凌晨好"
  } else if (hours < 11) {
    greetingText = "早上好"
  } else if (hours < 14) {
    greetingText = "中午好"
  } else if (hours < 18) {
    greetingText = "下午好"
  } else {
    greetingText = "晚上好"
  }
  
  greeting.value = `${greetingText}，${username}`
}

function setCurrentDate() {
  const now = new Date()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  const day = days[now.getDay()]
  
  currentDate.value = `今天是${day}，${month}月${date}日`
}

function loadTasks() {
  let tasks = []
  try {
    tasks = uni.getStorageSync("tasks") || []
  } catch (e) {
    console.error("获取任务时出错:", e)
  }
  
  const today = new Date().toISOString().split("T")[0]
  todayTasks.value = tasks.filter(
    task => task.date === today || (!task.date && !task.completed)
  ).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime)
    }
    
    if (a.startTime && !b.startTime) return -1
    if (!a.startTime && b.startTime) return 1
    
    return 0
  })
}

function toggleTask(taskId) {
  const task = todayTasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
    
    try {
      const allTasks = uni.getStorageSync("tasks") || []
      const taskIndex = allTasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        allTasks[taskIndex].completed = task.completed
        uni.setStorageSync("tasks", allTasks)
      }
      
      updateEfficiencyScore()
      
      if (task.completed) {
        uni.showToast({
          title: "太棒了，又完成一项任务！",
          icon: "none"
        })
      }
    } catch (e) {
      console.error("更新任务状态时出错:", e)
      uni.showToast({
        title: "保存任务状态失败",
        icon: "none"
      })
    }
  }
}

function updateEfficiencyScore() {
  const totalTasks = todayTasks.value.length
  if (totalTasks === 0) return
  
  const completed = completedTasks.value
  const completionRatio = completed / totalTasks
  
  const baseScore = Math.round(60 + completionRatio * 40)
  
  const randomFactor = Math.floor(Math.random() * 11) - 5
  
  const newScore = Math.min(100, Math.max(60, baseScore + randomFactor))
  
  const oldScore = efficiencyScore.value
  const trend = Math.round((newScore - oldScore) / oldScore * 100)
  
  efficiencyScore.value = newScore
  scoreTrend.value = trend
}

function generateAiRecommendation() {
  if (todayTasks.value.length > 0) {
    const incompleteTasks = todayTasks.value.filter(task => !task.completed)
    
    if (incompleteTasks.length > 0) {
      const highPriorityTasks = incompleteTasks.filter(task => 
        task.priority === "high" || task.priority === 2
      )
      
      if (highPriorityTasks.length > 0) {
        const task = highPriorityTasks[0]
        aiRecommendation.value = `建议优先完成"${task.title}"任务，这是今天的高优先级任务。`
      } else {
        const currentHour = new Date().getHours()
        
        if (currentHour < 12) {
          aiRecommendation.value = "早上精力充沛，建议先处理需要高度专注的任务。"
        } else if (currentHour < 15) {
          aiRecommendation.value = "午后容易犯困，建议安排一些相对轻松的任务，或进行短时间的休息。"
        } else {
          aiRecommendation.value = "下午是第二个高效时段，可以处理重要但不紧急的任务。"
        }
      }
    } else {
      aiRecommendation.value = "今天的任务已全部完成，建议制定明天的计划或进行一些自我提升的活动。"
    }
  } else {
    aiRecommendation.value = "暂无任务安排，建议添加今日计划以提高时间利用效率。"
  }
}

function acceptAiSuggestion() {
  uni.showToast({
    title: '已采纳建议',
    icon: 'success'
  })
  
  setTimeout(() => {
    aiRecommendation.value = ""
  }, 1000)
}

function ignoreAiSuggestion() {
  uni.showToast({
    title: '已忽略建议',
    icon: 'none'
  })
  
  aiRecommendation.value = ""
}

function addTask() {
  uni.navigateTo({
    url: "/pages/addTask/addTask"
  })
}

function startFocus() {
  uni.switchTab({
    url: "/pages/focus/focus"
  })
}

function viewCalendar() {
  uni.switchTab({
    url: "/pages/calendar/calendar"
  })
}

function viewStats() {
  uni.navigateTo({
    url: "/pages/analytics/analytics"
  })
}
</script>

<style scoped>
.container {
  padding: 30rpx;
  padding-top: 100rpx; 
  background-color: #f8fafc;
  min-height: 100vh;
}

/* 问候卡片 */
.greeting-card {
  background-image: linear-gradient(135deg, #4f46e5, #5e60ce);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 30rpx;
  position: relative;
  box-shadow: 0 10rpx 25rpx rgba(79, 70, 229, 0.2);
}

.glass-morphism {
  background-color: rgba(255, 255, 255, 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30rpx);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.greeting-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 12rpx;
}

.greeting-date {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

.efficiency-section {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.efficiency-left {
  flex: 1;
}

.efficiency-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8rpx;
}

.efficiency-score {
  display: flex;
  align-items: center;
}

.score-value {
  font-size: 60rpx;
  font-weight: bold;
  color: #ffffff;
  margin-right: 16rpx;
}

.score-trend {
  display: flex;
  align-items: center;
}

.trend-up {
  color: #34d399;
  font-size: 24rpx;
}

.trend-down {
  color: #ef4444;
  font-size: 24rpx;
}

.efficiency-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 快捷操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-btn {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.action-text {
  font-size: 24rpx;
  color: #4b5563;
  margin-top: 10rpx;
}

/* 卡片通用样式 */
.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-glass {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #111827;
}

.task-progress, .view-more {
  font-size: 26rpx;
  color: #4f46e5;
}

/* 任务列表 */
.task-list {
  margin-top: 20rpx;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
}

.task-item:last-child {
  border-bottom: none;
}

.task-checkbox {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 2rpx solid #4f46e5;
  margin-right: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.task-checkbox.checked {
  background-color: #4f46e5;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6rpx;
}

.task-title.completed {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-time {
  font-size: 24rpx;
  color: #6b7280;
}

.tag {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 100rpx;
  background-color: #e5e7eb;
  color: #4b5563;
}

/* .tag-工作 {
  background-color: #d1fae5;
  color: #065f46;
}

.tag-学习 {
  background-color: #e0e7ff;
  color: #3730a3;
}

.tag-生活 {
  background-color: #fef3c7;
  color: #92400e;
}

.tag-会议 {
  background-color: #dbeafe;
  color: #1e40af;
}

.tag-沟通 {
  background-color: #ffedd5;
  color: #9a3412;
}

.tag-重要 {
  background-color: #fee2e2;
  color: #b91c1c;
} */

.empty-tasks {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-image {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
  margin-bottom: 24rpx;
}

.add-task-btn {
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 28rpx;
  padding: 12rpx 30rpx;
  border-radius: 100rpx;
}

/* 生产力图表 */
.productivity-chart {
  height: 300rpx;
  display: flex;
  align-items: flex-end;
  padding: 20rpx 0;
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-bar {
  width: 20rpx;
  background-color: #4f46e5;
  border-radius: 10rpx 10rpx 0 0;
  margin-bottom: 10rpx;
}

.chart-label {
  font-size: 24rpx;
  color: #6b7280;
}

/* AI助手建议卡片 */
.ai-card {
  background-color: #f8fafc;
  border-left: 8rpx solid #4f46e5;
}

.ai-content {
  display: flex;
  align-items: flex-start;
}

.ai-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 32rpx;
  background-color: #4f46e5;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}

.ai-message {
  flex: 1;
}

.ai-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 10rpx;
}

.ai-text {
  font-size: 28rpx;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.ai-actions {
  display: flex;
}

.ai-btn {
  padding: 10rpx 30rpx;
  border-radius: 100rpx;
  font-size: 26rpx;
  margin-right: 20rpx;
}

.ai-accept {
  background-color: #4f46e5;
  color: #ffffff;
}

.ai-ignore {
  background-color: #f3f4f6;
  color: #4b5563;
}
</style>
