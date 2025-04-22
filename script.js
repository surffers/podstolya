document.addEventListener('DOMContentLoaded', function() {
    // Timer functionality
    function updateTimer() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59);
        const timeLeft = endOfDay - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        document.getElementById('timer').textContent =
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Quiz functionality
    let currentStep = 1;
    const totalSteps = 4;
    const quizData = {};
    
    function updateQuizStep() {
        document.querySelectorAll('.quiz-step').forEach(step => step.classList.add('hidden'));
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('hidden');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
        nextBtn.textContent = currentStep === totalSteps ? 'Получить результат' : 'Далее';
        nextBtn.innerHTML = currentStep === totalSteps ? 'Получить результат' : 'Далее<i class="ri-arrow-right-s-line ml-2"></i>';
    }
    
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateQuizStep();
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const selectedOption = currentStepElement.querySelector('input[type="radio"]:checked');
        if (!selectedOption && currentStep !== 'result') {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="ri-error-warning-line text-2xl text-red-500"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Выберите вариант</h3>
                        <p class="text-gray-600 mb-6">Пожалуйста, выберите один из вариантов ответа</p>
                        <button class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('button').onclick = () => modal.remove();
            return;
        }
        
        if (currentStep === totalSteps) {
            currentStep = 'result';
            // Calculate price based on quiz answers
            let basePrice = 12500;
            if (quizData.room === 'office') basePrice += 2000;
            if (quizData.type === 'work') basePrice += 1500;
            if (quizData.size === 'custom') basePrice += 3000;
            if (quizData.timing === 'now') basePrice -= 1000;
            document.getElementById('quizPrice').textContent = basePrice.toLocaleString('ru-RU') + ' ₽';
        } else if (currentStep === 'result') {
            openModal('orderModal');
            return;
        } else {
            quizData[selectedOption.name] = selectedOption.value;
            currentStep++;
        }
        updateQuizStep();
    });
    
    // Initialize quiz
    updateQuizStep();
    
    // Add radio button handlers
    document.querySelectorAll('#quiz input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const labels = this.closest('.grid').querySelectorAll('label');
            labels.forEach(label => label.classList.remove('border-primary'));
            this.closest('label').classList.add('border-primary');
        });
    });
    
    // Slider functionality
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = sliderWrapper.querySelectorAll('img');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    const slideWidth = 100; // percentage
    
    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('bg-white', index === currentSlide);
            dot.classList.toggle('bg-white/50', index !== currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto slide every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause auto slide on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const answer = this.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            answer.classList.toggle('hidden');
            icon.style.transform = answer.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Функции для модальных окон
    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Закрытие модальных окон при клике вне содержимого
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Обработка радиокнопок
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        // Инициализация
        if (radio.checked) {
            const checkedDiv = radio.parentElement.querySelector('.radio-checked');
            if (checkedDiv) checkedDiv.classList.remove('hidden');
            radio.parentElement.classList.add('border-primary');
        }
        
        radio.addEventListener('change', function() {
            // Сбросить все в группе
            const name = this.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                const checkedDiv = r.parentElement.querySelector('.radio-checked');
                if (checkedDiv) checkedDiv.classList.add('hidden');
                r.parentElement.classList.remove('border-primary');
            });
            
            // Выделить выбранный
            if (this.checked) {
                const checkedDiv = this.parentElement.querySelector('.radio-checked');
                if (checkedDiv) checkedDiv.classList.remove('hidden');
                this.parentElement.classList.add('border-primary');
            }
        });
    });
    
    // Калькулятор цены
    const calcForm = document.getElementById('calcForm');
    if (calcForm) {
        const calcPrice = document.getElementById('calcPrice');
        const calcLength = document.getElementById('calcLength');
        const calcWidth = document.getElementById('calcWidth');
        const calcHeight = document.getElementById('calcHeight');
        
        const updatePrice = function() {
            const length = parseInt(calcLength.value) || 700;
            const width = parseInt(calcWidth.value) || 700;
            const height = parseInt(calcHeight.value) || 750;
            // Простая формула расчета цены
            let basePrice = (length * width * height) / 30000;
            // Округление до сотен
            basePrice = Math.ceil(basePrice / 100) * 100;
            calcPrice.textContent = basePrice.toLocaleString('ru-RU') + ' ₽';
        };
        
        calcLength.addEventListener('input', updatePrice);
        calcWidth.addEventListener('input', updatePrice);
        calcHeight.addEventListener('input', updatePrice);
        
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            closeModal('calcModal');
            openModal('orderModal');
        });
    }
    
    // Функция для отправки данных в Telegram бота
    async function sendToTelegram(formData) {
        const BOT_TOKEN = '6731114231:AAGzev_SCeljR5txCCCJPxYRJC4XFgk71_8'; // Замените на токен вашего бота
        const CHAT_ID = '791374398'; // Замените на ваш chat ID или имя канала
        
        // Формируем текст сообщения
        let messageText = '📌 Новая заявка с сайта:\n\n';
        
        for (const [key, value] of Object.entries(formData)) {
            // Пропускаем пустые значения
            if (!value) continue;
            
            // Добавляем поле в сообщение
            messageText += `🔹 <b>${key}:</b> ${value}\n`;
        }
        
        // Добавляем информацию о времени
        const now = new Date();
        messageText += `\n⏱ <i>${now.toLocaleString('ru-RU')}</i>`;
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: messageText,
                    parse_mode: 'HTML'
                })
            });
            
            const result = await response.json();
            if (!result.ok) {
                console.error('Ошибка отправки в Telegram:', result);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Ошибка при отправке в Telegram:', error);
            return false;
        }
    }
    
    // Обработка форм
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Добавляем данные из квиза, если они есть
            if (Object.keys(quizData).length > 0) {
                formObject.quizData = JSON.stringify(quizData);
            }
            
            // Отправка данных в Telegram
            const isSent = await sendToTelegram(formObject);
            
            if (isSent) {
                // Сообщение об успешной отправке
                const successModal = document.createElement('div');
                successModal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
                successModal.innerHTML = `
                    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="ri-checkbox-circle-line text-2xl text-green-500"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Спасибо!</h3>
                            <p class="text-gray-600 mb-6">Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.</p>
                            <button class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(successModal);
                successModal.querySelector('button').onclick = () => {
                    successModal.remove();
                    // Закрытие модального окна, если форма в модальном окне
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                };
            } else {
                // Сообщение об ошибке
                const errorModal = document.createElement('div');
                errorModal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
                errorModal.innerHTML = `
                    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <div class="text-center">
                            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="ri-error-warning-line text-2xl text-red-500"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ошибка!</h3>
                            <p class="text-gray-600 mb-6">Не удалось отправить заявку. Пожалуйста, попробуйте позже или свяжитесь с нами другим способом.</p>
                            <button class="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(errorModal);
                errorModal.querySelector('button').onclick = () => errorModal.remove();
            }
            
            // Очистка формы
            this.reset();
        });
    });
});