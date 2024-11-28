import { DateTime,Interval } from "luxon";
const form = document.querySelector("#form-calculator");
const dateInput = document.querySelector("#date-input");
const dateButton = document.querySelector("#calendar-button");
const calendar = document.querySelector("#calendar");
const calculateButton = document.querySelector(".calculate-button");
calculateButton.type = "button";
calculateButton.disabled = true;
const answerWrapper = document.querySelector(".answer-wrapper");

// lists
const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const daysOfWeek = ["S","M","T","W","T","F","S"];

// initialize navigation menu
const monthYearWrapper = document.createElement("div");
monthYearWrapper.classList.add("month-year-wrapper");
const yearLeftButton = document.createElement("button");
yearLeftButton.classList.add("menu-button");
yearLeftButton.type = "button";
setButtonValue(yearLeftButton,"<<");
monthYearWrapper.appendChild(yearLeftButton);
const monthLeftButton = document.createElement("button");
monthLeftButton.classList.add("menu-button");
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
monthRightButton.classList.add("menu-button");
monthRightButton.type = "button";
setButtonValue(monthRightButton,">");
monthYearWrapper.appendChild(monthRightButton);
const yearRightButton = document.createElement("button");
yearRightButton.classList.add("menu-button");
yearRightButton.type = "button";
setButtonValue(yearRightButton,">>");
monthYearWrapper.appendChild(yearRightButton);

// create year menu section
const yearsWrapper = document.createElement("div");
yearsWrapper.classList.add("years-wrapper");
yearsWrapper.style.display = "none";
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
    yearDiv.classList.add("year");
    setButtonValue(yearDiv,year);
    yearDiv.addEventListener("click",onClickHandler);
    return yearDiv;
}

function createYearRangeDiv(yearRange,onClickHandler){
    const yearRangeDiv = document.createElement("div");
    yearRangeDiv.classList.add("year-range");
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

function getButtonMonthIndex(){
    return months.indexOf(monthButton.innerText.toLowerCase());
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
    const table = document.createElement("div");
    table.classList.add("calendar-table");
    const headerRow = document.createElement("div");
    headerRow.classList.add("calendar-week-header");

    // add week day names
    daysOfWeek.forEach(day=>{
        const th = document.createElement("div");
        th.textContent = day;
        th.classList.add("calendar-week-days");
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // add blank cells for days before the 1st
    let row = document.createElement("div");
    row.classList.add("calendar-table-rows");
    for(let i = 0;i < firstDayIndex;i++){
        const cell = document.createElement("div");
        cell.classList.add("calendar-month-days");
        cell.classList.add("calendar-blank-days");
        cell.innerHTML = "0";
        row.appendChild(cell);
    }

    // add days of the month
    for(let day = 1;day<=daysInMonth;day++){
        if(row.children.length === 7){
            table.appendChild(row);
            row = document.createElement("div");
            row.classList.add("calendar-table-rows");
        }
        const cell = document.createElement("div");
        cell.classList.add("calendar-month-days");
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
            calculateButton.disabled = false;
        });

        row.appendChild(cell);
    }

    table.appendChild(row); // add the last row 
    // add spaces to the end of month
    const lastRow = table.lastElementChild;
    if(lastRow.childNodes.length < 7){
        while(lastRow.childNodes.length<7){
            const cell = document.createElement("div");
            cell.classList.add("calendar-month-days");
            cell.classList.add("calendar-blank-days");
            cell.textContent = "0";
            lastRow.appendChild(cell);
        }
    }
    calendar.appendChild(monthYearWrapper); // add the month year menu
    calendar.appendChild(table);  // add table
    calendar.appendChild(yearsWrapper); // add years space
}

// show / hide calendar
dateButton.addEventListener("click",()=>{
    if(calendar.style.display === "flex"){
        calendar.style.display = "none";
    }else{
        const today = new Date();
        generateCalendar(today.getFullYear(), today.getMonth());
        calendar.style.display = "flex";
        yearsWrapper.style.display = "none";
        rangeYearButton.style.display = "none";
        yearButton.style.display = "block";
        yearButton.innerText = today.getFullYear();
    }
});

// toggle on/off month menu
monthButton.addEventListener("click",()=>{
    // hide calendar days
    hideMonthDays();
    clearChildElements(monthsWrapper);
    // generate month table
    let row = document.createElement("div");
    months.forEach((month,index)=>{
        const monthDiv = document.createElement("div");
        setButtonValue(monthDiv,month);
        monthDiv.classList.add("month");
        row.appendChild(monthDiv);
        
        if(row.children.length===4){
            monthsWrapper.appendChild(row);
            row.classList.add("month-rows");
            row = document.createElement("div");
        }
        
        monthDiv.addEventListener("click",()=>{
            generateCalendar(Number(yearButton.innerText),index);
        });

        if(monthsWrapper.children.length<3){
            monthsWrapper.appendChild(row);
        }

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
    // generate year table
    let row = document.createElement("div");
    yearsRange.forEach(year=>{
        row.appendChild(createYearDiv(year,()=>{
            generateCalendar(year,getButtonMonthIndex());
            generateMonthYearMenu(yearNavigationModes.year);
            setButtonValue(yearButton,year);
        }));
        if(row.children.length===4){
            yearsWrapper.appendChild(row);
            row.classList.add("year-rows");
            row = document.createElement("div");
        }
        if(yearsWrapper.children.length<3){
            yearsWrapper.appendChild(row);
        }
    });
    calendar.appendChild(yearsWrapper);
    setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
    setYearNavigationModeFlag(yearNavigationModes.tenYears);
    rangeYearButton.style.display = "block";
});

// enter range years mode
rangeYearButton.addEventListener("click",()=>{
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        clearChildElements(yearsWrapper);
        yearsWrapper.classList.remove("years-wrapper");
        yearsWrapper.classList.add("years-range-wrapper");
        // generate year table
        let row = document.createElement("div");
        yearsRanges.forEach(yearRange=>{
            row.appendChild(createYearRangeDiv(yearRange,()=>{
                generateCalendar(Number(yearRange.slice(0,4)),getButtonMonthIndex());
                hideMonthDays();
                clearChildElements(yearsWrapper);
                yearsWrapper.classList.add("years-wrapper");
                yearsWrapper.classList.remove("years-range-wrapper");
                let innerRow = document.createElement("div");
                yearsRange.forEach(year=>{
                    innerRow.appendChild(createYearDiv(year,()=>{
                        generateCalendar(year,getButtonMonthIndex());
                        generateMonthYearMenu(yearNavigationModes.tenYears);
                        setButtonValue(yearButton,year);
                    }));
                    if(innerRow.children.length===4){
                        yearsWrapper.appendChild(innerRow);
                        innerRow.classList.add("year-rows");
                        innerRow = document.createElement("div");
                    }
                    if(yearsWrapper.children.length<3){
                        yearsWrapper.appendChild(innerRow);
                    }
                });
                setYearNavigationModeFlag(yearNavigationModes.tenYears);
                setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
            }));
            if(row.children.length===2){
                yearsWrapper.appendChild(row);
                row.classList.add("year-range-rows");
                row = document.createElement("div");
            }
            if(yearsWrapper.children.length<6){
                yearsWrapper.appendChild(row);
            }
            calendar.appendChild(yearsWrapper);
        });
        setButtonValue(rangeYearButton,`${yearsRanges[1].slice(0,4)} - ${yearsRanges[yearsRanges.length-2].slice(-4)}`);
        setYearNavigationModeFlag(yearNavigationModes.hundredYears);
    }
});

// left and right month button navigation
monthLeftButton.addEventListener("click",()=>{
    if((getButtonMonthIndex()-1)<0){
        generateCalendar(Number(yearButton.innerText)-1,11);
    }else{
        generateCalendar(Number(yearButton.innerText),getButtonMonthIndex()-1);
    }
});

monthRightButton.addEventListener("click",()=>{
    if((getButtonMonthIndex()+1)>11){
        generateCalendar(Number(yearButton.innerText)+1,0);
    }else{
        generateCalendar(Number(yearButton.innerText),getButtonMonthIndex()+1);
    }
});

// left and right year button navigation
yearLeftButton.addEventListener("click",()=>{
    if(yearNavigationModeFlag===yearNavigationModes.year){
        generateCalendar(Number(yearButton.innerText)-1,getButtonMonthIndex());
    }
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        generateCalendar(Number(yearButton.innerText)-10,getButtonMonthIndex());
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        let row = document.createElement("div");
        yearsRange.forEach(year=>{
            row.appendChild(createYearDiv(year,()=>{
                generateCalendar(year,getButtonMonthIndex());
                generateMonthYearMenu(yearNavigationModes.year);
                setButtonValue(yearButton,year);
            }));
            if(row.children.length===4){
                yearsWrapper.appendChild(row);
                row.classList.add("year-rows");
                row = document.createElement("div");
            }
            if(yearsWrapper.children.length<3){
                yearsWrapper.appendChild(row);
            }
        });
    }
    if(yearNavigationModeFlag===yearNavigationModes.hundredYears){
        generateCalendar(Number(yearButton.innerText)-100,getButtonMonthIndex());
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        let row = document.createElement("div");
        yearsRanges.forEach(yearRange=>{
            row.appendChild(createYearRangeDiv(yearRange,()=>{
                generateCalendar(Number(yearRange.slice(0,4)),getButtonMonthIndex());
                hideMonthDays();
                clearChildElements(yearsWrapper);
                yearsWrapper.classList.add("years-wrapper");
                yearsWrapper.classList.remove("years-range-wrapper");
                let innerRow = document.createElement("div");
                yearsRange.forEach(year=>{
                    innerRow.appendChild(createYearDiv(year,()=>{
                        generateCalendar(year,getButtonMonthIndex());
                        generateMonthYearMenu(yearNavigationModes.tenYears);
                        setButtonValue(yearButton,year);
                    }));
                    if(innerRow.children.length===4){
                        yearsWrapper.appendChild(innerRow);
                        innerRow.classList.add("year-rows");
                        innerRow = document.createElement("div");
                    }
                    if(yearsWrapper.children.length<3){
                        yearsWrapper.appendChild(innerRow);
                    }
                });
                setYearNavigationModeFlag(yearNavigationModes.tenYears);
                setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
            }));
            if(row.children.length===2){
                yearsWrapper.appendChild(row);
                row.classList.add("year-range-rows");
                row = document.createElement("div");
            }
            if(yearsWrapper.children.length<6){
                yearsWrapper.appendChild(row);
            }
            calendar.appendChild(yearsWrapper);
        });
    }
});

yearRightButton.addEventListener("click",()=>{
    if(yearNavigationModeFlag===yearNavigationModes.year){
        generateCalendar(Number(yearButton.innerText)+1,getButtonMonthIndex());
    }
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        generateCalendar(Number(yearButton.innerText)+10,getButtonMonthIndex());
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        let row = document.createElement("div");
        yearsRange.forEach(year=>{
            row.appendChild(createYearDiv(year,()=>{
                generateCalendar(year,getButtonMonthIndex());
                generateMonthYearMenu(yearNavigationModes.year);
                setButtonValue(yearButton,year);
            }));
            if(row.children.length===4){
                yearsWrapper.appendChild(row);
                row.classList.add("year-rows");
                row = document.createElement("div");
            }
            if(yearsWrapper.children.length<3){
                yearsWrapper.appendChild(row);
            }
        });
    }
    if(yearNavigationModeFlag===yearNavigationModes.hundredYears){
        generateCalendar(Number(yearButton.innerText)+100,getButtonMonthIndex());
        // hide calendar days
        hideMonthDays();
        clearChildElements(yearsWrapper);
        let row = document.createElement("div");
        yearsRanges.forEach(yearRange=>{
            row.appendChild(createYearRangeDiv(yearRange,()=>{
                generateCalendar(Number(yearRange.slice(0,4)),getButtonMonthIndex());
                hideMonthDays();
                clearChildElements(yearsWrapper);
                let innerRow = document.createElement("div");
                yearsRange.forEach(year=>{ 
                    innerRow.appendChild(createYearDiv(year,()=>{
                        generateCalendar(year,getButtonMonthIndex());
                        generateMonthYearMenu(yearNavigationModes.tenYears);
                        setButtonValue(yearButton,year);
                    }));
                    if(innerRow.children.length===4){
                        yearsWrapper.appendChild(innerRow);
                        innerRow.classList.add("year-rows");
                        innerRow = document.createElement("div");
                    }
                    if(yearsWrapper.children.length<3){
                        yearsWrapper.appendChild(innerRow);
                    }
                });
                setYearNavigationModeFlag(yearNavigationModes.tenYears);
                setButtonValue(rangeYearButton,`${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`);
            }));
            if(row.children.length===2){
                yearsWrapper.appendChild(row);
                row.classList.add("year-range-rows");
                row = document.createElement("div");
            }
            if(yearsWrapper.children.length<6){
                yearsWrapper.appendChild(row);
            }
            calendar.appendChild(yearsWrapper);
        });
    }
});

calculateButton.addEventListener("click",()=>{
    const now = DateTime.local();
    const birthDate = DateTime.local(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate());
    const interval = Interval.fromDateTimes(birthDate,now);
    const iYears = Number(String(interval.length('years')).split('.')[0]);
    let iMonths = Number(String(interval.length('months')).split('.')[0]);
    if(iYears>0){
        iMonths = iMonths%iYears;
    }
    clearChildElements(answerWrapper);
    const answer = document.createElement("span");
    answer.classList.add("answer");
    if(
        birthDate.day > now.day ||
        birthDate.month > now.month ||
        birthDate.year > now.year
    ){
        answer.innerText = "The birth date cannot be greater than or equal to today's date";
    }else{
        
        answer.innerHTML = `You are <strong class="answer-data">${iYears} years ${iMonths} months</strong> old</p>`;
    }
    answerWrapper.appendChild(answer);
});

// loading the page again
window.addEventListener("load",()=>{
    form.reset();
});

