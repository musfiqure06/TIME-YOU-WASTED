/**
 * TIME YOU WASTED
 * A cinematic experience that visualizes digital time consumption
 * 
 * Key Features:
 * - Animated sliders with visual feedback
 * - Counter animations with easing
 * - Progress ring visualization
 * - Timeline animation
 * - Smooth transitions between sections
 */

// DOM Elements
const phoneSlider = document.getElementById('phone-slider');
const socialSlider = document.getElementById('social-slider');
const entertainmentSlider = document.getElementById('entertainment-slider');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const inputSection = document.querySelector('.input-section');
const resultSection = document.querySelector('.result-section');

// Result Elements
const totalHoursCounter = document.getElementById('total-hours-counter');
const daysCounter = document.getElementById('days-counter');
const percentageValue = document.getElementById('percentage-value');
const finalDays = document.getElementById('final-days');
const finalMessage = document.getElementById('final-message');
const progressRing = document.querySelector('.progress-ring-circle');
const timelineFilled = document.getElementById('timeline-filled');

// Constants
const DAYS_IN_YEAR = 365;
const HOURS_IN_DAY = 24;
const HOURS_IN_YEAR = DAYS_IN_YEAR * HOURS_IN_DAY;
const CIRCUMFERENCE = 2 * Math.PI * 90; // For the progress ring

// Animation state
let isAnimating = false;

/**
 * Initialize the application
 */
function init() {
    // Initialize slider values display
    updateSliderValue('phone', parseFloat(phoneSlider.value));
    updateSliderValue('social', parseFloat(socialSlider.value));
    updateSliderValue('entertainment', parseFloat(entertainmentSlider.value));

    // Initialize slider fill widths
    updateSliderFill('phone', phoneSlider);
    updateSliderFill('social', socialSlider);
    updateSliderFill('entertainment', entertainmentSlider);

    // Set up event listeners
    setupEventListeners();

    // Initial calculation for immediate feedback
    updateResults();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Slider input events
    phoneSlider.addEventListener('input', () => {
        const value = parseFloat(phoneSlider.value);
        updateSliderValue('phone', value);
        updateSliderFill('phone', phoneSlider);
    });

    socialSlider.addEventListener('input', () => {
        const value = parseFloat(socialSlider.value);
        updateSliderValue('social', value);
        updateSliderFill('social', socialSlider);
    });

    entertainmentSlider.addEventListener('input', () => {
        const value = parseFloat(entertainmentSlider.value);
        updateSliderValue('entertainment', value);
        updateSliderFill('entertainment', entertainmentSlider);
    });

    // Calculate button
    calculateBtn.addEventListener('click', handleCalculate);

    // Reset button
    resetBtn.addEventListener('click', handleReset);
}

/**
 * Update the displayed value for a slider
 * @param {string} type - The slider type (phone, social, entertainment)
 * @param {number} value - The current slider value
 */
function updateSliderValue(type, value) {
    const valueElement = document.querySelector(`[data-value="${type}"]`);
    if (valueElement) {
        valueElement.textContent = value.toFixed(1);
    }
}

/**
 * Update the visual fill for a slider track
 * @param {string} type - The slider type
 * @param {HTMLElement} slider - The slider element
 */
function updateSliderFill(type, slider) {
    const fillElement = document.querySelector(`[data-slider="${type}"]`);
    if (fillElement) {
        const percentage = (parseFloat(slider.value) / parseFloat(slider.max)) * 100;
        fillElement.style.width = `${percentage}%`;
    }
}

/**
 * Handle calculate button click
 */
function handleCalculate() {
    if (isAnimating) return;

    isAnimating = true;

    // Calculate results
    const results = calculateResults();

    // Switch to results section
    switchToResults();

    // Animate results after a short delay
    setTimeout(() => {
        animateResults(results);
    }, 500);
}

/**
 * Calculate all results based on current slider values
 * @returns {Object} - The calculated results
 */
function calculateResults() {
    const phoneHours = parseFloat(phoneSlider.value);
    const socialHours = parseFloat(socialSlider.value);
    const entertainmentHours = parseFloat(entertainmentSlider.value);

    // Calculate daily and yearly totals
    const dailyTotal = phoneHours + socialHours + entertainmentHours;
    const yearlyHours = dailyTotal * DAYS_IN_YEAR;
    const daysLost = yearlyHours / HOURS_IN_DAY;
    const percentage = (yearlyHours / HOURS_IN_YEAR) * 100;

    return {
        yearlyHours,
        daysLost,
        percentage
    };
}

/**
 * Switch from input section to results section
 */
function switchToResults() {
    // Add active class to results section with animation
    resultSection.classList.add('active');

    // Scroll to results section smoothly
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Animate all result visualizations
 * @param {Object} results - The calculated results
 */
function animateResults(results) {
    const { yearlyHours, daysLost, percentage } = results;

    // Animate counters
    animateCounter(totalHoursCounter, 0, yearlyHours, 2000, 'hours');
    animateCounter(daysCounter, 0, daysLost, 2000, 'days');
    animateCounter(percentageValue, 0, percentage, 2000, 'percentage');

    // Animate progress ring
    animateProgressRing(percentage);

    // Animate timeline
    animateTimeline(percentage);

    // Update final message after animation completes
    setTimeout(() => {
        finalDays.textContent = Math.round(daysLost);
        isAnimating = false;
    }, 2500);
}

/**
 * Animate a counter from start to end value
 * @param {HTMLElement} element - The counter element
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 * @param {string} type - Counter type for formatting
 */
function animateCounter(element, start, end, duration, type) {
    const startTime = performance.now();
    const decimalPlaces = type === 'percentage' ? 1 : 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use easing function for smoother animation
        const easedProgress = easeOutCubic(progress);
        const currentValue = start + (end - start) * easedProgress;

        // Update element with formatted value
        if (type === 'percentage') {
            element.textContent = `${currentValue.toFixed(decimalPlaces)}%`;
        } else {
            element.textContent = Math.round(currentValue).toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Easing function for smooth animations
 * @param {number} t - Progress (0-1)
 * @returns {number} - Eased progress
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * Animate the progress ring visualization
 * @param {number} percentage - The percentage to animate to
 */
function animateProgressRing(percentage) {
    // Calculate stroke offset based on percentage
    const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

    // Set the stroke-dashoffset with transition
    progressRing.style.strokeDashoffset = offset;

    // For browsers that don't support CSS transitions on SVG
    const startTime = performance.now();
    const duration = 2000;
    const startOffset = CIRCUMFERENCE;
    const endOffset = offset;

    function animateRing(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentOffset = startOffset + (endOffset - startOffset) * easedProgress;

        progressRing.style.strokeDashoffset = currentOffset;

        if (progress < 1) {
            requestAnimationFrame(animateRing);
        }
    }

    requestAnimationFrame(animateRing);
}

// Add to the init function or create a new function
function handleResize() {
    const percentage = parseFloat(percentageValue.textContent);
    if (!isNaN(percentage)) {
        animateProgressRing(percentage);
    }
}


// Replace the CIRCUMFERENCE constant with a function that calculates based on screen size
function getCircumference() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    if (isSmallMobile) {
        return 2 * Math.PI * 58; // Radius for very small screens
    } else if (isMobile) {
        return 2 * Math.PI * 68; // Radius for tablets/small screens
    } else {
        return 2 * Math.PI * 90; // Default radius for desktop
    }
}

// Then update the animateProgressRing function:
function animateProgressRing(percentage) {
    const circumference = getCircumference(); // Use the dynamic circumference

    // Calculate stroke offset based on percentage
    const offset = circumference - (percentage / 100) * circumference;

    // ... rest of the function remains the same
}

// Add resize event listener
window.addEventListener('resize', handleResize);

/**
 * Animate the timeline visualization
 * @param {number} percentage - The percentage to animate to
 */
function animateTimeline(percentage) {
    const startTime = performance.now();
    const duration = 2000;
    const startWidth = 0;
    const endWidth = percentage;

    function animateTimelineWidth(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentWidth = startWidth + (endWidth - startWidth) * easedProgress;

        timelineFilled.style.width = `${currentWidth}%`;

        if (progress < 1) {
            requestAnimationFrame(animateTimelineWidth);
        }
    }

    requestAnimationFrame(animateTimelineWidth);
}

/**
 * Handle reset button click
 */
function handleReset() {
    // Reset sliders to default values
    phoneSlider.value = 3;
    socialSlider.value = 2;
    entertainmentSlider.value = 1.5;

    // Update slider displays
    updateSliderValue('phone', 3);
    updateSliderValue('social', 2);
    updateSliderValue('entertainment', 1.5);
    updateSliderFill('phone', phoneSlider);
    updateSliderFill('social', socialSlider);
    updateSliderFill('entertainment', entertainmentSlider);

    // Hide results section
    resultSection.classList.remove('active');

    // Scroll back to input section
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Reset final message
    finalDays.textContent = '0';
}

/**
 * Update results in real-time as sliders change
 * This provides immediate feedback without animation
 */
function updateResults() {
    const results = calculateResults();

    // Update counters without animation
    totalHoursCounter.textContent = Math.round(results.yearlyHours).toLocaleString();
    daysCounter.textContent = Math.round(results.daysLost);
    percentageValue.textContent = `${results.percentage.toFixed(1)}%`;
    finalDays.textContent = Math.round(results.daysLost);

    // Update progress ring without animation
    const offset = CIRCUMFERENCE - (results.percentage / 100) * CIRCUMFERENCE;
    progressRing.style.strokeDashoffset = offset;

    // Update timeline without animation
    timelineFilled.style.width = `${results.percentage}%`;
}

// Add event listeners for real-time updates (optional)
phoneSlider.addEventListener('input', updateResults);
socialSlider.addEventListener('input', updateResults);
entertainmentSlider.addEventListener('input', updateResults);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add scroll-based animations
document.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.result-card, .timeline-container, .final-message-container');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight * 0.85) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Set initial styles for scroll animations
window.addEventListener('load', function() {
    const elements = document.querySelectorAll('.result-card, .timeline-container, .final-message-container');

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s var(--transition-slow), transform 0.8s var(--transition-slow)';
    });
});