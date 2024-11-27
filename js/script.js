import { DateTime,Interval } from "luxon";
const form = document.querySelector("#calculator-wrapper");
const dateInput = document.querySelector("#date-input");
const dateButton = document.querySelector("#calendar-button");
const calendar = document.querySelector("#calendar");
const calculateButton = document.querySelector(".calculate-button");
calculateButton.type = "button";
const answerSpace = document.querySelector(".answer");

// lists
const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// initialize navigation menu
const monthYearWrapper = document.createElement("div");
monthYearWrapper.classList.add("month-year-wrapper");
const yearLeftButton = document.createElement("button");
yearLeftButton.type = "button";
setButtonValue(yearLeftButton,"<<");
monthYearWrapper.appendChild(yearLeftButton);
const monthLeftButton = document.createElement("button");
monthLeftButton.type = "button";
setButtonValue(monthLeftButton,"<");
monthYearWrapper.appendChild(monthLeftButton);
const monthButton = document.createElement("div");
monthButton.classList.add("month-year-button");
monthYearWrapper.appendChild(monthButton);
const yearButton = document.createElement("div");
yearButton.classList.add("month-year-button");
monthYearWrapper.appendChild(yearButton);
const monthRightButton = document.createElement("button");
monthRightButton.type = "button";
setButtonValue(monthRightButton,">");
monthYearWrapper.appendChild(monthRightButton);
const yearRightButton = document.createElement("button");
yearRightButton.type = "button";
setButtonValue(yearRightButton,">>");
monthYearWrapper.appendChild(yearRightButton);

// create year menu section
const yearsWrapper = document.createElement("div");
yearsWrapper.classList.add("years-wrapper");
const rangeYearButton = document.createElement("div");
rangeYearButton.classList.add("range-year-button");

// create month menu section
const monthsWrapper = document.createElement("div");
monthsWrapper.classList.add("months-wrapper");

// year navigation modes
const yearNavigationModes = {
    year:1,
    tenYears:2,
    hundredYears:3,
};

let selectedDate = null;
let yearsRange = [];
let yearsRanges = [];
let yearNavigationModeFlag = yearNavigationModes.year;

// utility functions
function clearChildElements(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

function createYearDiv(year,onClickHandler){
    const yearDiv = document.createElement("div");
    setButtonValue(yearDiv,year);
    yearDiv.addEventListener("click",onClickHandler);
    return yearDiv;
}

function createYearRangeDiv(yearRange,onClickHandler){
    const yearRangeDiv = document.createElement("div");
    setButtonValue(yearRangeDiv,yearRange);
    yearRangeDiv.addEventListener("click",onClickHandler);
    return yearRangeDiv;
}

function generateMonthYearMenu(yearNavigationMode=null){
    if(yearNavigationMode){
        setYearNavigationModeFlag(yearNavigationMode);
    }
    monthYearWrapper.removeChild(rangeYearButton);
    yearButton.style.display = "block";
    monthLeftButton.style.display = "block";
    monthRightButton.style.display = "block";
    monthButton.style.display = "block";
    yearsWrapper.style.display = "none";
}

function setButtonValue(button,value){
    button.innerText = value;
};

function setYearNavigationModeFlag(mode){
    yearNavigationModeFlag = mode;
};

function populateYearRanges(year){
    // ten years range 
    let tenYearRangeStart = year - Number(String(year).slice(3,4));
    let tenYearRange = `${tenYearRangeStart} - ${tenYearRangeStart+10}`;
    yearsRange = [];
    for(let iYear = tenYearRangeStart-1;iYear<=tenYearRangeStart+10;iYear++){
        yearsRange.push(iYear);
    }

    // hundred years range
    let hundredYearRangeStart = year - Number(String(year).slice(2,4));
    let hundredYearRange = `${hundredYearRangeStart} - ${hundredYearRangeStart+100}`;
    yearsRanges = [];
    for(let iYear = hundredYearRangeStart-10;iYear<=hundredYearRangeStart+100;iYear+=10){
        let subRange = `${iYear} - ${iYear+10}`;
        yearsRanges.push(subRange);
    }

    if(yearNavigationModeFlag === yearNavigationModes.tenYears){
        setButtonValue(rangeYearButton,tenYearRange);
    }

    if(yearNavigationModeFlag === yearNavigationModes.hundredYears){
        setButtonValue(rangeYearButton,hundredYearRange);
    }
}

function hideMonthDays(){
    calendar.childNodes[1].style.display = "none";
}

function generateCalendar(year,month){
    calendar.innerHTML = ""; // clear the calendar
    const daysInMonth = new Date(year,month+1,0).getDate();
    const firstDayIndex = new Date(year,month,1).getDay();

    calendar.appendChild(monthYearWrapper);

    setButtonValue(monthButton,months[month]);
    setButtonValue(yearButton,year);

    populateYearRanges(year);

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
            dateInput.value = selectedDate.toISOString().split("T")[0].replaceAll("-","/");
            calendar.style.display = "none"; // Hide the calendar
            generateCalendar(year,month); // Re-render calendar
            setYearNavigationModeFlag(yearNavigationModes.year);
        });

        row.appendChild(cell);
    }

    table.appendChild(row); // add the last row 
    calendar.appendChild(monthYearWrapper); // add the month year menu
    calendar.appendChild(table);  // add table
    calendar.appendChild(yearsWrapper); // add years space
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
    hideMonthDays();
    clearChildElements(monthsWrapper);
    // create month table element
    months.forEach((month,index)=>{
        const monthDiv = document.createElement("div");
        setButtonValue(monthDiv,month.slice(0,3));
        monthsWrapper.appendChild(monthDiv);
        monthDiv.addEventListener("click",()=>{
            generateCalendar(Number(yearButton.innerText),index);

        });
    });
    calendar.appendChild(monthsWrapper);
    // hide month, left month and right month buttons
    monthButton.style.display = "none";
    monthLeftButton.style.display = "none";
    monthRightButton.style.display = "none";
    monthsWrapper.style.display = "flex";
});

// toggle on/off year menu
yearButton.addEventListener("click",()=>{
    // hide calendar days
    hideMonthDays();
    /* remove year and month buttons and replace with year range button */
    yearButton.style.display = "none";
    monthButton.style.display = "none";
    monthLeftButton.style.display = "none";
    monthRightButton.style.display = "none";
    monthsWrapper.style.display = "none";
    monthYearWrapper.removeChild(yearRightButton);
    monthYearWrapper.appendChild(rangeYearButton);
    monthYearWrapper.appendChild(yearRightButton);
    yearsWrapper.style.display = "flex";
    clearChildElements(yearsWrapper);
    yearsRange.forEach(year=>{
        yearsWrapper.appendChild(createYearDiv(year,()=>{
            generateCalendar(year,months.indexOf(monthButton.innerText));
            generateMonthYearMenu(yearNavigationModeFlag.year);
            setButtonValue(yearButton,year);
        }));
    });
    calendar.appendChild(yearsWrapper);
    setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
    setYearNavigationModeFlag(yearNavigationModes.tenYears);
});

// enter range years mode
rangeYearButton.addEventListener("click",()=>{
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        clearChildElements(yearsWrapper);
        yearsRanges.forEach(yearRange=>{
            yearsWrapper.appendChild(createYearRangeDiv(yearRange,()=>{
                generateCalendar(Number(yearRange.slice(0,4)),months.indexOf(monthButton.innerText));
                hideMonthDays();
                clearChildElements(yearsWrapper);
                yearsRange.forEach(year=>{
                    yearsWrapper.appendChild(createYearDiv(year,()=>{
                        generateCalendar(year,months.indexOf(monthButton.innerText));
                        generateMonthYearMenu(yearNavigationModes.tenYears);
                        setButtonValue(yearButton,year);
                    }));
                });
                setYearNavigationModeFlag(yearNavigationModes.tenYears);
                setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
            }));
            calendar.appendChild(yearsWrapper);
        });
        setButtonValue(rangeYearButton,`${yearsRanges[1].slice(0,4)} - ${yearsRanges[yearsRanges.length-2].slice(-4)}`);
        setYearNavigationModeFlag(yearNavigationModes.hundredYears);
    }
});

// left and right month button navigation
monthLeftButton.addEventListener("click",()=>{
    if((months.indexOf(monthButton.innerText)-1)<0){
        generateCalendar(Number(yearButton.innerText)-1,11);
    }else{
        generateCalendar(Number(yearButton.innerText),months.indexOf(monthButton.innerText)-1);
    }
});

monthRightButton.addEventListener("click",()=>{
    if((months.indexOf(monthButton.innerText)+1)>11){
        generateCalendar(Number(yearButton.innerText)+1,0);
    }else{
        generateCalendar(Number(yearButton.innerText),months.indexOf(monthButton.innerText)+1);
    }
});

// left and right year button navigation
yearLeftButton.addEventListener("click",()=>{
    if(yearNavigationModeFlag===yearNavigationModes.year){
        generateCalendar(Number(yearButton.innerText)-1,months.indexOf(monthButton.innerText));
    }
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        generateCalendar(Number(yearButton.innerText)-10,months.indexOf(monthButton.innerText));
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        yearsRange.forEach(year=>{
            yearsWrapper.appendChild(createYearDiv(year,()=>{
                generateCalendar(year,months.indexOf(monthButton.innerText));
                generateMonthYearMenu(yearNavigationModes.year);
                setButtonValue(yearButton,year);
            }));
        });
    }
    if(yearNavigationModeFlag===yearNavigationModes.hundredYears){
        generateCalendar(Number(yearButton.innerText)-100,months.indexOf(monthButton.innerText));
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        yearsRanges.forEach(yearRange=>{
            yearsWrapper.appendChild(createYearRangeDiv(yearRange,()=>{
                generateCalendar(Number(yearRange.slice(0,4)),months.indexOf(monthButton.innerText));
                hideMonthDays();
                clearChildElements(yearsWrapper);
                yearsRange.forEach(year=>{
                    yearsWrapper.appendChild(createYearDiv(year,()=>{
                        generateCalendar(year,months.indexOf(monthButton.innerText));
                        generateMonthYearMenu(yearNavigationModes.tenYears);
                        setButtonValue(yearButton,year);
                    }));
                });
                setYearNavigationModeFlag(yearNavigationModes.tenYears);
                setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
            }));
            calendar.appendChild(yearsWrapper);
        });
    }
});

yearRightButton.addEventListener("click",()=>{
    if(yearNavigationModeFlag===yearNavigationModes.year){
        generateCalendar(Number(yearButton.innerText)+1,months.indexOf(monthButton.innerText));
    }
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        generateCalendar(Number(yearButton.innerText)+10,months.indexOf(monthButton.innerText));
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        yearsRange.forEach(year=>{
            yearsWrapper.appendChild(createYearDiv(year,()=>{
                generateCalendar(year,months.indexOf(monthButton.innerText));
                generateMonthYearMenu(yearNavigationModes.year);
                setButtonValue(yearButton,year);
            }));
        });
    }
    if(yearNavigationModeFlag===yearNavigationModes.hundredYears){
        generateCalendar(Number(yearButton.innerText)+100,months.indexOf(monthButton.innerText));
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        yearsRanges.forEach(yearRange=>{
            yearsWrapper.appendChild(createYearRangeDiv(yearRange,()=>{
                generateCalendar(Number(yearRange.slice(0,4)),months.indexOf(monthButton.innerText));
                hideMonthDays();
                clearChildElements(yearsWrapper);
                yearsRange.forEach(year=>{ 
                    yearsWrapper.appendChild(createYearDiv(year,()=>{
                        generateCalendar(year,months.indexOf(monthButton.innerText));
                        generateMonthYearMenu(yearNavigationModes.tenYears);
                        setButtonValue(yearButton,year);
                    }));
                });
                setYearNavigationModeFlag(yearNavigationModes.tenYears);
                setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
            }));
            calendar.appendChild(yearsWrapper);
        });
    }
});

calculateButton.addEventListener("click",()=>{
    const now = DateTime.local();
    const birthDate = DateTime.local(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate());
    const i = Interval.fromDateTimes(birthDate,now);
    const iYears = Number(String(i.length('years')).split('.')[0]);
    const iMonths = Number(String(i.length('months')).split('.')[0])%iYears;
    answerSpace.innerText = `${iYears} years ${iMonths} months`;
    console.log(i.length('years'));
    console.log(i.length('months'));
});

// loading the page again
window.addEventListener("load",()=>{
    form.reset();
});

