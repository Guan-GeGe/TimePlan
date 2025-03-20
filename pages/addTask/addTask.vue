<template>
	<view class="container">
		<view class="header">
			<text class="header-title">添加任务</text>
		</view>
		
		<view class="form-container">
			<view class="form-group">
				<text class="label">任务名称</text>
				<input class="input" v-model="taskTitle" placeholder="请输入任务名称" />
			</view>
			
			<view class="form-group">
				<text class="label">任务类别</text>
				<view class="category-selector">
					<view 
						v-for="(category, index) in categories" 
						:key="index"
						:class="['category-tag', selectedCategory === category ? 'active' : '']"
						@tap="selectCategory(category)"
					>
						<text>{{category}}</text>
					</view>
				</view>
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
						<uni-icons :type="item.icon" size="16" :color="selectedPriority === index ? '#ffffff' : '#6b7280'"></uni-icons>
						<text>{{item.label}}</text>
					</view>
				</view>
			</view>

			<view class="form-group">
				<text class="label">截止日期</text>
				<view class="date-picker" @tap="openDatePicker">
					<text class="date-text">{{dueDate ? formatDate(dueDate) : '选择日期（可选）'}}</text>
					<uni-icons type="calendar" size="16" color="#6b7280"></uni-icons>
				</view>
			</view>
			
			<view class="form-group">
				<text class="label">备注</text>
				<textarea class="textarea" v-model="notes" placeholder="添加备注信息（可选）" />
			</view>
		</view>

		<view class="button-group">
			<button class="cancel-btn" @tap="goBack">取消</button>
			<button class="submit-btn" @tap="submitTask">添加任务</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

// 响应式状态
const taskTitle = ref('');
const duration = ref(25);
const quickTimes = ref([15, 25, 30, 45, 60]);
const selectedPriority = ref(1);
const priorities = ref([
    { label: '低优先级', icon: 'arrow-down' },
    { label: '中优先级', icon: 'minus' },
    { label: '高优先级', icon: 'arrow-up' }
]);
const categories = ref(['工作', '学习', '生活', '会议', '沟通', '重要']);
const selectedCategory = ref('工作');
const dueDate = ref(null);
const notes = ref('');

// 方法
function selectDuration(time) {
    duration.value = time;
}

function selectPriority(index) {
    selectedPriority.value = index;
}

function selectCategory(category) {
    selectedCategory.value = category;
}

function openDatePicker() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    uni.showDatePicker({
        date: dueDate.value ? dueDate.value : `${year}-${month}-${day}`,
        success: (e) => {
            dueDate.value = e.date;
        },
        fail: (e) => {
            console.log(e);
        }
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function goBack() {
    uni.navigateBack();
}

function submitTask() {
    if (!taskTitle.value.trim()) {
        uni.showToast({
            title: '请输入任务名称',
            icon: 'none'
        });
        return;
    }
    
    const newTask = {
        id: Date.now(), // 临时使用时间戳作为ID
        title: taskTitle.value,
        duration: duration.value,
        priority: selectedPriority.value,
        category: selectedCategory.value,
        dueDate: dueDate.value,
        notes: notes.value,
        completed: false,
        createTime: new Date()
    };
    
    // 获取现有任务
    const tasks = uni.getStorageSync('tasks') || [];
    tasks.push(newTask);
    uni.setStorageSync('tasks', tasks);
    
    // 更新树木经验值
    updateTreeExp();
    
    uni.showToast({
        title: '添加成功',
        icon: 'success'
    });
    
    // 返回上一页
    setTimeout(() => {
        uni.navigateBack();
    }, 1000);
}

function updateTreeExp() {
    // 从本地存储获取树木数据
    const treeData = uni.getStorageSync('growingTree') || {
        level: 1,
        experience: 0,
        totalMinutes: 0,
        nextLevelExp: 60
    };
    
    // 添加任务增加1点经验值
    treeData.experience += 1;
    
    // 计算等级提升
    if (treeData.experience >= treeData.nextLevelExp) {
        const levelUp = Math.floor(treeData.experience / treeData.nextLevelExp);
        treeData.level += levelUp;
        treeData.experience = treeData.experience % treeData.nextLevelExp;
    }
    
    // 保存树木数据
    uni.setStorageSync('growingTree', treeData);
}
</script>

<style>
	.container {
		padding: 30rpx;
		background-color: #f9fafb;
		min-height: 100vh;
	}
	
	.header {
		padding: 20rpx 0;
		text-align: center;
		margin-bottom: 30rpx;
	}
	
	.header-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1f2937;
	}
	
	.form-container {
		margin-bottom: 120rpx;
	}
	
	.form-group {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	
	.label {
		font-size: 28rpx;
		color: #4b5563;
		margin-bottom: 20rpx;
		display: block;
		font-weight: 600;
	}
	
	.input {
		width: 100%;
		height: 80rpx;
		border: 1rpx solid #e5e7eb;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		background-color: #ffffff;
	}
	
	.textarea {
		width: 100%;
		height: 160rpx;
		border: 1rpx solid #e5e7eb;
		border-radius: 8rpx;
		padding: 20rpx;
		font-size: 28rpx;
		background-color: #ffffff;
	}
	
	/* 类别选择器 */
	.category-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 20rpx;
	}
	
	.category-tag {
		padding: 12rpx 24rpx;
		background: #f3f4f6;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.category-tag.active {
		background: #4f46e5;
		color: #ffffff;
	}
	
	/* 时长选择 */
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
		color: #6b7280;
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
		background: #f3f4f6;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.time-tag.active {
		background: #4f46e5;
		color: #ffffff;
	}
	
	/* 优先级选择 */
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
		background: #f3f4f6;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #6b7280;
	}
	
	.priority-item:first-child {
		margin-left: 0;
	}
	
	.priority-item:last-child {
		margin-right: 0;
	}
	
	.priority-item.active {
		background: #4f46e5;
		color: #ffffff;
	}
	
	.priority-item uni-icons {
		margin-right: 8rpx;
	}
	
	/* 日期选择器 */
	.date-picker {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		border: 1rpx solid #e5e7eb;
		border-radius: 8rpx;
		padding: 0 20rpx;
		background-color: #ffffff;
	}
	
	.date-text {
		font-size: 28rpx;
		color: #6b7280;
	}
	
	/* 按钮组 */
	.button-group {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.cancel-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #f3f4f6;
		color: #6b7280;
		font-size: 28rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	
	.submit-btn {
		flex: 2;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #4f46e5;
		color: #ffffff;
		font-size: 28rpx;
		border-radius: 8rpx;
	}
</style>