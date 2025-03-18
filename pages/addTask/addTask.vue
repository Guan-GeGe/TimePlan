<template>
	<view class="container">
		<view class="form-group">
			<text class="label">任务名称</text>
			<input class="input" v-model="taskTitle" placeholder="请输入任务名称" />
		</view>
		
		<view class="form-group">
			<text class="label">预计时长</text>
			<view class="duration-picker">
				<view class="time-input">
					<input type="number" v-model="duration" class="input" />
					<text class="unit">分钟</text>
				</view>
				<view class="quick-times">
					<text 
						v-for="time in quickTimes" 
						:key="time"
						:class="['time-tag', duration === time ? 'active' : '']"
						@tap="selectDuration(time)"
					>{{time}}分钟</text>
				</view>
			</view>
		</view>
		
		<view class="form-group">
			<text class="label">任务优先级</text>
			<view class="priority-group">
				<view 
					v-for="(item, index) in priorities" 
					:key="index"
					:class="['priority-item', selectedPriority === index ? 'active' : '']"
					@tap="selectPriority(index)"
				>
					<text>{{item.label}}</text>
				</view>
			</view>
		</view>

		<button class="submit-btn" @tap="submitTask">添加任务</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskTitle: '',
				duration: 25,
				quickTimes: [15, 25, 30, 45, 60],
				selectedPriority: 1,
				priorities: [
					{ label: '低优先级' },
					{ label: '中优先级' },
					{ label: '高优先级' }
				]
			}
		},
		methods: {
			selectDuration(time) {
				this.duration = time
			},
			selectPriority(index) {
				this.selectedPriority = index
			},
			submitTask() {
				if (!this.taskTitle.trim()) {
					uni.showToast({
						title: '请输入任务名称',
						icon: 'none'
					})
					return
				}
				
				const newTask = {
					id: Date.now(), // 临时使用时间戳作为ID
					title: this.taskTitle,
					duration: this.duration,
					priority: this.selectedPriority,
					completed: false,
					createTime: new Date()
				}
				
				// 这里可以调用父页面的方法来添加任务
				// 临时存储到本地
				const tasks = uni.getStorageSync('tasks') || []
				tasks.push(newTask)
				uni.setStorageSync('tasks', tasks)
				
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
		background-color: #f8f9fa;
		min-height: 100vh;
	}
	
	.form-group {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}
	
	.label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}
	
	.input {
		width: 100%;
		height: 80rpx;
		border: 2rpx solid #eee;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}
	
	.duration-picker {
		margin-top: 20rpx;
	}
	
	.time-input {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.unit {
		margin-left: 20rpx;
		color: #666;
		font-size: 28rpx;
		width: 100rpx;
	}
	
	.quick-times {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}
	
	.time-tag {
		padding: 12rpx 0;
		width: 18%;
		text-align: center;
		background: #f5f5f5;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #666;
	}
	
	.time-tag.active {
		background: #4CAF50;
		color: #fff;
	}
	
	.priority-group {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}
	
	.priority-item {
		flex: 1;
		margin: 0 10rpx;
		height: 80rpx;
		border-radius: 8rpx;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #666;
	}
	
	.priority-item.active {
		background: #4CAF50;
		color: #fff;
	}
	
	.priority-item text {
		margin-left: 10rpx;
	}
	
	.submit-btn {
		position: fixed;
		bottom: 40rpx;
		left: 30rpx;
		right: 30rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #4CAF50;
		color: #fff;
		border-radius: 45rpx;
		font-size: 32rpx;
	}
</style> 