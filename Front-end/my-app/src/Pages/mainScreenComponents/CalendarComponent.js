import {useCallback, useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./CalendarComponent.css";
import {useSelector} from "react-redux";
import {PopupReport} from "../../Components/PopupReport";
import axios from "axios";
import {PopupSuccess} from "../../Components/PopupSuccess";
import {useParams} from "react-router";

export function CalendarComponent() {
    const params = useParams();
    const [value, onChange] = useState(new Date());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const mode = useSelector(state => state.theme.theme);
    const [reports, setReports] = useState([]);
    const [popupSuccessIsOpen, setPopupSuccessIsOpen] = useState(false);

    const fetchData = async (url, setData) => {
        try {
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setData(response.data);
        } catch (error) {
        }
    };

    useEffect(() => {
        const url = params.id
            ? `${process.env.REACT_APP_BACKEND_LINK}/report/usersReports/` + params.id
            : `${process.env.REACT_APP_BACKEND_LINK}/report/usersReports`;
        fetchData(url, setReports);
        // fetchUsersReports();
    }, [params.id]);

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

    const openPopupSuccess = () => {
        setPopupSuccessIsOpen(true)
    }

    const closePopupSuccess = () => {
        setPopupSuccessIsOpen(false);
        window.location.reload()
    }

    const report = selectedDate
        ? reports.find(report => formatDate(parseReportDate(report.date)) === formatDate(selectedDate))
        : null;

    return (
        <div className={mode === "dark" ? 'dark-theme' : 'light-theme'}>
            {popupSuccessIsOpen && <PopupSuccess close={closePopupSuccess} title="The report was
                                    successfully sent!" message="Thanks for your activity"/>}
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
            {modalIsOpen && <PopupReport closeModal={closeModal} report={report} openSuccess={openPopupSuccess}/>}
        </div>
    );
}
