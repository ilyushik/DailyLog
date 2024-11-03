import {useCallback, useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./CalendarComponent.css";
import {useSelector} from "react-redux";
import {PopupReport} from "../../Components/PopupReport";
import axios from "axios";

export function CalendarComponent() {
    const [value, onChange] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const mode = useSelector(state => state.mode);
    const [reports, setReports] = useState([]);

    const fetchUsersReports = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/report/usersReports", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            console.log(response.data);
            setReports(response.data);
        } catch (error) {
            console.log(error.response?.data);
        }
    }, []);

    useEffect(() => {
        fetchUsersReports();
    }, [fetchUsersReports]);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const parseReportDate = (reportDateArray) => {
        const [year, month, day] = reportDateArray;
        return new Date(year, month - 1, day); // Преобразуем в объект Date
    };

    const openModal = (date) => {
        setSelectedDate(date);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedDate(null);
    };

    const report = selectedDate
        ? reports.find(report => formatDate(parseReportDate(report.date)) === formatDate(selectedDate))
        : null;

    return (
        <div className={mode === "Dark" ? 'dark-theme' : 'light-theme'}>
            <Calendar
                onChange={onChange}
                value={value}
                locale="en-US"
                tileClassName={({ date }) => {
                    const report = reports.find(report => formatDate(parseReportDate(report.date)) === formatDate(date));
                    return report ? `has-report ${report.status}` : '';
                }}
                onClickDay={openModal}
            />
            {modalIsOpen && <PopupReport closeModal={closeModal} report={report} />}
        </div>
    );
}
