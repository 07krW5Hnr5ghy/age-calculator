const dateInput = document.querySelector("#date-input");
const dateButton = document.querySelector("#calendar-button");
const calendar = document.querySelector("#calendar");

// lists
const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// create years button
const yearWrapper = document.createElement("div");
const yearButton = document.createElement("button");

// create year-month menu
const yearMonthWrapper = document.createElement("div");
yearMonthWrapper.style.display = "none";
yearMonthWrapper.classList.add("year-month-wrapper");

// create table structure
const table = document.createElement("table");
const headerRow = document.createElement("tr");

// create month and year selector
const yearSelector = document.createElement("div");
const monthSelector = document.createElement("div");

yearWrapper.classList.add("year-wrapper");
yearButton.classList.add("year-button");

yearButton.setAttribute("type","button");
yearWrapper.appendChild(yearButton);

monthSelector.classList.add("month-selector");
yearSelector.classList.add("year-selector");

yearMonthWrapper.appendChild(monthSelector);
yearMonthWrapper.appendChild(yearSelector);

// month selector left button
const leftMonthButton = document.createElement("button");
leftMonthButton.classList.add("month-button");
leftMonthButton.innerText = "<";
monthSelector.appendChild(leftMonthButton);
const rightMonthButton = document.createElement("button");
rightMonthButton.innerText = ">";
rightMonthButton.classList.add("month-button");



let selectedDate = null;

function generateCalendar(year,month){
    calendar.innerHTML = ""; // clear the calendar
    const daysInMonth = new Date(year,month+1,0).getDate();
    console.log(daysInMonth);
    const firstDayIndex = new Date(year,month,1).getDay();
    console.log(firstDayIndex);

    calendar.appendChild(yearWrapper);
    calendar.appendChild(yearMonthWrapper);

    yearButton.innerText = `${months[month]} ${year}`;

    // populate month selector
    for(let monthIndex = month-2,cycle = 0;cycle<5;cycle++){
        const monthDiv = document.createElement("div");
        if(monthIndex===12){
            monthIndex = 0;
        }
        monthDiv.innerText = months[monthIndex];
        monthSelector.appendChild(monthDiv);
        monthIndex++;
    }
    monthSelector.appendChild(rightMonthButton);
    // add week day names
    daysOfWeek.forEach(day=>{
        const th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // add blank cells for days before the 1st
    let row = document.createElement("tr");
    for(let i = 0;i < firstDayIndex;i++){
        const cell = document.createElement("td");
        row.appendChild(cell);
    }

    // add days of the month
    for(let day = 1;day<=daysInMonth;day++){
        if(row.children.length === 7){
            table.appendChild(row);
            row = document.createElement("tr");
        }
        const cell = document.createElement("td");
        cell.textContent = day;

        // Highlight the selected date
        if(
            selectedDate && 
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day
        ){
            cell.classList.add("current-date");
        }

        cell.addEventListener("click",()=>{
            selectedDate = new Date(year,month,day);
            dateInput.value = selectedDate.toISOString().split("T")[0];
            calendar.style.display = "none"; // Hide the calendar
            generateCalendar(year,month); // Re-render calendar
        });

        row.appendChild(cell);
    }


    table.appendChild(row); // add the last row
    calendar.appendChild(table);
}

// show / hide calendar
dateButton.addEventListener("click",()=>{
    if(calendar.style.display === "block"){
        calendar.style.display = "none";
    }else{
        const today = new Date();
        generateCalendar(today.getFullYear(), today.getMonth());
        calendar.style.display = "block";
    }
});

// toggle on/off year month menu
yearButton.addEventListener("click",()=>{
    if(yearMonthWrapper.style.display === "block"){
        console.log("click1");
        yearMonthWrapper.style.display = "none";
        table.style.display = "block";
    }
    if(yearMonthWrapper.style.display === "none"){
        console.log("click2");
        table.style.display = "none";
        yearMonthWrapper.style.display = "block";
        yearMonthWrapper.classList.add("year-month-wrapper");
    }
});

// close the calendar when clicking outside
document.addEventListener("click",(event)=>{
    if(!event.target.closest(".date-wrapper")){
        calendar.style.display = "none";
    }
});

