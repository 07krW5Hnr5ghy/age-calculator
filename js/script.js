const form = document.querySelector("#calculator-wrapper");
const dateInput = document.querySelector("#date-input");
const dateButton = document.querySelector("#calendar-button");
const calendar = document.querySelector("#calendar");

// utility functions
function clearChildElements(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

// lists
const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// create navigation menu
const monthYearWrapper = document.createElement("div");
monthYearWrapper.classList.add("month-year-wrapper");
const yearLeftButton = document.createElement("button");
yearLeftButton.type = "button";
yearLeftButton.innerText = "<<";
monthYearWrapper.appendChild(yearLeftButton);
const monthLeftButton = document.createElement("button");
monthLeftButton.type = "button";
monthLeftButton.innerText = "<";
monthYearWrapper.appendChild(monthLeftButton);
const monthButton = document.createElement("div");
monthButton.classList.add("month-year-button");
monthYearWrapper.appendChild(monthButton);
const yearButton = document.createElement("div");
yearButton.classList.add("month-year-button");
monthYearWrapper.appendChild(yearButton);
const monthRightButton = document.createElement("button");
monthRightButton.type = "button";
monthRightButton.innerText = ">";
monthYearWrapper.appendChild(monthRightButton);
const yearRightButton = document.createElement("button");
yearRightButton.type = "button";
yearRightButton.innerText = ">>";
monthYearWrapper.appendChild(yearRightButton);

// create year menu section
const yearsWrapper = document.createElement("div");
yearsWrapper.classList.add("years-wrapper");
const rangeYearButton = document.createElement("div");
rangeYearButton.classList.add("range-year-button");

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

function generateCalendar(year,month){
    console.log(months[month]);
    console.log(year);
    calendar.innerHTML = ""; // clear the calendar
    const daysInMonth = new Date(year,month+1,0).getDate();
    const firstDayIndex = new Date(year,month,1).getDay();

    calendar.appendChild(monthYearWrapper);

    monthButton.innerText = months[month];
    yearButton.innerText = year;

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
        console.log(subRange);
        yearsRanges.push(subRange);
    }

    if(yearNavigationModeFlag === yearNavigationModes.tenYears){
        rangeYearButton.innerText = tenYearRange;
    }

    if(yearNavigationModeFlag === yearNavigationModes.hundredYears){
        rangeYearButton.innerText = hundredYearRange;
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
            dateInput.value = selectedDate.toISOString().split("T")[0].replaceAll("-","/");
            calendar.style.display = "none"; // Hide the calendar
            generateCalendar(year,month); // Re-render calendar
        });

        row.appendChild(cell);
    }

    table.appendChild(row); // add the last row
    calendar.appendChild(monthYearWrapper);
    calendar.appendChild(table);  
    calendar.appendChild(yearsWrapper);
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

        });
    });
    calendar.appendChild(monthsWrapper);
    // hide month, left month and right month buttons
    monthButton.style.display = "none";
    monthLeftButton.style.display = "none";
    monthRightButton.style.display = "none";
});

// toggle on/off year menu
yearButton.addEventListener("click",()=>{
    // hide calendar days
    calendar.childNodes[1].style.display = "none";
    /* remove year and month buttons and replace with year range button */
    yearButton.style.display = "none";
    monthButton.style.display = "none";
    monthLeftButton.style.display = "none";
    monthRightButton.style.display = "none";
    monthYearWrapper.removeChild(yearRightButton);
    monthYearWrapper.appendChild(rangeYearButton);
    monthYearWrapper.appendChild(yearRightButton);
    yearsWrapper.style.display = "flex";
    clearChildElements(yearsWrapper);
    yearsRange.forEach(year=>{
        const yearDiv = document.createElement("div");
        yearDiv.innerText = year;
        yearDiv.addEventListener("click",()=>{
            generateCalendar(year,months.indexOf(monthButton.innerText));
            monthYearWrapper.removeChild(rangeYearButton);
            yearButton.style.display = "block";
            monthLeftButton.style.display = "block";
            monthRightButton.style.display = "block";
            monthButton.style.display = "block";
            yearsWrapper.style.display = "none";
            yearButton.innerText = year;
            yearNavigationModeFlag = yearNavigationModes.year;
        });
        yearsWrapper.appendChild(yearDiv);
    });
    calendar.appendChild(yearsWrapper);
    rangeYearButton.innerText = `${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`;
    yearNavigationModeFlag = yearNavigationModes.tenYears;
});

// enter range years mode
rangeYearButton.addEventListener("click",()=>{
    clearChildElements(yearsWrapper);
    if(yearNavigationModeFlag===yearNavigationModes.tenYears){
        yearsRanges.forEach(yearRange=>{
            const yearRangeDiv = document.createElement("div");
            yearRangeDiv.innerText = yearRange;
            yearRangeDiv.addEventListener("click",()=>{
                console.log(yearRangeDiv.innerText);
                generateCalendar(Number(yearRangeDiv.innerText.slice(0,4)),months.indexOf(monthButton.innerText));
                calendar.childNodes[1].style.display = "none";
                clearChildElements(yearsWrapper);
                yearsRange.forEach(year=>{
                    const yearDiv = document.createElement("div");
                    yearDiv.innerText = year;
                    yearDiv.addEventListener("click",()=>{
                        generateCalendar(year,months.indexOf(monthButton.innerText));
                        monthYearWrapper.removeChild(rangeYearButton);
                        yearButton.style.display = "block";
                        monthLeftButton.style.display = "block";
                        monthRightButton.style.display = "block";
                        monthButton.style.display = "block";
                        yearButton.innerText = year;
                        yearsWrapper.style.display = "none";
                        yearNavigationModeFlag = yearNavigationModes.tenYears;
                    });
                    yearsWrapper.appendChild(yearDiv);
                });
                rangeYearButton.innerText = `${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`;
            });
            yearsWrapper.appendChild(yearRangeDiv);
            calendar.appendChild(yearsWrapper);
        });
        rangeYearButton.innerText = `${yearsRanges[1].slice(0,4)} - ${yearsRanges[yearsRanges.length-2].slice(-4)}`;
        yearNavigationModeFlag = yearNavigationModes.hundredYears;
    }

    if(yearNavigationModeFlag === yearNavigationModes.tenYears){
        console.log("10 years");
        yearsRange.forEach(year=>{
            const yearDiv = document.createElement("div");
            yearDiv.innerText = year;
            yearDiv.addEventListener("click",()=>{
                generateCalendar(year,months.indexOf(monthButton.innerText));
                monthYearWrapper.removeChild(rangeYearButton);
                yearButton.style.display = "block";
                monthLeftButton.style.display = "block";
                monthRightButton.style.display = "block";
                monthButton.style.display = "block";
                yearButton.innerText = year;
                yearNavigationModeFlag = yearNavigationModes.year;
            });
            yearsWrapper.appendChild(yearDiv);
        });
        rangeYearButton.innerText = `${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`;
        yearNavigationModeFlag = yearNavigationModes.tenYears;
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
        calendar.childNodes[1].style.display = "none";
        clearChildElements(yearsWrapper);
        yearsRange.forEach(year=>{
            const yearDiv = document.createElement("div");
            yearDiv.innerText = year;
            yearDiv.addEventListener("click",()=>{
                generateCalendar(year,months.indexOf(monthButton.innerText));
                monthYearWrapper.removeChild(rangeYearButton);
                yearButton.style.display = "block";
                monthLeftButton.style.display = "block";
                monthRightButton.style.display = "block";
                monthButton.style.display = "block";
                yearsWrapper.style.display = "none";
                yearButton.innerText = year;
                yearNavigationModeFlag = yearNavigationModes.year;
            });
            yearsWrapper.appendChild(yearDiv);
        });
    }
    if(yearNavigationModeFlag===yearNavigationModes.hundredYears){
        generateCalendar(Number(yearButton.innerText)-100,months.indexOf(monthButton.innerText));
        // hide calendar days
        calendar.childNodes[1].style.display = "none";
        clearChildElements(yearsWrapper);
        yearsRanges.forEach(yearRange=>{
            const yearRangeDiv = document.createElement("div");
            yearRangeDiv.innerText = yearRange;
            yearRangeDiv.addEventListener("click",()=>{
                console.log(yearRangeDiv.innerText);
                generateCalendar(Number(yearRangeDiv.innerText.slice(0,4)),months.indexOf(monthButton.innerText));
                calendar.childNodes[1].style.display = "none";
                clearChildElements(yearsWrapper);
                yearsRange.forEach(year=>{
                    const yearDiv = document.createElement("div");
                    yearDiv.innerText = year;
                    yearDiv.addEventListener("click",()=>{
                        generateCalendar(year,months.indexOf(monthButton.innerText));
                        monthYearWrapper.removeChild(rangeYearButton);
                        yearButton.style.display = "block";
                        monthLeftButton.style.display = "block";
                        monthRightButton.style.display = "block";
                        monthButton.style.display = "block";
                        yearButton.innerText = year;
                        yearsWrapper.style.display = "none";
                        yearNavigationModeFlag = yearNavigationModes.tenYears;
                    });
                    yearsWrapper.appendChild(yearDiv);
                });
                rangeYearButton.innerText = `${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`;
            });
            yearsWrapper.appendChild(yearRangeDiv);
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
        calendar.childNodes[1].style.display = "none";
        clearChildElements(yearsWrapper);
        yearsRange.forEach(year=>{
            const yearDiv = document.createElement("div");
            yearDiv.innerText = year;
            yearDiv.addEventListener("click",()=>{
                generateCalendar(year,months.indexOf(monthButton.innerText));
                monthYearWrapper.removeChild(rangeYearButton);
                yearButton.style.display = "block";
                monthLeftButton.style.display = "block";
                monthRightButton.style.display = "block";
                monthButton.style.display = "block";
                yearsWrapper.style.display = "none";
                yearButton.innerText = year;
                yearNavigationModeFlag = yearNavigationModes.year;
            });
            yearsWrapper.appendChild(yearDiv);
        });
    }
    if(yearNavigationModeFlag===yearNavigationModes.hundredYears){
        generateCalendar(Number(yearButton.innerText)+100,months.indexOf(monthButton.innerText));
        // hide calendar days
        calendar.childNodes[1].style.display = "none";
        clearChildElements(yearsWrapper);
        yearsRanges.forEach(yearRange=>{
            const yearRangeDiv = document.createElement("div");
            yearRangeDiv.innerText = yearRange;
            yearRangeDiv.addEventListener("click",()=>{
                console.log(yearRangeDiv.innerText);
                generateCalendar(Number(yearRangeDiv.innerText.slice(0,4)),months.indexOf(monthButton.innerText));
                calendar.childNodes[1].style.display = "none";
                clearChildElements(yearsWrapper);
                yearsRange.forEach(year=>{
                    const yearDiv = document.createElement("div");
                    yearDiv.innerText = year;
                    yearDiv.addEventListener("click",()=>{
                        generateCalendar(year,months.indexOf(monthButton.innerText));
                        monthYearWrapper.removeChild(rangeYearButton);
                        yearButton.style.display = "block";
                        monthLeftButton.style.display = "block";
                        monthRightButton.style.display = "block";
                        monthButton.style.display = "block";
                        yearButton.innerText = year;
                        yearsWrapper.style.display = "none";
                        yearNavigationModeFlag = yearNavigationModes.tenYears;
                    });
                    yearsWrapper.appendChild(yearDiv);
                });
                rangeYearButton.innerText = `${yearsRange[1]} - ${yearsRange[yearsRange.length-1]}`;
            });
            yearsWrapper.appendChild(yearRangeDiv);
            calendar.appendChild(yearsWrapper);
        });
    }
});

// loading the page again
window.addEventListener("load",()=>{
    form.reset();
});