let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const secInput = document.getElementById("secInput");
const periodInput = document.getElementById("periodInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
const alarmClock = document.querySelector(".alarm-clock");
const container = document.querySelector(".container");
activeAlarms.innerHTML = "";
let alarmsArray = [];
let alarmSound = new Audio("./Assets/AlarmSound.mp3");

let initialHour = 0,
    initialMinute = 0,
    initialSec = 0,
    alarmIndex = 0;

//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
    let alarmObject,
        objIndex,
        exists = false;
    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists = true;
            alarmObject = alarm;
            objIndex = index;
            return false;
        }
    });
    
    return [exists, alarmObject, objIndex];
};

//Display Time
function displayTimer() {
    let date = new Date();
    let [hours, minutes, seconds] = [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
    ];

    

    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const NewHours = (formattedHours < 10 ? "0" + formattedHours : formattedHours);
    //Display time
    timerRef.innerHTML = `${NewHours}:${minutes}:${seconds} ${period}`;

    //Alarm
    alarmsArray.forEach((alarm, index) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmSec} ${alarm.period}` === `${NewHours}:${minutes}:${seconds} ${period}`) {
                alarmSound.play();
                alarmSound.loop = true;
                container.classList.add("hide");
                alarmClock.classList.remove("hide");

            }
        }
    });
    
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10) {
        inputValue = appendZero(inputValue);
    }
    return inputValue;
};

hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
    minuteInput.value = inputCheck(minuteInput.value);
});

secInput.addEventListener("input", () => {
    secInput.value = inputCheck(secInput.value);
})

//Create alarm div

const createAlarm = (alarmObj) => {
    //Keys from object
    const { id, alarmHour, alarmMinute, alarmSec, period } = alarmObj;
    //Alarm div
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour} : ${alarmMinute} : ${alarmSec} ${period}</span>`;

    //checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            stopAlarm(e);
        } else {
            startAlarm(e);
        }
        
    });
    alarmDiv.appendChild(checkbox);
    //Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);
    activeAlarms.appendChild(alarmDiv);
    
};

//Set Alarm
setAlarm.addEventListener("click", (e) => {
    if(hourInput.value > 12 || minuteInput.value > 59 || secInput.value > 59){
        alert("Enter the Valid Time");
        return false;
    }
    alarmIndex += 1;

    //alarmObject
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}_${secInput.value}_${periodInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minuteInput.value;
    alarmObj.alarmSec = secInput.value;
    alarmObj.period = periodInput.value;
    alarmObj.isActive = true;
    console.log(alarmObj);
    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
    secInput.value = appendZero(initialSec);
    
});

//Start Alarm
const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = true;
    }
    
};

//Stop alarm
const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();
    }
    
};

//delete alarm
const deleteAlarm = (e) => {
    console.log(`hello`);
    
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);
    }
    
};

//Stop Button
const stopBtn = document.querySelector(".Stop-btn");
stopBtn.addEventListener("click", () => {
    alarmClock.classList.add("hide");
    container.classList.remove("hide");
    alarmSound.pause();
})

//Snooze Button
const snoozeBtn = document.querySelector(".Snooze-btn");
snoozeBtn.addEventListener("click", () => {
    alarmClock.classList.add("hide");
    container.classList.remove("hide");
    alarmSound.pause();
    setTimeout(() => {
        container.classList.add("hide");
        alarmClock.classList.remove("hide");
        alarmSound.play();
    }, 1000*60);
})

window.onload = () => {
    setInterval(displayTimer);
    initialHour = 0;
    initialMinute = 0;
    initialSec = 0;
    alarmIndex = 0;
    alarmsArray = [];
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
    secInput.value = appendZero(initialSec);
};
