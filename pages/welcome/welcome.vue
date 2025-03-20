<template>
	<view class="welcome-container">
		<swiper class="swiper" :indicator-dots="true" :autoplay="false" :duration="500" :current="currentSlide">
			<!-- 欢迎页 1 -->
			<swiper-item>
				<view class="welcome-slide">
					<image src="/static/images/welcome-1.png" mode="aspectFit" class="welcome-image"></image>
					<text class="welcome-title">欢迎使用 AI 时间盒子</text>
					<text class="welcome-desc">智能时间管理，让生活更高效</text>
					<button class="btn-primary" @tap="nextSlide">
						<text>开始探索</text>
						<uni-icons type="arrowright" size="16" color="#FFFFFF"></uni-icons>
					</button>
				</view>
			</swiper-item>
			
			<!-- 欢迎页 2 -->
			<swiper-item>
				<view class="welcome-slide">
					<image src="/static/images/welcome-2.png" mode="aspectFit" class="welcome-image"></image>
					<text class="welcome-title">智能时间规划</text>
					<text class="welcome-desc">AI 助手帮你合理安排每一天，提高工作效率</text>
					<button class="btn-primary" @tap="nextSlide">
						<text>继续</text>
						<uni-icons type="arrowright" size="16" color="#FFFFFF"></uni-icons>
					</button>
				</view>
			</swiper-item>
			
			<!-- 欢迎页 3 -->
			<swiper-item>
				<view class="welcome-slide">
					<image src="/static/images/welcome-3.png" mode="aspectFit" class="welcome-image"></image>
					<text class="welcome-title">专注时间管理</text>
					<text class="welcome-desc">番茄工作法、专注模式，帮你保持高效状态</text>
					<button class="btn-primary" @tap="nextSlide">
						<text>继续</text>
						<uni-icons type="arrowright" size="16" color="#FFFFFF"></uni-icons>
					</button>
				</view>
			</swiper-item>
			
			<!-- 欢迎页 4 -->
			<swiper-item>
				<view class="welcome-slide">
					<image src="/static/images/welcome-4.png" mode="aspectFit" class="welcome-image"></image>
					<text class="welcome-title">数据驱动改进</text>
					<text class="welcome-desc">分析你的时间使用情况，持续优化工作方式</text>
					<button class="btn-primary" @tap="goToHome">
						<text>开始使用</text>
						<uni-icons type="checkmarkempty" size="16" color="#FFFFFF"></uni-icons>
					</button>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="progress-dots">
			<view 
				v-for="(dot, index) in 4" 
				:key="index"
				:class="['dot', currentSlide === index ? 'active' : '']"
				@tap="setSlide(index)"
			></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentSlide: 0
			}
		},
		methods: {
			nextSlide() {
				if (this.currentSlide < 3) {
					this.currentSlide++;
				}
			},
			setSlide(index) {
				this.currentSlide = index;
			},
			goToHome() {
				// 跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style>
	.welcome-container {
		height: 100vh;
		background-color: #f9fafb;
		position: relative;
	}
	
	.swiper {
		height: 100%;
	}
	
	.welcome-slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		height: 100%;
	}
	
	.welcome-image {
		width: 400rpx;
		height: 400rpx;
		margin-bottom: 60rpx;
	}
	
	.welcome-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 20rpx;
		text-align: center;
	}
	
	.welcome-desc {
		font-size: 32rpx;
		color: #6b7280;
		margin-bottom: 60rpx;
		text-align: center;
		line-height: 1.5;
	}
	
	.btn-primary {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #4f46e5;
		color: #ffffff;
		font-size: 32rpx;
		padding: 24rpx 60rpx;
		border-radius: 12rpx;
		margin-top: 40rpx;
	}
	
	.btn-primary uni-icons {
		margin-left: 12rpx;
	}
	
	.progress-dots {
		position: absolute;
		bottom: 80rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: #e5e7eb;
		margin: 0 10rpx;
		transition: all 0.3s;
	}
	
	.dot.active {
		background-color: #4f46e5;
		width: 40rpx;
		border-radius: 8rpx;
	}
</style>
