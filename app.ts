interface TimeframeData {
    [key: string]: {
        current: number;
        previous: number;
        random: number;
    };
}

interface TodoItem {
    title: string;
    timeframes: {
        daily: TimeframeData;
        weekly: TimeframeData;
        monthly: TimeframeData;
    };
}

const todoContainer: HTMLDivElement = document.querySelector('.todo');
const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.toggle-button');
let timeTrackingData: TodoItem[] = [];

async function fetchData(): Promise<void> {
    try {
        const response: Response = await fetch('data.json');
        timeTrackingData = (await response.json()).Todo;
        createTopElements();
        initializeTimeTrackingData();
        updateTime('h1');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function createTopElements(): void {
    todoContainer.innerHTML = timeTrackingData.map((item: TodoItem) => `
    <div class="top">
      <div class="work">
        <h2>${item.title}</h2>
        <div class="time">
          <h1>0hrs</h1>
          <p></p>
        </div>
      </div>
    </div>
  `).join('');
}

function updateTime(timeframe: string): void {
    const timePeriodText: { [key: string]: string } = {
        daily: 'Yesterday',
        weekly: 'Last Week',
        monthly: 'Last Month',
    };

    document.querySelectorAll('.top').forEach((currentItem: HTMLDivElement, i: number) => {
        const { title, timeframes } = timeTrackingData[i];
        const { current, previous, random } = timeframes[timeframe];

        const [titleElement, timeElement, previousTimeElement] = currentItem.querySelectorAll('h2, h1, p');

        titleElement.innerHTML = `${title} <i class="fas fa-ellipsis"></i>`;
        timeElement.textContent = `${current + random}hrs`;
        previousTimeElement.textContent = `${timePeriodText[timeframe]} - ${previous + random}hrs`;
    });
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max + min * 2)) + min;
}

function initializeTimeTrackingData(): void {
    timeTrackingData.forEach((entry: TodoItem) => {
        const { timeframes } = entry;
        Object.keys(timeframes).forEach((timeframe: string) => {
            timeframes[timeframe].random = getRandomNumber(0, 10);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    buttons.forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', () => {
            const timeframe: string = button.textContent.toLowerCase();
            updateTime(timeframe);

            buttons.forEach((b: HTMLButtonElement) => b.classList.remove('active'));
            button.classList.add('active');
        });
    });

    fetchData();
});
