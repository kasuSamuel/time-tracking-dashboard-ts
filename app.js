"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const todoContainer = document.querySelector('.todo');
const buttons = document.querySelectorAll('.toggle-button');
let timeTrackingData = [];
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('data.json');
            timeTrackingData = (yield response.json()).Todo;
            createTopElements();
            initializeTimeTrackingData();
            updateTime('h1');
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    });
}
function createTopElements() {
    todoContainer.innerHTML = timeTrackingData.map((item) => `
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
function updateTime(timeframe) {
    const timePeriodText = {
        daily: 'Yesterday',
        weekly: 'Last Week',
        monthly: 'Last Month',
    };
    document.querySelectorAll('.top').forEach((currentItem, i) => {
        const { title, timeframes } = timeTrackingData[i];
        const { current, previous, random } = timeframes[timeframe];
        const [titleElement, timeElement, previousTimeElement] = currentItem.querySelectorAll('h2, h1, p');
        titleElement.innerHTML = `${title} <i class="fas fa-ellipsis"></i>`;
        timeElement.textContent = `${current + random}hrs`;
        previousTimeElement.textContent = `${timePeriodText[timeframe]} - ${previous + random}hrs`;
    });
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max + min * 2)) + min;
}
function initializeTimeTrackingData() {
    timeTrackingData.forEach((entry) => {
        const { timeframes } = entry;
        Object.keys(timeframes).forEach((timeframe) => {
            timeframes[timeframe].random = getRandomNumber(0, 10);
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const timeframe = button.textContent.toLowerCase();
            updateTime(timeframe);
            buttons.forEach((b) => b.classList.remove('active'));
            button.classList.add('active');
        });
    });
    fetchData();
});
