// ===== ОСНОВНОЙ JAVASCRIPT ФАЙЛ =====

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initSmoothScrolling();
    initFormHandling();
    initAnimations();
    initMobileMenu();
    initCodeCopyButtons();
    initImageErrorHandling();
});

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== ОБРАБОТКА ФОРМ =====
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получение данных формы
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Простая валидация
            if (!name || !email || !message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Имитация отправки формы
            showNotification('Спасибо за ваше сообщение! Я свяжусь с вами в ближайшее время.', 'success');
            this.reset();
        });
    }
}

// ===== ВАЛИДАЦИЯ EMAIL =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Цвета в зависимости от типа
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Добавление в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое удаление
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Анимация для карточек
    const cards = document.querySelectorAll('.experience-card, .service-card, .contact-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const navList = nav?.querySelector('.nav-list');
    
    if (!nav || !navList) return;
    
    // Проверяем, нужно ли мобильное меню
    const needsMobileMenu = () => window.innerWidth <= 768;
    
    // Создание кнопки мобильного меню
    let menuButton = document.querySelector('.mobile-menu-button');
    
    if (needsMobileMenu() && !menuButton) {
        menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-button';
        menuButton.innerHTML = '☰';
        menuButton.setAttribute('aria-label', 'Открыть меню');
        menuButton.style.cssText = `
            display: block;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 4px;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        nav.style.position = 'relative';
        nav.appendChild(menuButton);
        
        // Стили для мобильного меню
        navList.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #2c3e50;
            flex-direction: column;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999;
            border-radius: 0 0 8px 8px;
        `;
        
        // Обработчик клика
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = navList.style.display === 'flex';
            navList.style.display = isVisible ? 'none' : 'flex';
            menuButton.innerHTML = isVisible ? '☰' : '✕';
            menuButton.setAttribute('aria-label', isVisible ? 'Открыть меню' : 'Закрыть меню');
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && navList.style.display === 'flex') {
                navList.style.display = 'none';
                menuButton.innerHTML = '☰';
                menuButton.setAttribute('aria-label', 'Открыть меню');
            }
        });
        
        // Закрытие меню при клике на ссылку
        navList.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navList.style.display = 'none';
                menuButton.innerHTML = '☰';
                menuButton.setAttribute('aria-label', 'Открыть меню');
            }
        });
        
    } else if (!needsMobileMenu() && menuButton) {
        // Удаляем мобильное меню на больших экранах
        menuButton.remove();
        navList.style.cssText = '';
    }
}

// ===== КНОПКИ КОПИРОВАНИЯ КОДА =====
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.practice-code pre code');
    
    codeBlocks.forEach(block => {
        // Проверяем, не добавлена ли уже кнопка
        if (block.parentElement.querySelector('.copy-code-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '📋';
        button.title = 'Копировать код';
        button.setAttribute('aria-label', 'Копировать код');
        
        const codeContainer = block.parentElement;
        codeContainer.style.position = 'relative';
        codeContainer.appendChild(button);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const text = block.textContent;
            
            // Fallback для старых браузеров
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopySuccess(button);
                }).catch(() => {
                    fallbackCopyTextToClipboard(text, button);
                });
            } else {
                fallbackCopyTextToClipboard(text, button);
            }
        });
    });
}

// Fallback функция для копирования
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        } else {
            showNotification('Не удалось скопировать код', 'error');
        }
    } catch (err) {
        showNotification('Не удалось скопировать код', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Показать успешное копирование
function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '✓';
    button.style.background = 'rgba(76, 175, 80, 0.8)';
    button.style.borderColor = 'rgba(76, 175, 80, 0.8)';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = 'rgba(255,255,255,0.15)';
        button.style.borderColor = 'rgba(255,255,255,0.2)';
    }, 2000);
}

// ===== ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ =====
function initImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Заменяем сломанные изображения на иконки
            if (this.src.includes('github-mark.png')) {
                this.style.display = 'none';
                this.parentElement.innerHTML = '🐙';
            } else if (this.src.includes('telegram.png')) {
                this.style.display = 'none';
                this.parentElement.innerHTML = '💬';
            } else if (this.src.includes('photo.jpg')) {
                this.style.display = 'none';
                this.parentElement.innerHTML = '👤';
            } else {
                this.style.display = 'none';
                this.parentElement.innerHTML = '🖼️';
            }
        });
    });
}

// ===== УТИЛИТЫ =====

// Функция для форматирования даты
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('ru-RU', options);
}

// Функция для дебаунса
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Обработка изменения размера окна
window.addEventListener('resize', debounce(function() {
    // Переинициализация мобильного меню при изменении размера
    initMobileMenu();
}, 250));

// ===== ЭКСПОРТ ФУНКЦИЙ ДЛЯ ИСПОЛЬЗОВАНИЯ В КОНСОЛИ =====
window.PortfolioUtils = {
    showNotification,
    formatDate,
    isValidEmail
};
