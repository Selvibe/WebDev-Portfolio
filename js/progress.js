const checkboxes = document.querySelectorAll('.task-check');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressSteps = document.querySelectorAll('.progress-steps span');

const TOTAL_TASKS = checkboxes.length;
const STORAGE_KEY = 'tasksProgress';

/* загрузка */
const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

checkboxes.forEach(cb => {
    cb.checked = !!savedProgress[cb.dataset.task];
});

updateProgress();

/* сохранение */
checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        savedProgress[cb.dataset.task] = cb.checked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProgress));
        updateProgress();
    });
});

function updateProgress() {
    const completed = [...checkboxes].filter(cb => cb.checked).length;
    const percent = Math.round((completed / TOTAL_TASKS) * 100);

    progressFill.style.width = percent + '%';
    progressFill.parentElement.dataset.percent = percent + '%';

    progressText.textContent =
        `Выполнено заданий: ${completed} из ${TOTAL_TASKS}`;

    progressSteps.forEach((step, index) => {
        step.classList.toggle('active', index < completed);
    });
}
