const dateInput = document.querySelector("#date-input");
const dateButton = document.querySelector("#calendar-button");
const calendar = document.querySelector("#calendar");

// lists
const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// create years button
const monthYearWrapper = document.createElement("div");
monthYearWrapper.classList.add("month-year-wrapper");
const monthButton = document.createElement("div");
monthButton.classList.add("month-year-button");
monthYearWrapper.appendChild(monthButton);
const yearButton = document.createElement("div");
yearButton.classList.add("month-year-button");
monthYearWrapper.appendChild(yearButton);

// create year menu section
const yearsWrapper = document.createElement("div");
yearsWrapper.classList.add("years-wrapper");
const rangeYearButton = document.createElement("div");
rangeYearButton.classList.add("range-year-button");


let selectedDate = null;
let yearsRange = [];

function generateCalendar(year,month){
    console.log(months[month]);
    console.log(year);
    calendar.innerHTML = ""; // clear the calendar
    const daysInMonth = new Date(year,month+1,0).getDate();
    const firstDayIndex = new Date(year,month,1).getDay();

    calendar.appendChild(monthYearWrapper);

    monthButton.innerText = months[month];
    yearButton.innerText = year;
    
    // range start year 
    let yearRangeStart = year - Number(String(year).slice(3,4));
    let yearRange = `${yearRangeStart} - ${yearRangeStart+10}`;
    rangeYearButton.innerHTML = yearRange;
    for(let iYear = yearRangeStart-1;iYear<=yearRangeStart+10;iYear++){
        yearsRange.push(iYear);
    }
    
    // create table structure
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");

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
    calendar.appendChild(monthYearWrapper);
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

// toggle on/off month menu
monthButton.addEventListener("click",()=>{
    // hide calendar days
    calendar.childNodes[1].style.display = "none";
    // create month table element
    const monthsWrapper = document.createElement("div");
    monthsWrapper.classList.add("months-wrapper");
    months.forEach((month,index)=>{
        const monthDiv = document.createElement("div");
        monthDiv.innerText = month.slice(0,3);
        monthsWrapper.appendChild(monthDiv);
        monthDiv.addEventListener("click",()=>{
            generateCalendar(Number(yearButton.innerText),index);
            console.log(calendar.style.display);
        });
    });
    calendar.appendChild(monthsWrapper);
    /* remove year and month buttons and replace with current year button */
    monthButton.style.display = "none";
    yearButton.style.display = "none";
    const currentYearButton = document.createElement("div");
    currentYearButton.innerText = yearButton.innerText;
    monthYearWrapper.appendChild(currentYearButton);
});

// toggle on/off year menu
yearButton.addEventListener("click",()=>{
    // hide calendar days
    calendar.childNodes[1].style.display = "none";
    /* remove year and month buttons and replace with year range button */
    yearButton.style.display = "none";
    monthButton.style.display = "none";
    monthYearWrapper.appendChild(rangeYearButton);
    const yearsWrapper = document.createElement("div");
    yearsWrapper.classList.add("years-wrapper");
    yearsRange.forEach(year=>{
        const yearDiv = document.createElement("div");
        yearDiv.innerText = year;
        yearsWrapper.appendChild(yearDiv);
    });
    calendar.appendChild(yearsWrapper);
});

