<template>
	<view class="container">
		<view class="task-list">
			<view 
				class="task-item" 
				v-for="task in tasks" 
				:key="task.id"
				@tap="selectTask(task)"
			>
				<view class="task-content">
					<text class="task-title">{{task.title}}</text>
					<text class="task-duration">{{task.duration}}分钟</text>
				</view>
				<uni-icons type="arrow-right" size="16" color="#999"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tasks: [],
				isSelectMode: false
			}
		},
		onLoad(options) {
			this.isSelectMode = options.mode === 'select'
			this.loadTasks()
		},
		methods: {
			loadTasks() {
				const tasks = uni.getStorageSync('tasks') || []
				this.tasks = tasks.filter(task => !task.completed)
			},
			selectTask(task) {
				if (this.isSelectMode) {
					uni.setStorageSync('selectedTask', task)
					uni.navigateBack()
				}
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
	
	.task-list {
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.task-item {
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.task-item:last-child {
		border-bottom: none;
	}
	
	.task-content {
		flex: 1;
	}
	
	.task-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 8rpx;
		display: block;
	}
	
	.task-duration {
		font-size: 24rpx;
		color: #666;
	}
</style> 