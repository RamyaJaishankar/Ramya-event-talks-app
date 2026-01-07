
document.addEventListener('DOMContentLoaded', () => {
    fetch('talks.json')
        .then(response => response.json())
        .then(talks => {
            const schedule = generateSchedule(talks);
            renderSchedule(schedule);

            document.getElementById('searchInput').addEventListener('input', (e) => {
                renderSchedule(schedule, e.target.value);
            });
        });
});

function generateSchedule(talks) {
    let startTime = new Date();
    startTime.setHours(10, 0, 0, 0);

    const schedule = [];
    let talkIndex = 0;

    for (let i = 0; i < 8; i++) {
        if (i === 3) {
            const lunchBreak = {
                title: "Lunch Break",
                startTime: new Date(startTime),
                endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
                isBreak: true
            };
            schedule.push(lunchBreak);
            startTime.setMinutes(startTime.getMinutes() + 60);
        } else if (talkIndex < talks.length) {
            const talk = talks[talkIndex];
            const talkEvent = {
                ...talk,
                startTime: new Date(startTime),
                endTime: new Date(startTime.getTime() + 60 * 60 * 1000),
                isBreak: false
            };
            schedule.push(talkEvent);
            startTime.setMinutes(startTime.getMinutes() + 60 + 10);
            talkIndex++;
        }
    }
    return schedule;
}

function formatTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderSchedule(scheduleData, filter = '') {
    const scheduleList = document.getElementById('schedule');
    scheduleList.innerHTML = '';
    const filterLower = filter.toLowerCase();

    scheduleData.forEach(item => {
        const isVisible = item.isBreak || (item.categories && item.categories.some(cat => cat.toLowerCase().includes(filterLower)));

        const li = document.createElement('li');
        li.className = 'schedule-item';
        if (!isVisible) {
            li.classList.add('hidden');
        }

        if (item.isBreak) {
            li.innerHTML = `
                <div class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                <div class="details break">
                    <h2>${item.title}</h2>
                </div>
            `;
        } else {
            li.innerHTML = `
                <div class="time">${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
                <div class="details">
                    <h2>${item.title}</h2>
                    <p class="speakers"><strong>Speakers:</strong> ${item.speakers.join(', ')}</p>
                    <p>${item.description}</p>
                    <div class="categories">
                        ${item.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        scheduleList.appendChild(li);
    });
}
