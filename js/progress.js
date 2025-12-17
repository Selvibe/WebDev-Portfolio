const checkboxes = document.querySelectorAll('.task-check');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

const TOTAL_TASKS = checkboxes.length;

// восстановление состояния
checkboxes.forEach(cb => {
    const saved = localStorage.getItem(cb.dataset.task);
    cb.checked = saved === 'true';
});

updateProgress();

checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        localStorage.setItem(cb.dataset.task, cb.checked);
        updateProgress();
    });
});



function updateProgress() {
    const completed = [...checkboxes].filter(cb => cb.checked).length;
    const percent = (completed / TOTAL_TASKS) * 60;

    progressFill.style.width = percent + '%';
    progressText.textContent = `Выполнено заданий: ${completed} из ${TOTAL_TASKS}`;
}
