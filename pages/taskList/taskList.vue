<template>
	<view class="container">
		<view class="header">
			<text class="header-title">{{ isSelectMode ? '选择任务' : '任务列表' }}</text>
			<view class="header-actions" v-if="!isSelectMode">
				<view class="filter-btn" @tap="showFilterOptions">
					<uni-icons type="filter" size="20" color="#4f46e5"></uni-icons>
				</view>
				<view class="add-btn" @tap="goToAddTask">
					<uni-icons type="plusempty" size="20" color="#4f46e5"></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 筛选选项 -->
		<view class="filter-options" v-if="showFilters">
			<view class="filter-section">
				<text class="filter-title">状态</text>
				<view class="filter-tags">
					<text 
						:class="['filter-tag', statusFilter === 'all' ? 'active' : '']" 
						@tap="setStatusFilter('all')"
					>全部</text>
					<text 
						:class="['filter-tag', statusFilter === 'pending' ? 'active' : '']" 
						@tap="setStatusFilter('pending')"
					>待完成</text>
					<text 
						:class="['filter-tag', statusFilter === 'completed' ? 'active' : '']" 
						@tap="setStatusFilter('completed')"
					>已完成</text>
				</view>
			</view>
			
			<view class="filter-section">
				<text class="filter-title">类别</text>
				<view class="filter-tags">
					<text 
						:class="['filter-tag', categoryFilter === 'all' ? 'active' : '']" 
						@tap="setCategoryFilter('all')"
					>全部</text>
					<text 
						v-for="category in categories" 
						:key="category"
						:class="['filter-tag', categoryFilter === category ? 'active' : '']" 
						@tap="setCategoryFilter(category)"
					>{{category}}</text>
				</view>
			</view>
			
			<view class="filter-section">
				<text class="filter-title">优先级</text>
				<view class="filter-tags">
					<text 
						:class="['filter-tag', priorityFilter === 'all' ? 'active' : '']" 
						@tap="setPriorityFilter('all')"
					>全部</text>
					<text 
						:class="['filter-tag', priorityFilter === 0 ? 'active' : '']" 
						@tap="setPriorityFilter(0)"
					>低</text>
					<text 
						:class="['filter-tag', priorityFilter === 1 ? 'active' : '']" 
						@tap="setPriorityFilter(1)"
					>中</text>
					<text 
						:class="['filter-tag', priorityFilter === 2 ? 'active' : '']" 
						@tap="setPriorityFilter(2)"
					>高</text>
				</view>
			</view>
		</view>
		
		<!-- 任务列表 -->
		<view class="task-list" v-if="filteredTasks.length > 0">
			<view 
				:class="['task-item', task.completed ? 'completed' : '']" 
				v-for="task in filteredTasks" 
				:key="task.id"
				@tap="selectTask(task)"
			>
				<view class="task-checkbox" @tap.stop="toggleTaskStatus(task)" v-if="!isSelectMode">
					<uni-icons 
						:type="task.completed ? 'checkbox-filled' : 'circle'" 
						size="20" 
						:color="task.completed ? '#10b981' : '#d1d5db'"
					></uni-icons>
				</view>
				<view class="task-content">
					<view class="task-header">
						<text class="task-title">{{task.title}}</text>
						<view :class="['priority-badge', `priority-${task.priority}`]"></view>
					</view>
					<view class="task-details">
						<view class="task-info">
							<uni-icons type="calendar" size="12" color="#6b7280"></uni-icons>
							<text class="task-date">{{task.dueDate ? formatDate(task.dueDate) : '无截止日期'}}</text>
						</view>
						<view class="task-info">
							<uni-icons type="clock" size="12" color="#6b7280"></uni-icons>
							<text class="task-duration">{{task.duration}}分钟</text>
						</view>
						<view class="task-info" v-if="task.category">
							<uni-icons type="tag" size="12" color="#6b7280"></uni-icons>
							<text class="task-category">{{task.category}}</text>
						</view>
					</view>
				</view>
				<view class="task-actions">
					<uni-icons 
						:type="isSelectMode ? 'arrow-right' : 'more-filled'" 
						size="16" 
						color="#6b7280"
					></uni-icons>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty-state" v-else>
			<image src="/static/images/empty-tasks.png" mode="aspectFit" class="empty-image"></image>
			<text class="empty-text">{{ getEmptyStateText() }}</text>
			<button class="add-task-btn" @tap="goToAddTask" v-if="!isSelectMode">添加任务</button>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar" v-if="!isSelectMode && filteredTasks.length > 0">
			<view class="task-count">
				<text>共 {{tasks.length}} 个任务，已完成 {{completedCount}} 个</text>
			</view>
			<view class="action-btns">
				<button class="action-btn" @tap="goToAddTask">添加任务</button>
				<button class="action-btn danger" @tap="clearCompletedTasks" v-if="completedCount > 0">清除已完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tasks: [],
				isSelectMode: false,
				showFilters: false,
				statusFilter: 'pending', // all, pending, completed
				categoryFilter: 'all',
				priorityFilter: 'all',
				categories: ['工作', '学习', '生活', '会议', '沟通', '重要']
			}
		},
		computed: {
			filteredTasks() {
				return this.tasks.filter(task => {
					// 状态筛选
					if (this.statusFilter === 'pending' && task.completed) return false
					if (this.statusFilter === 'completed' && !task.completed) return false
					
					// 类别筛选
					if (this.categoryFilter !== 'all' && task.category !== this.categoryFilter) return false
					
					// 优先级筛选
					if (this.priorityFilter !== 'all' && task.priority !== this.priorityFilter) return false
					
					return true
				})
			},
			completedCount() {
				return this.tasks.filter(task => task.completed).length
			}
		},
		onLoad(options) {
			this.isSelectMode = options.mode === 'select'
			this.loadTasks()
		},
		onShow() {
			this.loadTasks()
		},
		methods: {
			loadTasks() {
				const tasks = uni.getStorageSync('tasks') || []
				this.tasks = tasks
			},
			selectTask(task) {
				if (this.isSelectMode) {
					// 选择模式下，选中任务后返回
					uni.setStorageSync('selectedTask', task)
					uni.navigateBack()
				} else {
					// 非选择模式下，显示任务详情
					uni.showActionSheet({
						itemList: ['编辑任务', '开始专注', '删除任务'],
						success: (res) => {
							switch(res.tapIndex) {
								case 0:
									this.editTask(task)
									break
								case 1:
									this.startFocus(task)
									break
								case 2:
									this.deleteTask(task)
									break
							}
						}
					})
				}
			},
			toggleTaskStatus(task) {
				// 切换任务完成状态
				task.completed = !task.completed
				
				// 更新本地存储
				uni.setStorageSync('tasks', this.tasks)
				
				// 如果是完成任务，更新树木成长
				if (task.completed) {
					this.updateTreeGrowth()
				}
			},
			updateTreeGrowth() {
				// 从本地存储获取树木数据
				const treeData = uni.getStorageSync('treeData') || {
					level: 1,
					exp: 0,
					totalMinutes: 0
				}
				
				// 完成任务增加2点经验值
				treeData.exp += 2
				
				// 计算等级提升
				const levelUpExp = 60
				
				if (treeData.exp >= levelUpExp) {
					const levelUp = Math.floor(treeData.exp / levelUpExp)
					treeData.level += levelUp
					treeData.exp = treeData.exp % levelUpExp
					
					// 显示升级提示
					uni.showToast({
						title: `树木长大啦！现在 ${treeData.level} 级`,
						icon: 'none',
						duration: 2000
					})
				}
				
				// 保存树木数据
				uni.setStorageSync('treeData', treeData)
			},
			editTask(task) {
				// 编辑任务功能
				uni.showToast({
					title: '编辑功能开发中',
					icon: 'none'
				})
			},
			startFocus(task) {
				// 开始专注
				uni.setStorageSync('selectedTask', task)
				uni.navigateTo({
					url: '/pages/focus/focus'
				})
			},
			deleteTask(task) {
				// 删除任务确认
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个任务吗？',
					success: (res) => {
						if (res.confirm) {
							const index = this.tasks.findIndex(t => t.id === task.id)
							if (index !== -1) {
								this.tasks.splice(index, 1)
								uni.setStorageSync('tasks', this.tasks)
								
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
							}
						}
					}
				})
			},
			goToAddTask() {
				uni.navigateTo({
					url: '/pages/addTask/addTask'
				})
			},
			showFilterOptions() {
				this.showFilters = !this.showFilters
			},
			setStatusFilter(status) {
				this.statusFilter = status
			},
			setCategoryFilter(category) {
				this.categoryFilter = category
			},
			setPriorityFilter(priority) {
				this.priorityFilter = priority
			},
			clearCompletedTasks() {
				uni.showModal({
					title: '确认清除',
					content: '确定要清除所有已完成的任务吗？',
					success: (res) => {
						if (res.confirm) {
							this.tasks = this.tasks.filter(task => !task.completed)
							uni.setStorageSync('tasks', this.tasks)
							
							uni.showToast({
								title: '清除成功',
								icon: 'success'
							})
						}
					}
				})
			},
			formatDate(dateString) {
				const date = new Date(dateString)
				const year = date.getFullYear()
				const month = (date.getMonth() + 1).toString().padStart(2, '0')
				const day = date.getDate().toString().padStart(2, '0')
				return `${year}-${month}-${day}`
			},
			getEmptyStateText() {
				if (this.isSelectMode) {
					return '没有可选择的任务'
				}
				
				if (this.tasks.length === 0) {
					return '暂无任务，点击下方按钮添加'
				}
				
				if (this.statusFilter === 'completed') {
					return '暂无已完成的任务'
				}
				
				if (this.statusFilter === 'pending') {
					return '暂无待完成的任务'
				}
				
				return '没有符合筛选条件的任务'
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
		background-color: #f9fafb;
		min-height: 100vh;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.header-actions {
		display: flex;
		gap: 20rpx;
	}
	
	.filter-btn, .add-btn {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}
	
	/* 筛选选项 */
	.filter-options {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	
	.filter-section {
		margin-bottom: 20rpx;
	}
	
	.filter-section:last-child {
		margin-bottom: 0;
	}
	
	.filter-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #4b5563;
		margin-bottom: 16rpx;
		display: block;
	}
	
	.filter-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}
	
	.filter-tag {
		padding: 10rpx 20rpx;
		background-color: #f3f4f6;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.filter-tag.active {
		background-color: #4f46e5;
		color: #ffffff;
	}
	
	/* 任务列表 */
	.task-list {
		background: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 100rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	
	.task-item {
		padding: 24rpx 30rpx;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #e5e7eb;
	}
	
	.task-item:last-child {
		border-bottom: none;
	}
	
	.task-item.completed .task-title {
		color: #9ca3af;
		text-decoration: line-through;
	}
	
	.task-checkbox {
		margin-right: 20rpx;
	}
	
	.task-content {
		flex: 1;
		margin-right: 20rpx;
	}
	
	.task-header {
		display: flex;
		align-items: center;
		margin-bottom: 8rpx;
	}
	
	.task-title {
		font-size: 30rpx;
		color: #1f2937;
		font-weight: 500;
		margin-right: 12rpx;
	}
	
	.priority-badge {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
	}
	
	.priority-0 {
		background-color: #9ca3af;
	}
	
	.priority-1 {
		background-color: #f59e0b;
	}
	
	.priority-2 {
		background-color: #ef4444;
	}
	
	.task-details {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}
	
	.task-info {
		display: flex;
		align-items: center;
		gap: 4rpx;
	}
	
	.task-date, .task-duration, .task-category {
		font-size: 22rpx;
		color: #6b7280;
	}
	
	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
	}
	
	.empty-image {
		width: 300rpx;
		height: 300rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #6b7280;
		margin-bottom: 40rpx;
	}
	
	.add-task-btn {
		width: 300rpx;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #4f46e5;
		color: #ffffff;
		font-size: 28rpx;
		border-radius: 8rpx;
	}
	
	/* 底部操作栏 */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		display: flex;
		flex-direction: column;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.task-count {
		font-size: 24rpx;
		color: #6b7280;
		margin-bottom: 16rpx;
	}
	
	.action-btns {
		display: flex;
		gap: 20rpx;
	}
	
	.action-btn {
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #4f46e5;
		color: #ffffff;
		font-size: 26rpx;
		border-radius: 8rpx;
	}
	
	.action-btn.danger {
		background-color: #ef4444;
	}
</style>