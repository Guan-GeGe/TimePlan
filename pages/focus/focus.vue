<template>
	<view class="container">
		
		<!-- 任务信息区 -->
		<view class="task-info" v-if="currentTask">
			<text class="task-title">{{currentTask.title}}</text>
			<text class="task-duration">预计 {{currentTask.duration}} 分钟</text>
		</view>
		<view class="task-info empty-state" v-else>
			<image class="empty-image" src="/static/images/empty-panda.png" mode="aspectFit"></image>
			<text class="task-title">未选择任务</text>
			<text class="select-task" @tap="selectTask">点击选择任务</text>
		</view>

		<!-- 倒计时区域 -->
		<view class="timer-section">
			<image 
				class="focus-image" 
				:src="isStarted ? '/static/images/focus-panda.png' : ''" 
				mode="aspectFit"
				v-if="currentTask && !isPaused"
			></image>
			<view class="timer-display">
				<text class="time">{{formatTime(remainingTime)}}</text>
			</view>
			
			<!-- 进度条 -->
			<view class="progress-bar">
				<view 
					class="progress" 
					:style="{width: `${(1 - remainingTime/totalTime) * 100}%`}"
				></view>
			</view>
		</view>

		<!-- 控制按钮区 -->
		<view class="control-section">
			<view 
				:class="['start-btn', isPaused ? 'paused' : '']"
				@tap="toggleTimer"
			>
				<view class="btn-inner"></view>
			</view>
		</view>

		<!-- 专注提示 -->
		<view class="focus-tip" v-if="isStarted">
			<text>专注中，请勿退出页面</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTask: null,
				isStarted: false,
				isPaused: false,
				remainingTime: 25 * 60, // 默认25分钟
				totalTime: 25 * 60,
				timer: null
			}
		},
		onLoad() {
			this.loadSelectedTask()
		},
		onShow() {
			this.loadSelectedTask()
		},
		onUnload() {
			this.clearTimer()
		},
		methods: {
			loadSelectedTask() {
				const task = uni.getStorageSync('selectedTask')
				if (task) {
					this.currentTask = task
					this.remainingTime = task.duration * 60
					this.totalTime = task.duration * 60
					uni.removeStorageSync('selectedTask') // 清除选中的任务
				}
			},
			goBack() {
				uni.navigateBack()
			},
			selectTask() {
				// 跳转到任务选择页面
				uni.navigateTo({
					url: '/pages/taskList/taskList?mode=select'
				})
			},
			formatTime(seconds) {
				const minutes = Math.floor(seconds / 60)
				const remainingSeconds = seconds % 60
				return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
			},
			toggleTimer() {
				if (!this.isStarted) {
					this.startTimer()
				} else {
					if (this.isPaused) {
						this.resumeTimer()
					} else {
						this.pauseTimer()
					}
				}
			},
			startTimer() {
				if (!this.currentTask) {
					uni.showToast({
						title: '请先选择任务',
						icon: 'none'
					})
					return
				}
				
				this.isStarted = true
				this.isPaused = false
				
				this.timer = setInterval(() => {
					if (this.remainingTime > 0) {
						this.remainingTime--
					} else {
						this.completeTimer()
					}
				}, 1000)
			},
			pauseTimer() {
				this.isPaused = true
				this.clearTimer()
			},
			resumeTimer() {
				this.isPaused = false
				this.timer = setInterval(() => {
					if (this.remainingTime > 0) {
						this.remainingTime--
					} else {
						this.completeTimer()
					}
				}, 1000)
			},
			resetTimer() {
				this.clearTimer()
				this.remainingTime = this.totalTime
				this.isStarted = false
			},
			stopTimer() {
				uni.showModal({
					title: '确认结束',
					content: '确定要结束当前专注吗？',
					success: (res) => {
						if (res.confirm) {
							this.clearTimer()
							this.isStarted = false
							this.remainingTime = this.totalTime
						}
					}
				})
			},
			completeTimer() {
				this.clearTimer()
				this.isStarted = false
				
				// 显示完成动画
				uni.showToast({
					title: '专注完成！',
					icon: 'none',
					image: '/static/images/celebrate-panda.png',
					duration: 2000
				})
				
				// 更新任务完成状态
				if (this.currentTask) {
					const tasks = uni.getStorageSync('tasks') || []
					const taskIndex = tasks.findIndex(t => t.id === this.currentTask.id)
					if (taskIndex !== -1) {
						tasks[taskIndex].completed = true
						uni.setStorageSync('tasks', tasks)
					}
				}
				
				// 更新专注时间统计
				const focusHistory = uni.getStorageSync('focusHistory') || []
				focusHistory.push({
					taskId: this.currentTask?.id,
					taskTitle: this.currentTask?.title,
					duration: this.totalTime / 60,
					completedAt: new Date()
				})
				uni.setStorageSync('focusHistory', focusHistory)
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null
				}
			}
		}
	}
</script>

<style>
	.container {
		padding: 40rpx;
		min-height: 100vh;
		background-color: #f8f9fa;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.task-info {
		text-align: center;
		margin-bottom: 60rpx;
	}
	
	.task-title {
		font-size: 36rpx;
		color: #333;
		font-weight: 500;
		display: block;
		margin-bottom: 10rpx;
	}
	
	.task-duration {
		font-size: 24rpx;
		color: #666;
	}
	
	.select-task {
		font-size: 28rpx;
		color: #4CAF50;
		margin-top: 20rpx;
		display: block;
	}
	
	.timer-section {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 80rpx;
	}
	
	.timer-display {
		position: relative;
		width: 400rpx;
		height: 400rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
		margin-bottom: 40rpx;
	}
	
	.time {
		font-size: 80rpx;
		color: #333;
		font-weight: 500;
		font-family: 'Arial Rounded MT Bold', sans-serif;
	}
	
	.progress-bar {
		width: 100%;
		height: 6rpx;
		background: #eee;
		border-radius: 3rpx;
		overflow: hidden;
	}
	
	.progress {
		height: 100%;
		background: #4CAF50;
		transition: width 1s linear;
	}
	
	.control-section {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 40rpx;
		margin-bottom: 60rpx;
	}
	
	.start-btn {
		width: 120rpx;
		height: 120rpx;
		border: 4rpx solid #4CAF50;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		transition: all 0.3s;
	}
	
	.btn-inner {
		width: 100%;
		height: 100%;
		background-color: #4CAF50;
		border-radius: 8rpx;
		transition: all 0.3s;
	}
	
	/* 暂停状态的样式 */
	.start-btn.paused .btn-inner {
		background-color: transparent;
	}
	
	.focus-tip {
		font-size: 24rpx;
		color: #666;
		text-align: center;
	}
	
	.empty-state {
		padding: 40rpx 0;
	}
	
	.empty-image {
		width: 300rpx;
		height: 300rpx;
		margin-bottom: 30rpx;
	}
	
	.focus-image {
		width: 400rpx;
		height: 400rpx;
		margin-bottom: 40rpx;
		transition: all 0.3s;
	}
</style> 