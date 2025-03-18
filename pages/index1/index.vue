<template>
	<view class="container">
		<!-- 顶部欢迎语 -->
		<view class="header">
			<text class="greeting">{{greeting}}</text>
			<text class="date">{{currentDate}}</text>
		</view>

		<!-- 树木养成区域 -->
		<view class="tree-section">
			<view class="tree-container">
				<view 
					class="tree" 
					:class="[`tree-level-${treeLevel}`, {'tree-celebrate': showCelebration}]"
				>
					<!-- 树干 -->
					<view class="tree-trunk"></view>
					<!-- 树叶 -->
					<view class="tree-leaves tree-leaves-1"></view>
					<view class="tree-leaves tree-leaves-2"></view>
					<view class="tree-leaves tree-leaves-3"></view>
					<!-- 装饰元素 -->
					<view class="tree-decorations">
						<view class="flower" v-if="treeLevel >= 3"></view>
						<view class="fruit" v-if="treeLevel >= 4"></view>
					</view>
				</view>
				<view class="tree-ground"></view>
			</view>
			<view class="level-info">
				<text class="level-text">成长等级 {{treeLevel}}</text>
				<view class="exp-bar">
					<view class="exp-progress" :style="{width: `${(currentExp/levelUpExp) * 100}%`}"></view>
				</view>
				<text class="exp-text">{{currentExp}}/{{levelUpExp}} 分钟</text>
			</view>
		</view>

		<!-- 今日概览卡片 -->
		<view class="overview-card">
			<view class="card-header">
				<image class="card-icon" src="/static/images/overview-icon.png" mode="aspectFit"></image>
				<text class="card-title">今日概览</text>
			</view>
			<view class="stats">
				<view class="stat-item">
					<image class="stat-icon" src="/static/images/complete-icon.png" mode="aspectFit"></image>
					<text class="number">{{completedTasks}}</text>
					<text class="label">已完成</text>
				</view>
				<view class="stat-item">
					<image class="stat-icon" src="/static/images/time-icon.png" mode="aspectFit"></image>
					<text class="number">{{focusTime}}</text>
					<text class="label">专注时间</text>
				</view>
			</view>
		</view>

		<!-- 快捷功能区 -->
		<view class="quick-actions">
			<view class="action-item" @tap="startFocus">
				<uni-icons type="calendar" size="30" color="#4CAF50"></uni-icons>
				<text>开始专注</text>
			</view>
			<view class="action-item" @tap="addTask">
				<uni-icons type="plus" size="30" color="#4CAF50"></uni-icons>
				<text>添加任务</text>
			</view>
			<view class="action-item" @tap="viewStats">
				<uni-icons type="bars" size="30" color="#4CAF50"></uni-icons>
				<text>数据统计</text>
			</view>
		</view>

		<!-- 今日待办列表 -->
		<view class="todo-section">
			<view class="card-header">
				<image class="card-icon" src="/static/images/task-icon.png" mode="aspectFit"></image>
				<text>今日待办</text>
				<text class="more" @tap="viewAllTasks">查看全部</text>
			</view>
			<view class="todo-list">
				<template v-if="todayTasks.length > 0">
					<view class="todo-item" v-for="item in todayTasks" :key="item.id">
						<checkbox :checked="item.completed" @tap="toggleTask(item.id)"/>
						<text :class="{'completed': item.completed}">{{item.title}}</text>
					</view>
				</template>
				<view class="empty-tasks" v-else>
					<image class="empty-image" src="/static/images/empty-tasks.png" mode="aspectFit"></image>
					<text>还没有待办任务哦</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			greeting: '下午好，今天也要加油哦',
			currentDate: '',
			completedTasks: 0,
			focusTime: '0h',
			todayTasks: [],
			// 树木养成系统数据
			treeLevel: 1,
			currentExp: 0,
			levelUpExp: 60, // 每60分钟升一级
			showCelebration: false,
			totalFocusMinutes: 0
		}
	},
	onLoad() {
		this.setGreeting()
		this.setCurrentDate()
		this.loadTasks()
		this.loadTreeData()
	},
	onShow() {
		this.loadTasks()
	},
	methods: {
		setGreeting() {
			const hour = new Date().getHours()
			let greeting = ''
			if (hour < 6) {
				greeting = '凌晨好'
			} else if (hour < 11) {
				greeting = '早上好'
			} else if (hour < 14) {
				greeting = '中午好'
			} else if (hour < 18) {
				greeting = '下午好'
			} else {
				greeting = '晚上好'
			}
			this.greeting = `${greeting}，今天也要加油哦`
		},
		setCurrentDate() {
			const date = new Date()
			const year = date.getFullYear()
			const month = date.getMonth() + 1
			const day = date.getDate()
			const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
			this.currentDate = `${year}年${month}月${day}日 星期${weekDay}`
		},
		toggleTask(taskId) {
			const task = this.todayTasks.find(t => t.id === taskId)
			task.completed = !task.completed
			this.completedTasks = this.todayTasks.filter(t => t.completed).length
		},
		startFocus() {
			uni.navigateTo({
				url: '/pages/focus/focus'
			})
		},
		addTask() {
			uni.navigateTo({
				url: '/pages/addTask/addTask'
			})
		},
		viewStats() {
			uni.navigateTo({
				url: '/pages/statistics/statistics'
			})
		},
		viewAllTasks() {
			uni.navigateTo({
				url: '/pages/taskList/taskList'
			})
		},
		loadTasks() {
			const tasks = uni.getStorageSync('tasks') || []
			const today = new Date().setHours(0, 0, 0, 0)
			this.todayTasks = tasks.filter(task => {
				const taskDate = new Date(task.createTime).setHours(0, 0, 0, 0)
				return taskDate === today
			})
			this.completedTasks = this.todayTasks.filter(t => t.completed).length
		},
		loadTreeData() {
			const treeData = uni.getStorageSync('treeData') || {
				level: 1,
				exp: 0,
				totalMinutes: 0
			}
			this.treeLevel = treeData.level
			this.currentExp = treeData.exp
			this.totalFocusMinutes = treeData.totalMinutes
		},
		updateTreeExp(minutes) {
			this.currentExp += minutes
			this.totalFocusMinutes += minutes
			
			while (this.currentExp >= this.levelUpExp) {
				this.currentExp -= this.levelUpExp
				this.treeLevel++
				this.showCelebration = true
				
				uni.showToast({
					title: `树木长大啦！现在 ${this.treeLevel} 级`,
					icon: 'none',
					duration: 2000
				})
				
				setTimeout(() => {
					this.showCelebration = false
				}, 2000)
			}
			
			uni.setStorageSync('treeData', {
				level: this.treeLevel,
				exp: this.currentExp,
				totalMinutes: this.totalFocusMinutes
			})
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

	.header {
		margin-bottom: 40rpx;
	}

	.greeting {
		font-size: 40rpx;
		font-weight: 600;
		color: #333;
		display: block;
	}

	.date {
		font-size: 28rpx;
		color: #666;
		margin-top: 10rpx;
		display: block;
	}

	.overview-card {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.card-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.card-title {
		font-size: 32rpx;
		color: #333;
	}

	.stats {
		display: flex;
		justify-content: space-around;
	}

	.stat-item {
		text-align: center;
	}

	.number {
		font-size: 48rpx;
		font-weight: 600;
		color: #4CAF50;
		display: block;
	}

	.label {
		font-size: 24rpx;
		color: #666;
		margin-top: 10rpx;
	}

	.quick-actions {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.action-item {
		background: white;
		border-radius: 16rpx;
		padding: 20rpx;
		text-align: center;
		width: 30%;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.action-item text {
		font-size: 24rpx;
		color: #333;
		margin-top: 10rpx;
	}

	.todo-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.more {
		font-size: 24rpx;
		color: #4CAF50;
	}

	.todo-list {
		padding: 20rpx 0;
	}

	.todo-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.todo-item:last-child {
		border-bottom: none;
	}

	.todo-item text {
		margin-left: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.completed {
		text-decoration: line-through;
		color: #999 !important;
	}

	.tree-section {
		width: 100%;
		margin-bottom: 40rpx;
	}

	.tree-container {
		position: relative;
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tree {
		width: 300rpx;
		height: 400rpx;
		position: relative;
		transition: all 0.5s ease;
	}

	.tree-trunk {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 120rpx;
		background: linear-gradient(to right, #8B4513, #A0522D);
		border-radius: 8rpx;
		transition: all 0.5s ease;
	}

	.tree-leaves {
		position: absolute;
		border-radius: 50%;
		background: #4CAF50;
		transition: all 0.5s ease;
	}

	.tree-leaves-1 {
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 160rpx;
		height: 160rpx;
	}

	.tree-leaves-2 {
		bottom: 180rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 120rpx;
		height: 120rpx;
	}

	.tree-leaves-3 {
		bottom: 240rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 80rpx;
		height: 80rpx;
	}

	/* 树的等级样式 */
	.tree-level-1 {
		transform: scale(0.8);
	}

	.tree-level-2 {
		transform: scale(0.9);
	}

	.tree-level-3 {
		transform: scale(1);
	}

	.tree-level-4 {
		transform: scale(1.1);
	}

	.tree-level-5 {
		transform: scale(1.2);
	}

	/* 树叶颜色随等级变化 */
	.tree-level-2 .tree-leaves {
		background: linear-gradient(45deg, #4CAF50, #81C784);
	}

	.tree-level-3 .tree-leaves {
		background: linear-gradient(45deg, #2E7D32, #4CAF50);
	}

	.tree-level-4 .tree-leaves {
		background: linear-gradient(45deg, #1B5E20, #2E7D32);
	}

	.tree-level-5 .tree-leaves {
		background: linear-gradient(45deg, #1B5E20, #388E3C);
		filter: brightness(1.2);
	}

	/* 装饰元素 */
	.flower {
		position: absolute;
		width: 20rpx;
		height: 20rpx;
		background: #FFC0CB;
		border-radius: 50%;
		animation: float 2s ease-in-out infinite;
	}

	.fruit {
		position: absolute;
		width: 24rpx;
		height: 24rpx;
		background: #FF5722;
		border-radius: 50%;
		animation: swing 3s ease-in-out infinite;
	}

	/* 庆祝动画 */
	.tree-celebrate {
		animation: celebrate 0.5s ease infinite;
	}

	@keyframes celebrate {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10rpx); }
	}

	@keyframes float {
		0%, 100% { transform: translate(0, 0); }
		50% { transform: translate(5rpx, -5rpx); }
	}

	@keyframes swing {
		0%, 100% { transform: rotate(0deg); }
		50% { transform: rotate(15deg); }
	}

	.tree-ground {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 60rpx;
		background: linear-gradient(transparent, rgba(76, 175, 80, 0.1));
		border-radius: 50%;
	}

	.level-info {
		text-align: center;
		margin-top: 20rpx;
	}

	.level-text {
		font-size: 32rpx;
		color: #4CAF50;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.exp-bar {
		width: 80%;
		height: 20rpx;
		background: #f0f0f0;
		border-radius: 10rpx;
		margin: 10rpx auto;
		overflow: hidden;
	}

	.exp-progress {
		height: 100%;
		background: linear-gradient(90deg, #4CAF50, #8BC34A);
		transition: width 0.3s ease;
	}

	.exp-text {
		font-size: 24rpx;
		color: #666;
	}

	.empty-tasks {
		text-align: center;
		padding: 40rpx 0;
	}

	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.stat-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}
</style>
