import { faHourglassEmpty } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";

export const getApiUrl = () => {
    if (process.env.REACT_APP_RUN_MODE === "development")
        return process.env.REACT_APP_DEV_API_URL
    else
        return process.env.REACT_APP_PROD_API_URL
}

export const serializeForm = (id) => {
    const inputTypes = ["text", "password", "checkbox", "radio", "submit", "reset", "file", "hidden", "number", "date" +
        "time", "color", "range", "email", "url", "tel", "search", "image"];
    let data = new FormData()
    let formEl = document.getElementById(id);
    if (formEl) {
        let fields = formEl.querySelectorAll('[id]');
        Array.from(fields).forEach(field => {
            if (inputTypes.includes(field.type) || field.tagName.toLocaleLowerCase() === "textarea" || field.tagName.toLocaleLowerCase() === "select") {
                if (field.getAttribute("data-ignore") != "true") {
                    data.append(field.id, field.type === "checkbox" ? field.checked : field.value);
                }
            }
        })
    }
    return (data)
}

export const deepFind = (array, key, value) => {
    for (let i = 0; i < array.length; i++) {
        let rec = array[i]
        if (rec.hasOwnProperty(key) && rec[key] == value) return (rec);
        for (const nestedKey in rec) {
            if (typeof rec[nestedKey] === 'object') {
                const foundObj = deepFind(rec[nestedKey], key, value);
                if (foundObj) return foundObj;
            }
        }
    }
    return (undefined)
}

export const toProperCase = (str) => {
    return str.replace(/\w\S*/g, function (word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
}

export const toSimpleDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const formatMoney = (num) => {
    let new_num = parseFloat(num)
    return new_num.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export const checkDate = (dateString) => {
    const newDate = new Date(dateString)
    return !isNaN(newDate.getTime()) && dateString.trim() === newDate.toISOString().split('T')[0];
}

export const getBubbleColor = (status) => {
    let colorList = ["grey", "green", "gold", "red", "purple","blue"]
    return (colorList[status])
}
export const getBubbleIcon = (status) => {
    let iconList = [faQuestion, faCheck, faCheck, faXmark, faHourglassEmpty]
    return (iconList[status])
}

export const getSiteIdRoute = () => {
    const siteroute = window.location.host
    const rawPath = window.location.pathname.replace(new RegExp(`/${process.env.REACT_APP_PUBLIC_URL}/`, 'g'), "/")
    const path = rawPath.split('/')
    let siteid = path[path.length - 1]
    let route = ""
    if (path.length > 2) {
        siteid = path[path.length - 2]
        route = path[path.length - 1]
    }
    return { siteroute: siteroute, siteid: siteid, route: route }
}

export const localDateTime = () => {
    const localDate = new Date()
    return Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0));

}

export const calcYearsBetweenDates = (startDate, endDate) => {
    const today = new Date(endDate);
    const start = new Date(startDate);
    const diffInMs = today - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    let years = 0;
    let dateCursor = new Date(startDate);
    while (dateCursor < today) {
        const nextYear = new Date(dateCursor.getFullYear() + 1, dateCursor.getMonth(), dateCursor.getDate());
        if (nextYear > today) break;
        years++;
        dateCursor = nextYear;
    }
    return years;
}

export const calcDaysBetweenDates = (startDate, endDate) => {
    let dateParts = startDate.split('-');
    let year = parseInt(dateParts[0], 10);
    let month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
    let day = parseInt(dateParts[2], 10);
    let startDateUTC = new Date(Date.UTC(year, month, day));
    dateParts = endDate.split('-');
    year = parseInt(dateParts[0], 10);
    month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
    day = parseInt(dateParts[2], 10);
    let endDateUTC = new Date(Date.UTC(year, month, day));
    let differenceInTime = endDateUTC - startDateUTC;
    let differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    return differenceInDays;
}

export function convertToDate(dateString) {
    let dateParts = dateString.split('-');
    let year = parseInt(dateParts[0], 10);
    let month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed in JavaScript Date objects
    let day = parseInt(dateParts[2], 10);
    let date = new Date(year, month, day);
    return date;
}