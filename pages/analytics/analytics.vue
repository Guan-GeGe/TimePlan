<template>
	<view class="container">
		<view class="header">
			<text class="header-title">数据分析</text>
		</view>
		
		<scroll-view class="content" scroll-y="true">
			<!-- 时间概览卡片 -->
			<view class="card">
				<view class="card-header">
					<text class="card-title">时间概览</text>
					<view class="period-selector">
						<text 
							v-for="(period, index) in periods" 
							:key="index" 
							:class="['period-option', selectedPeriod === period ? 'active' : '']"
							@tap="selectPeriod(period)"
						>{{period}}</text>
					</view>
				</view>
				
				<view class="chart-container">
					<view class="chart-placeholder">
						<!-- 这里将来会放置实际的图表组件 -->
						<view class="pie-chart">
							<view class="pie-segment work" style="transform: rotate(0deg); clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);">
								<text class="pie-percent">65%</text>
							</view>
							<view class="pie-segment study" style="transform: rotate(234deg); clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%, 50% 50%);">
								<text class="pie-percent">20%</text>
							</view>
							<view class="pie-segment rest" style="transform: rotate(306deg); clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 30%, 50% 50%);">
								<text class="pie-percent">15%</text>
							</view>
						</view>
					</view>
					
					<view class="chart-legend">
						<view class="legend-item">
							<view class="legend-color work"></view>
							<text class="legend-text">工作 (65%)</text>
						</view>
						<view class="legend-item">
							<view class="legend-color study"></view>
							<text class="legend-text">学习 (20%)</text>
						</view>
						<view class="legend-item">
							<view class="legend-color rest"></view>
							<text class="legend-text">休息 (15%)</text>
						</view>
					</view>
				</view>
				
				<view class="stats-grid">
					<view class="stat-item">
						<text class="stat-value">32.5小时</text>
						<text class="stat-label">工作时间</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">10小时</text>
						<text class="stat-label">学习时间</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">7.5小时</text>
						<text class="stat-label">休息时间</text>
					</view>
				</view>
			</view>
			
			<!-- 专注时段分析 -->
			<view class="card">
				<view class="card-header">
					<text class="card-title">专注时段分析</text>
				</view>
				
				<view class="chart-container">
					<view class="bar-chart">
						<view class="bar-chart-labels">
							<text class="bar-chart-label">上午</text>
							<text class="bar-chart-label">下午</text>
							<text class="bar-chart-label">晚上</text>
						</view>
						<view class="bar-chart-bars">
							<view class="bar-container">
								<view class="bar" style="height: 80%;"></view>
								<text class="bar-value">80%</text>
							</view>
							<view class="bar-container">
								<view class="bar" style="height: 60%;"></view>
								<text class="bar-value">60%</text>
							</view>
							<view class="bar-container">
								<view class="bar" style="height: 40%;"></view>
								<text class="bar-value">40%</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="insight-box">
					<uni-icons type="info" size="16" color="#4f46e5"></uni-icons>
					<text class="insight-text">你在上午的专注度最高，建议将重要任务安排在上午进行。</text>
				</view>
			</view>
			
			<!-- 任务完成情况 -->
			<view class="card">
				<view class="card-header">
					<text class="card-title">任务完成情况</text>
				</view>
				
				<view class="progress-container">
					<view class="progress-item">
						<view class="progress-label">
							<text>总体完成率</text>
							<text>85%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" style="width: 85%;"></view>
						</view>
					</view>
					
					<view class="progress-item">
						<view class="progress-label">
							<text>工作任务</text>
							<text>90%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" style="width: 90%;"></view>
						</view>
					</view>
					
					<view class="progress-item">
						<view class="progress-label">
							<text>学习任务</text>
							<text>75%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" style="width: 75%;"></view>
						</view>
					</view>
					
					<view class="progress-item">
						<view class="progress-label">
							<text>生活任务</text>
							<text>80%</text>
						</view>
						<view class="progress-bar">
							<view class="progress-fill" style="width: 80%;"></view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 最近活动 -->
			<view class="card">
				<view class="card-header">
					<text class="card-title">最近活动</text>
				</view>
				
				<view class="activity-list">
					<view class="activity-item">
						<view class="activity-icon completed">
							<uni-icons type="checkmarkempty" size="16" color="#FFFFFF"></uni-icons>
						</view>
						<view class="activity-content">
							<text class="activity-title">完成项目报告</text>
							<text class="activity-time">今天 14:30</text>
						</view>
						<text class="activity-duration">2小时</text>
					</view>
					
					<view class="activity-item">
						<view class="activity-icon focus">
							<uni-icons type="flag" size="16" color="#FFFFFF"></uni-icons>
						</view>
						<view class="activity-content">
							<text class="activity-title">专注工作</text>
							<text class="activity-time">今天 10:00</text>
						</view>
						<text class="activity-duration">1.5小时</text>
					</view>
					
					<view class="activity-item">
						<view class="activity-icon completed">
							<uni-icons type="checkmarkempty" size="16" color="#FFFFFF"></uni-icons>
						</view>
						<view class="activity-content">
							<text class="activity-title">学习新技能</text>
							<text class="activity-time">昨天 16:45</text>
						</view>
						<text class="activity-duration">1小时</text>
					</view>
					
					<view class="activity-item">
						<view class="activity-icon rest">
							<uni-icons type="refreshempty" size="16" color="#FFFFFF"></uni-icons>
						</view>
						<view class="activity-content">
							<text class="activity-title">休息时间</text>
							<text class="activity-time">昨天 13:20</text>
						</view>
						<text class="activity-duration">30分钟</text>
					</view>
				</view>
				
				<button class="view-more-btn">查看更多活动</button>
			</view>
			
			<!-- 提升建议 -->
			<view class="card">
				<view class="card-header">
					<text class="card-title">提升建议</text>
				</view>
				
				<view class="tips-list">
					<view class="tip-item">
						<view class="tip-icon">
							<uni-icons type="flag" size="20" color="#4f46e5"></uni-icons>
						</view>
						<view class="tip-content">
							<text class="tip-title">增加上午工作时间</text>
							<text class="tip-desc">你在上午的专注度最高，可以尝试将更多重要任务安排在上午。</text>
						</view>
					</view>
					
					<view class="tip-item">
						<view class="tip-icon">
							<uni-icons type="calendar" size="20" color="#4f46e5"></uni-icons>
						</view>
						<view class="tip-content">
							<text class="tip-title">提高学习任务完成率</text>
							<text class="tip-desc">你的学习任务完成率较低，可以尝试将学习任务分解为更小的步骤。</text>
						</view>
					</view>
					
					<view class="tip-item">
						<view class="tip-icon">
							<uni-icons type="refreshempty" size="20" color="#4f46e5"></uni-icons>
						</view>
						<view class="tip-content">
							<text class="tip-title">增加休息时间</text>
							<text class="tip-desc">适当增加休息时间可以提高整体工作效率，建议每工作25分钟休息5分钟。</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 响应式状态
const periods = ref(['本周', '本月', '本季度', '本年']);
const selectedPeriod = ref('本周');

// 方法
function selectPeriod(period) {
    selectedPeriod.value = period;
    // 这里将来会添加根据所选时间段更新数据的逻辑
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
	
	.card {
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	
	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.period-selector {
		display: flex;
		background-color: #f3f4f6;
		border-radius: 30rpx;
		overflow: hidden;
	}
	
	.period-option {
		padding: 12rpx 24rpx;
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.period-option.active {
		background-color: #4f46e5;
		color: #ffffff;
	}
	
	.chart-container {
		margin-bottom: 30rpx;
	}
	
	.chart-placeholder {
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.pie-chart {
		width: 300rpx;
		height: 300rpx;
		border-radius: 50%;
		position: relative;
		overflow: hidden;
	}
	
	.pie-segment {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	
	.pie-segment.work {
		background-color: #4f46e5;
	}
	
	.pie-segment.study {
		background-color: #10b981;
	}
	
	.pie-segment.rest {
		background-color: #f59e0b;
	}
	
	.pie-percent {
		display: none;
	}
	
	.chart-legend {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 30rpx;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
	}
	
	.legend-color {
		width: 24rpx;
		height: 24rpx;
		border-radius: 6rpx;
		margin-right: 12rpx;
	}
	
	.legend-color.work {
		background-color: #4f46e5;
	}
	
	.legend-color.study {
		background-color: #10b981;
	}
	
	.legend-color.rest {
		background-color: #f59e0b;
	}
	
	.legend-text {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.stats-grid {
		display: flex;
		justify-content: space-between;
	}
	
	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
	}
	
	.stat-value {
		font-size: 32rpx;
		font-weight: bold;
		color: #1f2937;
		margin-bottom: 8rpx;
	}
	
	.stat-label {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.bar-chart {
		height: 300rpx;
		display: flex;
		padding: 20rpx 0;
	}
	
	.bar-chart-labels {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-right: 20rpx;
	}
	
	.bar-chart-label {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.bar-chart-bars {
		flex: 1;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
	}
	
	.bar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 80rpx;
	}
	
	.bar {
		width: 100%;
		background-color: #4f46e5;
		border-radius: 8rpx 8rpx 0 0;
	}
	
	.bar-value {
		font-size: 24rpx;
		color: #6b7280;
		margin-top: 8rpx;
	}
	
	.insight-box {
		display: flex;
		align-items: flex-start;
		background-color: rgba(79, 70, 229, 0.1);
		padding: 20rpx;
		border-radius: 16rpx;
	}
	
	.insight-text {
		font-size: 26rpx;
		color: #4b5563;
		margin-left: 16rpx;
		line-height: 1.5;
	}
	
	.progress-container {
		margin-bottom: 20rpx;
	}
	
	.progress-item {
		margin-bottom: 20rpx;
	}
	
	.progress-label {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8rpx;
		font-size: 26rpx;
		color: #4b5563;
	}
	
	.progress-bar {
		height: 16rpx;
		background-color: #e5e7eb;
		border-radius: 8rpx;
		overflow: hidden;
	}
	
	.progress-fill {
		height: 100%;
		background-color: #4f46e5;
		border-radius: 8rpx;
	}
	
	.activity-list {
		margin-bottom: 30rpx;
	}
	
	.activity-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #e5e7eb;
	}
	
	.activity-item:last-child {
		border-bottom: none;
	}
	
	.activity-icon {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
	}
	
	.activity-icon.completed {
		background-color: #10b981;
	}
	
	.activity-icon.focus {
		background-color: #4f46e5;
	}
	
	.activity-icon.rest {
		background-color: #f59e0b;
	}
	
	.activity-content {
		flex: 1;
	}
	
	.activity-title {
		font-size: 28rpx;
		color: #1f2937;
		margin-bottom: 4rpx;
	}
	
	.activity-time {
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.activity-duration {
		font-size: 26rpx;
		color: #4b5563;
		font-weight: 500;
	}
	
	.view-more-btn {
		width: 100%;
		padding: 20rpx 0;
		background-color: #f3f4f6;
		color: #4b5563;
		border-radius: 12rpx;
		font-size: 28rpx;
		text-align: center;
		border: none;
	}
	
	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}
	
	.tip-item {
		display: flex;
		align-items: flex-start;
	}
	
	.tip-icon {
		width: 64rpx;
		height: 64rpx;
		border-radius: 16rpx;
		background-color: rgba(79, 70, 229, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 20rpx;
	}
	
	.tip-content {
		flex: 1;
	}
	
	.tip-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 8rpx;
	}
	
	.tip-desc {
		font-size: 26rpx;
		color: #6b7280;
		line-height: 1.5;
	}
</style>
