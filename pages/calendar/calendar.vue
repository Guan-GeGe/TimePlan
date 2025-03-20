<template>
	<view class="container">
		<view class="header">
			<text class="header-title">日历</text>
			<view class="header-actions">
				<view class="action-btn" @tap="showToday">
					<text>今天</text>
				</view>
				<view class="action-btn" @tap="showAddEvent">
					<uni-icons type="plusempty" size="20" color="#4f46e5"></uni-icons>
				</view>
			</view>
		</view>
		
		<view class="calendar-header">
			<view class="month-nav">
				<view class="nav-btn" @tap="prevMonth">
					<uni-icons type="left" size="20" color="#6b7280"></uni-icons>
				</view>
				<text class="month-title">{{currentYear}}年{{currentMonth + 1}}月</text>
				<view class="nav-btn" @tap="nextMonth">
					<uni-icons type="right" size="20" color="#6b7280"></uni-icons>
				</view>
			</view>
			
			<view class="weekdays">
				<text v-for="(day, index) in weekdays" :key="index" class="weekday">{{day}}</text>
			</view>
		</view>
		
		<view class="calendar-grid">
			<view 
				v-for="(day, index) in calendarDays" 
				:key="index"
				:class="['calendar-day', 
					day.isCurrentMonth ? '' : 'other-month',
					day.isToday ? 'today' : '',
					day.isSelected ? 'selected' : '',
					day.hasEvents ? 'has-events' : ''
				]"
				@tap="selectDay(day)"
			>
				<text class="day-number">{{day.day}}</text>
				<view v-if="day.hasEvents" class="event-indicators">
					<view 
						v-for="(event, eIndex) in day.events.slice(0, 3)" 
						:key="eIndex"
						:class="['event-dot', `priority-${event.priority}`]"
					></view>
				</view>
			</view>
		</view>
		
		<view class="events-container">
			<view class="events-header">
				<text class="events-date">{{selectedDateFormatted}}</text>
				<text class="events-count">{{selectedDayEvents.length}}个事件</text>
			</view>
			
			<scroll-view class="events-list" scroll-y="true">
				<view v-if="selectedDayEvents.length === 0" class="empty-state">
					<image src="/static/images/empty-calendar.png" mode="aspectFit" class="empty-image"></image>
					<text class="empty-text">今天没有安排事件</text>
					<button class="add-event-btn" @tap="showAddEvent">添加事件</button>
				</view>
				
				<view 
					v-for="(event, index) in selectedDayEvents" 
					:key="index"
					class="event-item"
					:class="`priority-${event.priority}`"
					@tap="viewEvent(event)"
				>
					<view class="event-time">
						<text>{{formatTime(event.startTime)}} - {{formatTime(event.endTime)}}</text>
						<view :class="['event-priority', `priority-${event.priority}`]"></view>
					</view>
					<view class="event-content">
						<text class="event-title">{{event.title}}</text>
						<text v-if="event.location" class="event-location">
							<uni-icons type="location" size="14" color="#6b7280"></uni-icons>
							{{event.location}}
						</text>
					</view>
					<uni-icons type="right" size="16" color="#6b7280"></uni-icons>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weekdays: ['日', '一', '二', '三', '四', '五', '六'],
				currentYear: new Date().getFullYear(),
				currentMonth: new Date().getMonth(),
				today: new Date(),
				selectedDate: new Date(),
				calendarDays: [],
				events: [
					{
						id: 1,
						title: '项目会议',
						date: new Date(new Date().setHours(0, 0, 0, 0)),
						startTime: '09:00',
						endTime: '10:30',
						location: '会议室A',
						priority: 1, // 高优先级
						description: '讨论项目进度和下一步计划'
					},
					{
						id: 2,
						title: '学习新技能',
						date: new Date(new Date().setHours(0, 0, 0, 0)),
						startTime: '14:00',
						endTime: '16:00',
						location: '',
						priority: 2, // 中优先级
						description: '学习新的编程语言'
					},
					{
						id: 3,
						title: '健身时间',
						date: new Date(new Date().setHours(0, 0, 0, 0)),
						startTime: '18:30',
						endTime: '19:30',
						location: '健身房',
						priority: 3, // 低优先级
						description: '进行有氧运动和力量训练'
					}
				]
			}
		},
		computed: {
			selectedDateFormatted() {
				const year = this.selectedDate.getFullYear();
				const month = this.selectedDate.getMonth() + 1;
				const day = this.selectedDate.getDate();
				const weekday = this.weekdays[this.selectedDate.getDay()];
				return `${year}年${month}月${day}日 星期${weekday}`;
			},
			selectedDayEvents() {
				return this.events.filter(event => 
					this.isSameDay(event.date, this.selectedDate)
				).sort((a, b) => {
					// 按时间排序
					return a.startTime.localeCompare(b.startTime);
				});
			}
		},
		mounted() {
			this.generateCalendar();
		},
		methods: {
			generateCalendar() {
				const year = this.currentYear;
				const month = this.currentMonth;
				
				// 获取当月第一天
				const firstDay = new Date(year, month, 1);
				// 获取当月最后一天
				const lastDay = new Date(year, month + 1, 0);
				
				// 获取当月第一天是星期几
				const firstDayOfWeek = firstDay.getDay();
				
				// 获取上个月的最后几天
				const prevMonthLastDay = new Date(year, month, 0).getDate();
				
				// 日历数组
				const days = [];
				
				// 添加上个月的日期
				for (let i = firstDayOfWeek - 1; i >= 0; i--) {
					const day = prevMonthLastDay - i;
					const date = new Date(year, month - 1, day);
					days.push({
						day,
						date,
						isCurrentMonth: false,
						isToday: this.isSameDay(date, this.today),
						isSelected: this.isSameDay(date, this.selectedDate),
						hasEvents: this.hasEvents(date),
						events: this.getEventsForDay(date)
					});
				}
				
				// 添加当月的日期
				for (let i = 1; i <= lastDay.getDate(); i++) {
					const date = new Date(year, month, i);
					days.push({
						day: i,
						date,
						isCurrentMonth: true,
						isToday: this.isSameDay(date, this.today),
						isSelected: this.isSameDay(date, this.selectedDate),
						hasEvents: this.hasEvents(date),
						events: this.getEventsForDay(date)
					});
				}
				
				// 添加下个月的日期，确保日历有6行
				const daysNeeded = 42 - days.length;
				for (let i = 1; i <= daysNeeded; i++) {
					const date = new Date(year, month + 1, i);
					days.push({
						day: i,
						date,
						isCurrentMonth: false,
						isToday: this.isSameDay(date, this.today),
						isSelected: this.isSameDay(date, this.selectedDate),
						hasEvents: this.hasEvents(date),
						events: this.getEventsForDay(date)
					});
				}
				
				this.calendarDays = days;
			},
			
			isSameDay(date1, date2) {
				return date1.getFullYear() === date2.getFullYear() &&
					   date1.getMonth() === date2.getMonth() &&
					   date1.getDate() === date2.getDate();
			},
			
			hasEvents(date) {
				return this.events.some(event => this.isSameDay(event.date, date));
			},
			
			getEventsForDay(date) {
				return this.events.filter(event => this.isSameDay(event.date, date));
			},
			
			selectDay(day) {
				this.selectedDate = day.date;
				this.calendarDays = this.calendarDays.map(d => ({
					...d,
					isSelected: this.isSameDay(d.date, this.selectedDate)
				}));
			},
			
			prevMonth() {
				if (this.currentMonth === 0) {
					this.currentYear--;
					this.currentMonth = 11;
				} else {
					this.currentMonth--;
				}
				this.generateCalendar();
			},
			
			nextMonth() {
				if (this.currentMonth === 11) {
					this.currentYear++;
					this.currentMonth = 0;
				} else {
					this.currentMonth++;
				}
				this.generateCalendar();
			},
			
			showToday() {
				this.currentYear = this.today.getFullYear();
				this.currentMonth = this.today.getMonth();
				this.selectedDate = new Date(this.today);
				this.generateCalendar();
			},
			
			showAddEvent() {
				uni.showToast({
					title: '添加事件功能开发中',
					icon: 'none'
				});
			},
			
			viewEvent(event) {
				uni.showToast({
					title: '查看事件详情功能开发中',
					icon: 'none'
				});
			},
			
			formatTime(timeString) {
				return timeString;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #e5e7eb;
		background-color: #ffffff;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.header-actions {
		display: flex;
		align-items: center;
	}
	
	.action-btn {
		padding: 12rpx 24rpx;
		border-radius: 30rpx;
		background-color: #f3f4f6;
		color: #4b5563;
		margin-left: 16rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.calendar-header {
		background-color: #ffffff;
		padding: 20rpx 30rpx;
	}
	
	.month-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.month-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.nav-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background-color: #f3f4f6;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.weekdays {
		display: flex;
		justify-content: space-between;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #e5e7eb;
	}
	
	.weekday {
		width: 90rpx;
		text-align: center;
		font-size: 28rpx;
		color: #6b7280;
	}
	
	.calendar-grid {
		display: flex;
		flex-wrap: wrap;
		background-color: #ffffff;
		padding: 0 30rpx 30rpx;
	}
	
	.calendar-day {
		width: 90rpx;
		height: 90rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-top: 16rpx;
	}
	
	.day-number {
		font-size: 28rpx;
		color: #1f2937;
	}
	
	.calendar-day.other-month .day-number {
		color: #d1d5db;
	}
	
	.calendar-day.today {
		background-color: rgba(79, 70, 229, 0.1);
		border-radius: 50%;
	}
	
	.calendar-day.selected {
		background-color: #4f46e5;
		border-radius: 50%;
	}
	
	.calendar-day.selected .day-number {
		color: #ffffff;
	}
	
	.event-indicators {
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 8rpx;
		left: 0;
		right: 0;
	}
	
	.event-dot {
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		margin: 0 2rpx;
	}
	
	.event-dot.priority-1 {
		background-color: #ef4444;
	}
	
	.event-dot.priority-2 {
		background-color: #f59e0b;
	}
	
	.event-dot.priority-3 {
		background-color: #10b981;
	}
	
	.events-container {
		flex: 1;
		background-color: #ffffff;
		margin-top: 16rpx;
		border-radius: 24rpx 24rpx 0 0;
		padding: 30rpx;
		box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.events-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}
	
	.events-date {
		font-size: 32rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.events-count {
		font-size: 28rpx;
		color: #6b7280;
	}
	
	.events-list {
		height: calc(100% - 80rpx);
	}
	
	.event-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-left: 8rpx solid transparent;
		border-radius: 16rpx;
		margin-bottom: 16rpx;
		background-color: #f9fafb;
	}
	
	.event-item.priority-1 {
		border-left-color: #ef4444;
	}
	
	.event-item.priority-2 {
		border-left-color: #f59e0b;
	}
	
	.event-item.priority-3 {
		border-left-color: #10b981;
	}
	
	.event-time {
		width: 180rpx;
		font-size: 24rpx;
		color: #6b7280;
		display: flex;
		flex-direction: column;
	}
	
	.event-priority {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		margin-top: 8rpx;
	}
	
	.event-priority.priority-1 {
		background-color: #ef4444;
	}
	
	.event-priority.priority-2 {
		background-color: #f59e0b;
	}
	
	.event-priority.priority-3 {
		background-color: #10b981;
	}
	
	.event-content {
		flex: 1;
		margin: 0 20rpx;
	}
	
	.event-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #1f2937;
		margin-bottom: 8rpx;
	}
	
	.event-location {
		font-size: 24rpx;
		color: #6b7280;
		display: flex;
		align-items: center;
	}
	
	.event-location uni-icons {
		margin-right: 4rpx;
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
	}
	
	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 30rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #6b7280;
		margin-bottom: 30rpx;
	}
	
	.add-event-btn {
		background-color: #4f46e5;
		color: #ffffff;
		font-size: 28rpx;
		padding: 16rpx 40rpx;
		border-radius: 40rpx;
		border: none;
	}
</style>
