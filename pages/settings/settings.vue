<template>
	<view class="container">
		<view class="header">
			<text class="header-title">设置</text>
		</view>
		
		<scroll-view class="content" scroll-y="true">
			<!-- 个人资料 -->
			<view class="profile-section">
				<view class="profile-avatar">
					<image src="/static/images/avatar.png" mode="aspectFill"></image>
				</view>
				<view class="profile-info">
					<text class="profile-name">小明</text>
					<text class="profile-email">xiaoming@example.com</text>
				</view>
				<view class="profile-edit" @tap="editProfile">
					<text>编辑</text>
				</view>
			</view>
			
			<!-- 通用设置 -->
			<view class="settings-section">
				<text class="section-title">通用设置</text>
				<view class="settings-card">
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="moon" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">深色模式</text>
								<text class="settings-description">切换应用的显示主题</text>
							</view>
						</view>
						<view class="settings-action">
							<switch 
								:checked="darkMode" 
								@change="toggleDarkMode" 
								color="#4f46e5"
							/>
						</view>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="sound" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">通知提醒</text>
								<text class="settings-description">任务提醒和重要通知</text>
							</view>
						</view>
						<view class="settings-action">
							<switch 
								:checked="notifications" 
								@change="toggleNotifications" 
								color="#4f46e5"
							/>
						</view>
					</view>
					
					<view class="settings-item" @tap="goToLanguage">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="language" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">语言</text>
								<text class="settings-description">{{language}}</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 时间管理设置 -->
			<view class="settings-section">
				<text class="section-title">时间管理设置</text>
				<view class="settings-card">
					<view class="settings-item" @tap="goToFocusSettings">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="flag" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">专注模式</text>
								<text class="settings-description">设置专注时长和休息时间</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
					
					<view class="settings-item" @tap="goToTaskCategories">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="list" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">任务分类</text>
								<text class="settings-description">管理自定义任务分类</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="calendar" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">每周开始日</text>
								<text class="settings-description">设置每周的第一天</text>
							</view>
						</view>
						<view class="settings-action">
							<picker 
								:value="weekStartIndex" 
								:range="weekStartOptions" 
								@change="changeWeekStart"
							>
								<text class="picker-text">{{weekStartOptions[weekStartIndex]}}</text>
							</picker>
						</view>
					</view>
					
					<view class="settings-item">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="staff" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">AI助手</text>
								<text class="settings-description">智能任务规划和建议</text>
							</view>
						</view>
						<view class="settings-action">
							<switch 
								:checked="aiAssistant" 
								@change="toggleAiAssistant" 
								color="#4f46e5"
							/>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 数据与隐私 -->
			<view class="settings-section">
				<text class="section-title">数据与隐私</text>
				<view class="settings-card">
					<view class="settings-item" @tap="goToDataSync">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="upload" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">数据同步</text>
								<text class="settings-description">同步数据到云端</text>
							</view>
						</view>
						<view class="settings-action">
							<text class="sync-status">{{syncStatus}}</text>
						</view>
					</view>
					
					<view class="settings-item" @tap="goToBackup">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="download" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">备份与恢复</text>
								<text class="settings-description">管理数据备份</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
					
					<view class="settings-item" @tap="goToPrivacy">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="locked" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">隐私设置</text>
								<text class="settings-description">管理数据使用权限</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
					
					<view class="settings-item" @tap="clearData">
						<view class="settings-item-left">
							<view class="settings-icon danger">
								<uni-icons type="trash" size="20" color="#ef4444"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label danger-text">清除所有数据</text>
								<text class="settings-description">删除所有本地数据</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 关于与支持 -->
			<view class="settings-section">
				<text class="section-title">关于与支持</text>
				<view class="settings-card">
					<view class="settings-item" @tap="goToHelp">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="help" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">帮助中心</text>
								<text class="settings-description">使用指南和常见问题</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
					
					<view class="settings-item" @tap="goToFeedback">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="chat" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">意见反馈</text>
								<text class="settings-description">提交问题或建议</text>
							</view>
						</view>
						<view class="settings-action">
							<uni-icons type="right" size="16" color="#9ca3af"></uni-icons>
						</view>
					</view>
					
					<view class="settings-item" @tap="goToAbout">
						<view class="settings-item-left">
							<view class="settings-icon">
								<uni-icons type="info" size="20" color="#4f46e5"></uni-icons>
							</view>
							<view class="settings-content">
								<text class="settings-label">关于我们</text>
								<text class="settings-description">版本信息和开发团队</text>
							</view>
						</view>
						<view class="settings-action">
							<text class="version-text">v1.0.0</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 退出登录按钮 -->
			<button class="logout-btn" @tap="logout">
				<uni-icons type="poweroff" size="16" color="#ef4444"></uni-icons>
				<text>退出登录</text>
			</button>
			
			<!-- 版本信息 -->
			<view class="version-info">
				<text>AI时间盒子 v1.0.0</text>
				<text>© 2023 TimePlan Team</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				darkMode: false,
				notifications: true,
				language: '简体中文',
				aiAssistant: true,
				weekStartOptions: ['周日', '周一'],
				weekStartIndex: 1,
				syncStatus: '已同步'
			}
		},
		methods: {
			editProfile() {
				uni.showToast({
					title: '编辑资料功能开发中',
					icon: 'none'
				});
			},
			
			toggleDarkMode(e) {
				this.darkMode = e.detail.value;
				// 实际应用中这里会有切换主题的逻辑
				uni.showToast({
					title: this.darkMode ? '已切换到深色模式' : '已切换到浅色模式',
					icon: 'none'
				});
			},
			
			toggleNotifications(e) {
				this.notifications = e.detail.value;
				uni.showToast({
					title: this.notifications ? '已开启通知' : '已关闭通知',
					icon: 'none'
				});
			},
			
			toggleAiAssistant(e) {
				this.aiAssistant = e.detail.value;
				uni.showToast({
					title: this.aiAssistant ? '已开启AI助手' : '已关闭AI助手',
					icon: 'none'
				});
			},
			
			changeWeekStart(e) {
				this.weekStartIndex = e.detail.value;
			},
			
			goToLanguage() {
				uni.showToast({
					title: '语言设置功能开发中',
					icon: 'none'
				});
			},
			
			goToFocusSettings() {
				uni.showToast({
					title: '专注模式设置功能开发中',
					icon: 'none'
				});
			},
			
			goToTaskCategories() {
				uni.showToast({
					title: '任务分类管理功能开发中',
					icon: 'none'
				});
			},
			
			goToDataSync() {
				uni.showToast({
					title: '数据同步功能开发中',
					icon: 'none'
				});
			},
			
			goToBackup() {
				uni.showToast({
					title: '备份与恢复功能开发中',
					icon: 'none'
				});
			},
			
			goToPrivacy() {
				uni.showToast({
					title: '隐私设置功能开发中',
					icon: 'none'
				});
			},
			
			clearData() {
				uni.showModal({
					title: '确认清除数据',
					content: '此操作将删除所有本地数据，且无法恢复。确定要继续吗？',
					confirmColor: '#ef4444',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '数据已清除',
								icon: 'success'
							});
						}
					}
				});
			},
			
			goToHelp() {
				uni.showToast({
					title: '帮助中心功能开发中',
					icon: 'none'
				});
			},
			
			goToFeedback() {
				uni.showToast({
					title: '意见反馈功能开发中',
					icon: 'none'
				});
			},
			
			goToAbout() {
				uni.showToast({
					title: '关于我们功能开发中',
					icon: 'none'
				});
			},
			
			logout() {
				uni.showModal({
					title: '确认退出',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.showToast({
								title: '已退出登录',
								icon: 'success'
							});
							// 实际应用中这里会有退出登录的逻辑
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/welcome/welcome'
								});
							}, 1500);
						}
					}
				});
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f9fafb;
	}
	
	.header {
		padding: 30rpx;
		border-bottom: 1rpx solid #e5e7eb;
		background-color: #ffffff;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.content {
		flex: 1;
		padding: 30rpx;
	}
	
	.profile-section {
		display: flex;
		align-items: center;
		padding: 40rpx 30rpx;
		background-color: #ffffff;
		border-radius: 24rpx;
		margin-bottom: 40rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.profile-avatar {
		width: 128rpx;
		height: 128rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 30rpx;
	}
	
	.profile-avatar image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.profile-info {
		flex: 1;
	}
	
	.profile-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 8rpx;
	}
	
	.profile-email {
		font-size: 28rpx;
		color: #6b7280;
	}
	
	.profile-edit {
		color: #4f46e5;
		font-weight: 600;
		font-size: 28rpx;
	}
	
	.settings-section {
		margin-bottom: 40rpx;
	}
	
	.section-title {
		font-weight: 600;
		color: #6b7280;
		margin-bottom: 16rpx;
		font-size: 28rpx;
		text-transform: uppercase;
		letter-spacing: 2rpx;
		padding-left: 16rpx;
	}
	
	.settings-card {
		background-color: #ffffff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.settings-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #e5e7eb;
	}
	
	.settings-item:last-child {
		border-bottom: none;
	}
	
	.settings-item-left {
		display: flex;
		align-items: center;
		flex: 1;
	}
	
	.settings-icon {
		width: 72rpx;
		height: 72rpx;
		border-radius: 16rpx;
		background-color: rgba(79, 70, 229, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 24rpx;
	}
	
	.settings-icon.danger {
		background-color: rgba(239, 68, 68, 0.1);
	}
	
	.settings-content {
		flex: 1;
	}
	
	.settings-label {
		font-weight: 600;
		color: #1f2937;
		font-size: 30rpx;
		margin-bottom: 4rpx;
	}
	
	.danger-text {
		color: #ef4444;
	}
	
	.settings-description {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.settings-action {
		color: #6b7280;
	}
	
	.picker-text {
		font-size: 28rpx;
		color: #4b5563;
	}
	
	.sync-status {
		font-size: 28rpx;
		color: #10b981;
	}
	
	.version-text {
		font-size: 28rpx;
		color: #6b7280;
	}
	
	.logout-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx;
		background-color: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		border-radius: 24rpx;
		font-weight: 600;
		font-size: 32rpx;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		border: none;
	}
	
	.logout-btn uni-icons {
		margin-right: 16rpx;
	}
	
	.version-info {
		text-align: center;
		font-size: 24rpx;
		color: #9ca3af;
		display: flex;
		flex-direction: column;
		margin-bottom: 40rpx;
	}
</style>
