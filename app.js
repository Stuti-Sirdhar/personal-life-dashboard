/* ================= TASK MANAGER ================= */

const taskInput = document.getElementById("taskInput")
const addTaskBtn = document.getElementById("addTask")
const taskList = document.getElementById("taskList")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function renderTasks(){

    taskList.innerHTML = ""

    tasks.forEach((task,index)=>{

        const li = document.createElement("li")
        li.textContent = task.text

        if(task.completed){
            li.classList.add("completed")
        }

        li.addEventListener("click",()=>{
            tasks[index].completed = !tasks[index].completed
            saveTasks()
        })

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "X"

        deleteBtn.addEventListener("click",(e)=>{
            e.stopPropagation()
            tasks.splice(index,1)
            saveTasks()
        })

        li.appendChild(deleteBtn)
        taskList.appendChild(li)

    })
}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks))
    renderTasks()
}

addTaskBtn.addEventListener("click",()=>{

    const value = taskInput.value.trim()
    if(value === "") return

    tasks.push({
        text:value,
        completed:false
    })

    taskInput.value = ""
    saveTasks()
})

taskInput.addEventListener("keypress",(e)=>{
    if(e.key === "Enter") addTaskBtn.click()
})

const clearTasksBtn = document.getElementById("clearTasks")

clearTasksBtn.addEventListener("click", ()=>{
tasks = []
saveTasks()
})

renderTasks()



/* ================= NOTES ================= */

const notesArea = document.getElementById("notesArea")
const saveNotesBtn = document.getElementById("saveNotes")

notesArea.value = localStorage.getItem("notes") || ""

saveNotesBtn.addEventListener("click",()=>{
    localStorage.setItem("notes",notesArea.value)
    alert("Notes saved!")
})

notesArea.addEventListener("input",()=>{
    localStorage.setItem("notes",notesArea.value)
})



/* ================= POMODORO TIMER ================= */

const timerDisplay = document.getElementById("timer")
const startBtn = document.getElementById("startTimer")
const resetBtn = document.getElementById("resetTimer")

let time = 1500
let timerInterval = null

function updateTimer(){

    let minutes = Math.floor(time/60)
    let seconds = time % 60

    seconds = seconds < 10 ? "0"+seconds : seconds

    timerDisplay.textContent = `${minutes}:${seconds}`
}

startBtn.addEventListener("click",()=>{

    if(timerInterval) return

    timerInterval = setInterval(()=>{

        if(time <= 0){
            clearInterval(timerInterval)
            timerInterval = null
            alert("Time's up!")
            return
        }

        time--
        updateTimer()

    },1000)

})

resetBtn.addEventListener("click",()=>{

    clearInterval(timerInterval)
    timerInterval = null
    time = 1500

    updateTimer()

})

updateTimer()



/* ================= WEATHER ================= */

const cityInput = document.getElementById("cityInput")
const weatherBtn = document.getElementById("getWeather")
const weatherResult = document.getElementById("weatherResult")

const API_KEY = "2f69eb86bbc8345c7157224a31fb6e95"

weatherBtn.addEventListener("click",async ()=>{

    const city = cityInput.value.trim()
    if(!city) return

    weatherResult.textContent = "Loading..."

    try{

        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )

        if(!response.ok){
            weatherResult.textContent = "City not found"
            return
        }

        const data = await response.json()

        weatherResult.textContent =
        `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`

    }

    catch(error){
        weatherResult.textContent = "Error fetching weather"
    }

})

cityInput.addEventListener("keypress",(e)=>{
    if(e.key === "Enter") weatherBtn.click()
})



/* ================= DAILY QUOTE ================= */

const quoteText = document.getElementById("quoteText")
const newQuoteBtn = document.getElementById("newQuote")

async function getQuote() {

    try {

        const response = await fetch(
            "https://api.allorigins.win/raw?url=https://zenquotes.io/api/random"
        )

        const data = await response.json()

        const quote = data[0].q
        const author = data[0].a

        quoteText.textContent = `"${quote}" — ${author}`

    } catch (error) {

        quoteText.textContent = "Could not load quote."

    }

}

getQuote()

newQuoteBtn.onclick = function () {
    getQuote()
}

/* ================= HABIT TRACKER ================= */

const habitInput = document.getElementById("habitInput")
const addHabitBtn = document.getElementById("addHabit")
const habitList = document.getElementById("habitList")

let habits = JSON.parse(localStorage.getItem("habits")) || []

function renderHabits(){

    habitList.innerHTML = ""

    habits.forEach((habit,index)=>{

        const li = document.createElement("li")

        li.textContent = `${habit.name} 🔥 ${habit.streak}`

        const doneBtn = document.createElement("button")
        doneBtn.textContent = "Done"

        doneBtn.addEventListener("click",()=>{

            const today = new Date().toDateString()

            if(habit.lastDone === today){
                alert("Already completed today!")
                return
            }

            habits[index].streak++
            habits[index].lastDone = today

            saveHabits()
        })

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "X"

        deleteBtn.addEventListener("click",()=>{
            habits.splice(index,1)
            saveHabits()
        })

        li.appendChild(doneBtn)
        li.appendChild(deleteBtn)

        habitList.appendChild(li)

    })
}

function saveHabits(){
    localStorage.setItem("habits",JSON.stringify(habits))
    renderHabits()
}

addHabitBtn.addEventListener("click",()=>{

    const value = habitInput.value.trim()
    if(value === "") return

    habits.push({
        name:value,
        streak:0,
        lastDone:null
    })

    habitInput.value = ""
    saveHabits()

})

habitInput.addEventListener("keypress",(e)=>{
    if(e.key === "Enter") addHabitBtn.click()
})

renderHabits()


/* ================= DRAGGABLE WIDGETS ================= */

const widgets = document.querySelectorAll(".dashboard .widget")
const dashboard = document.querySelector(".dashboard")

widgets.forEach(widget=>{

    widget.addEventListener("dragstart",()=>{
        widget.classList.add("dragging")
    })

    widget.addEventListener("dragend",()=>{
        widget.classList.remove("dragging")
    })

})

dashboard.addEventListener("dragover",(e)=>{

    e.preventDefault()

    const dragging = document.querySelector(".dragging")
    const afterElement = getDragAfterElement(dashboard,e.clientY)

    if(afterElement == null){
        dashboard.appendChild(dragging)
    }
    else{
        dashboard.insertBefore(dragging,afterElement)
    }

})

function getDragAfterElement(container,y){

    const elements = [...container.querySelectorAll(".widget:not(.dragging)")]

    return elements.reduce((closest,child)=>{

        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height/2

        if(offset < 0 && offset > closest.offset){
            return {offset:offset,element:child}
        }else{
            return closest
        }

    },{offset:Number.NEGATIVE_INFINITY}).element

}



/* ================= CLOCK + GREETING ================= */

const clock = document.getElementById("clock")
const greeting = document.getElementById("greeting")

function updateClock(){

    const now = new Date()

    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2,"0")
    const seconds = String(now.getSeconds()).padStart(2,"0")

    clock.textContent = `${hours}:${minutes}:${seconds}`

    if(hours >= 5 && hours < 12){
        greeting.textContent = "Good Morning ☀️"
    }
    else if(hours >= 12 && hours < 17){
        greeting.textContent = "Good Afternoon 🌤"
    }
    else if(hours >= 17 && hours < 22){
        greeting.textContent = "Good Evening 🌆"
    }
    else{
        greeting.textContent = "Good Night 🌙"
    }
}

setInterval(updateClock,1000)
updateClock()



/* ================= THEME TOGGLE ================= */

const themeBtn = document.getElementById("themeToggle")

if(localStorage.getItem("theme") === "light"){
    document.body.classList.add("light-mode")
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("light-mode")

    if(document.body.classList.contains("light-mode")){
        localStorage.setItem("theme","light")
    }
    else{
        localStorage.setItem("theme","dark")
    }

})