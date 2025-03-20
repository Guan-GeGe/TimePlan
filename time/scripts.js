// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleText = themeToggle.querySelector('span');
    const themeToggleIcon = themeToggle.querySelector('i');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleText.textContent = '切换亮色模式';
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
    }
    
    // 主题切换事件
    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeToggleText.textContent = '切换亮色模式';
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleText.textContent = '切换暗色模式';
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        }
    });
    
    // 更新所有iframe中的状态栏时间
    updateStatusBarTime();
    setInterval(updateStatusBarTime, 60000); // 每分钟更新一次
});

// 更新状态栏时间
function updateStatusBarTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const statusBarTimes = document.querySelectorAll('.status-bar-time');
    statusBarTimes.forEach(element => {
        element.textContent = timeString;
    });
}

// 为每个iframe页面传递主题信息
window.addEventListener('message', function(event) {
    if (event.data === 'getTheme') {
        const isDark = document.documentElement.classList.contains('dark');
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.contentWindow.postMessage({ theme: isDark ? 'dark' : 'light' }, '*');
        });
    }
});

// 页面加载完成后，更新iframe中的主题
window.addEventListener('load', function() {
    setTimeout(function() {
        const isDark = document.documentElement.classList.contains('dark');
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.contentWindow.postMessage({ theme: isDark ? 'dark' : 'light' }, '*');
        });
    }, 1000);
});
