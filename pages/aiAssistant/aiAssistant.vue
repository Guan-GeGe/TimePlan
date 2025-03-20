<template>
	<view class="container">
		<view class="header">
			<text class="header-title">AI助手</text>
		</view>
		
		<scroll-view class="chat-container" scroll-y="true" :scroll-top="scrollTop" :scroll-with-animation="true">
			<!-- 欢迎消息 -->
			<view class="message-with-avatar">
				<view class="assistant-avatar">
					<uni-icons type="staff" size="20" color="#FFFFFF"></uni-icons>
				</view>
				<view class="chat-message assistant">
					<text>你好！我是你的AI时间管理助手。我可以帮你：</text>
					<view class="suggestion-chips">
						<text class="suggestion-chip">安排今日任务</text>
						<text class="suggestion-chip">提高工作效率</text>
						<text class="suggestion-chip">分析时间使用</text>
					</view>
					<text class="message-time">09:00</text>
				</view>
			</view>
			
			<!-- 聊天记录 -->
			<block v-for="(message, index) in messages" :key="index">
				<!-- 用户消息 -->
				<view class="chat-message user" v-if="message.type === 'user'">
					<text>{{message.content}}</text>
					<text class="message-time">{{message.time}}</text>
				</view>
				
				<!-- 助手消息 -->
				<view class="message-with-avatar" v-else>
					<view class="assistant-avatar">
						<uni-icons type="staff" size="20" color="#FFFFFF"></uni-icons>
					</view>
					<view class="chat-message assistant">
						<text>{{message.content}}</text>
						<view class="suggestion-chips" v-if="message.suggestions && message.suggestions.length > 0">
							<text 
								class="suggestion-chip" 
								v-for="(suggestion, sIndex) in message.suggestions" 
								:key="sIndex"
								@tap="useSuggestion(suggestion)"
							>{{suggestion}}</text>
						</view>
						<view class="task-card" v-if="message.task">
							<view class="task-card-header">
								<text class="task-card-title">{{message.task.title}}</text>
								<text class="task-card-time">{{message.task.time}}</text>
							</view>
							<text class="task-card-desc">{{message.task.description}}</text>
							<view class="task-card-actions">
								<button class="task-card-btn" @tap="addTask(message.task)">添加任务</button>
								<button class="task-card-btn secondary" @tap="modifyTask(message.task)">修改</button>
							</view>
						</view>
						<text class="message-time">{{message.time}}</text>
					</view>
				</view>
				
				<!-- 正在输入提示 -->
				<view class="message-with-avatar" v-if="index === messages.length - 1 && message.type === 'user' && isTyping">
					<view class="assistant-avatar">
						<uni-icons type="staff" size="20" color="#FFFFFF"></uni-icons>
					</view>
					<view class="chat-message assistant typing">
						<view class="typing-indicator">
							<view class="typing-dot"></view>
							<view class="typing-dot"></view>
							<view class="typing-dot"></view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		
		<view class="chat-input-container">
			<view class="quick-actions">
				<view class="quick-action-btn" @tap="quickAction('安排今日任务')">
					<uni-icons type="calendar" size="16" color="#4f46e5"></uni-icons>
					<text>安排今日任务</text>
				</view>
				<view class="quick-action-btn" @tap="quickAction('提高工作效率')">
					<uni-icons type="flag" size="16" color="#4f46e5"></uni-icons>
					<text>提高工作效率</text>
				</view>
				<view class="quick-action-btn" @tap="quickAction('分析时间使用')">
					<uni-icons type="chart" size="16" color="#4f46e5"></uni-icons>
					<text>分析时间使用</text>
				</view>
			</view>
			
			<view class="chat-input-wrapper">
				<input 
					class="chat-input" 
					type="text" 
					v-model="inputMessage" 
					placeholder="输入问题..." 
					confirm-type="send"
					@confirm="sendMessage"
				/>
				<view class="chat-actions">
					<view class="action-btn" @tap="toggleVoiceInput">
						<uni-icons type="mic" size="24" color="#6b7280"></uni-icons>
					</view>
					<view class="action-btn send-btn" @tap="sendMessage">
						<uni-icons type="paperplane" size="20" color="#FFFFFF"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputMessage: '',
				messages: [],
				isTyping: false,
				scrollTop: 0,
				currentTime: '09:00'
			}
		},
		methods: {
			sendMessage() {
				if (!this.inputMessage.trim()) return;
				
				// 获取当前时间
				const now = new Date();
				const hours = now.getHours().toString().padStart(2, '0');
				const minutes = now.getMinutes().toString().padStart(2, '0');
				this.currentTime = `${hours}:${minutes}`;
				
				// 添加用户消息
				this.messages.push({
					type: 'user',
					content: this.inputMessage,
					time: this.currentTime
				});
				
				// 清空输入框
				const userMessage = this.inputMessage;
				this.inputMessage = '';
				
				// 滚动到底部
				this.scrollToBottom();
				
				// 显示AI正在输入
				this.isTyping = true;
				
				// 模拟AI回复
				setTimeout(() => {
					this.isTyping = false;
					
					// 根据用户输入生成回复
					let response = this.generateResponse(userMessage);
					
					// 添加AI回复
					this.messages.push({
						type: 'assistant',
						content: response.content,
						time: this.currentTime,
						suggestions: response.suggestions,
						task: response.task
					});
					
					// 滚动到底部
					this.scrollToBottom();
				}, 1000);
			},
			
			scrollToBottom() {
				// 滚动到底部的逻辑
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.chat-container').boundingClientRect();
					query.exec(res => {
						if (res && res[0]) {
							this.scrollTop = res[0].height * 2; // 乘以2确保滚动到底部
						}
					});
				}, 100);
			},
			
			quickAction(action) {
				this.inputMessage = action;
				this.sendMessage();
			},
			
			useSuggestion(suggestion) {
				this.inputMessage = suggestion;
				this.sendMessage();
			},
			
			toggleVoiceInput() {
				uni.showToast({
					title: '语音输入功能开发中',
					icon: 'none'
				});
			},
			
			addTask(task) {
				uni.showToast({
					title: '任务已添加',
					icon: 'success'
				});
			},
			
			modifyTask(task) {
				uni.showToast({
					title: '修改功能开发中',
					icon: 'none'
				});
			},
			
			generateResponse(message) {
				// 简单的响应生成逻辑
				let response = {
					content: '',
					suggestions: [],
					task: null
				};
				
				if (message.includes('任务')) {
					response.content = '好的，我可以帮你安排今天的任务。你希望我如何安排？';
					response.suggestions = ['按优先级排序', '按时间排序', '创建新任务'];
				} else if (message.includes('效率')) {
					response.content = '提高效率的几个建议：\n1. 使用番茄工作法\n2. 减少干扰和多任务\n3. 设定明确的目标\n4. 定期休息';
					response.suggestions = ['番茄工作法是什么', '如何减少干扰', '如何设定目标'];
				} else if (message.includes('分析')) {
					response.content = '根据你的使用情况，上周你在工作任务上花费了65%的时间，学习上花费了20%，其余用于休息和娱乐。';
					response.suggestions = ['如何提高工作效率', '查看详细分析', '设定新目标'];
					response.task = {
						title: '查看详细分析报告',
						time: '15分钟',
						description: '回顾上周时间使用情况，找出可以优化的地方'
					};
				} else {
					response.content = '我是你的AI助手，可以帮你管理时间、安排任务和提高效率。有什么我可以帮你的吗？';
					response.suggestions = ['安排今日任务', '提高工作效率', '分析时间使用'];
				}
				
				return response;
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
	
	.chat-container {
		flex: 1;
		padding: 30rpx;
		overflow-y: auto;
	}
	
	.chat-message {
		max-width: 80%;
		padding: 24rpx 30rpx;
		border-radius: 24rpx;
		margin-bottom: 30rpx;
	}
	
	.chat-message.user {
		align-self: flex-end;
		background: #4f46e5;
		color: white;
		border-bottom-right-radius: 4rpx;
		margin-left: auto;
	}
	
	.chat-message.assistant {
		align-self: flex-start;
		background: #ffffff;
		border: 1rpx solid #e5e7eb;
		border-bottom-left-radius: 4rpx;
		color: #1f2937;
	}
	
	.message-time {
		font-size: 20rpx;
		margin-top: 8rpx;
		opacity: 0.7;
		text-align: right;
		display: block;
	}
	
	.chat-input-container {
		padding: 20rpx 30rpx 30rpx;
		border-top: 1rpx solid #e5e7eb;
		background-color: #ffffff;
	}
	
	.chat-input-wrapper {
		display: flex;
		align-items: center;
		background-color: #f3f4f6;
		border: 1rpx solid #e5e7eb;
		border-radius: 40rpx;
		padding: 8rpx 16rpx 8rpx 30rpx;
	}
	
	.chat-input {
		flex: 1;
		border: none;
		background: transparent;
		padding: 16rpx 0;
		color: #1f2937;
		font-size: 28rpx;
	}
	
	.chat-actions {
		display: flex;
		align-items: center;
	}
	
	.action-btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #6b7280;
		margin-left: 8rpx;
	}
	
	.send-btn {
		background-color: #4f46e5;
		color: white;
	}
	
	.quick-actions {
		display: flex;
		overflow-x: auto;
		padding: 16rpx 0;
		margin-bottom: 16rpx;
	}
	
	.quick-action-btn {
		display: flex;
		align-items: center;
		padding: 16rpx 24rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		white-space: nowrap;
		margin-right: 16rpx;
		background-color: rgba(79, 70, 229, 0.1);
		color: #4f46e5;
	}
	
	.quick-action-btn uni-icons {
		margin-right: 8rpx;
	}
	
	.assistant-avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background-color: #4f46e5;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 24rpx;
		flex-shrink: 0;
	}
	
	.message-with-avatar {
		display: flex;
		align-items: flex-start;
		margin-bottom: 30rpx;
	}
	
	.typing-indicator {
		display: flex;
		align-items: center;
		padding: 8rpx 0;
	}
	
	.typing-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #9ca3af;
		margin: 0 4rpx;
		animation: typingAnimation 1.5s infinite ease-in-out;
	}
	
	.typing-dot:nth-child(1) {
		animation-delay: 0s;
	}
	
	.typing-dot:nth-child(2) {
		animation-delay: 0.2s;
	}
	
	.typing-dot:nth-child(3) {
		animation-delay: 0.4s;
	}
	
	@keyframes typingAnimation {
		0%, 60%, 100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-10rpx);
		}
	}
	
	.suggestion-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 16rpx;
		margin-bottom: 8rpx;
	}
	
	.suggestion-chip {
		padding: 12rpx 24rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		background-color: rgba(79, 70, 229, 0.1);
		color: #4f46e5;
		border: 1rpx solid rgba(79, 70, 229, 0.2);
	}
	
	.task-card {
		background-color: #f9fafb;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-top: 16rpx;
		border: 1rpx solid #e5e7eb;
	}
	
	.task-card-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}
	
	.task-card-title {
		font-weight: 600;
		color: #1f2937;
	}
	
	.task-card-time {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.task-card-desc {
		font-size: 26rpx;
		color: #4b5563;
		margin-bottom: 16rpx;
		line-height: 1.5;
	}
	
	.task-card-actions {
		display: flex;
		gap: 16rpx;
		margin-top: 16rpx;
	}
	
	.task-card-btn {
		flex: 1;
		font-size: 24rpx;
		background-color: #4f46e5;
		color: #ffffff;
		border-radius: 8rpx;
		padding: 12rpx 0;
		text-align: center;
	}
	
	.task-card-btn.secondary {
		background-color: #f3f4f6;
		color: #4b5563;
		border: 1rpx solid #e5e7eb;
	}
</style>
