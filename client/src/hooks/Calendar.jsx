import React, {useState} from 'react'
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

export const Search = () => {
    
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    
    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: "selection",
    }
    
    const handleSelect = (ranges) => {
        setStartDate(ranges.selection.startDate)
        setEndDate(ranges.selection.endDate)
    }

    const getDateArray = (start, end) => {
        const dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(dates)
        return dates;
    };


    return (
        <div className="search">
            <DateRange ranges={[selectionRange]} onChange={handleSelect} />
            <button onClick={() => {getDateArray(startDate, endDate)}}>test</button>
        </div>
    )
}