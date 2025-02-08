import {useSelector} from "react-redux";
import {Fragment, useState} from "react";
import axios from "axios";
import "./PopupUserExcel.css"

export default function PopupUserExcel(props) {
    const mode = useSelector(state => state.theme.theme);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userReport, setUserReport] = useState(null);
    const [errors, setErrors] = useState({});

    const startDateHandler = (e) => {
        e.preventDefault();
        setStartDate(e.target.value);
    }

    const endDateHandler = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
    }

    // const downloadExcel = async () => {
    //     const url = `http://localhost:8080/report/download/excel?startDate=${startDate}&endDate=${endDate}`;
    //     try {
    //         const response = await axios.get(url, {
    //             responseType: 'blob',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
    //             },
    //         });
    //
    //         const blob = new Blob([response.data], { type: 'application/octet-stream' });
    //         const downloadUrl = window.URL.createObjectURL(blob);
    //
    //         const link = document.createElement('a');
    //         link.href = downloadUrl;
    //         link.download = 'report.xlsx'; // Имя файла, которое вы хотите дать при скачивании
    //         document.body.appendChild(link);
    //         link.click();
    //
    //         // Очищаем временные ресурсы
    //         link.remove();
    //         window.URL.revokeObjectURL(downloadUrl);
    //
    //         console.log('Файл успешно загружен');
    //     } catch (error) {
    //         console.error('Ошибка при загрузке файла:', error);
    //     }
    // };

    const loadUserReport = async () => {
        try {
            setUserReport(null)
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_LINK}/report/usersReport-perPeriod/${props.userId}`,
                {startDate: startDate, endDate: endDate}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            console.log(response.data);
            setUserReport(response.data);
            setErrors({})
        } catch (e) {
            console.log(e.response.data);
            setErrors(e.response.data);
        }
    }

    const submitForm = (e) => {
        e.preventDefault()
        loadUserReport()
    }

    return(
        <Fragment>
            <div>
                <div className="back" onClick={props.close}>

                </div>

                <div className={`modal-justify ${mode === "dark" ? "dark" : "light"}`}>
                    <div className={`modal-screen ${mode === "dark" ? "dark" : "light"}`}>
                        <button className={`close-button ${mode === "dark" ? "dark" : "light"}`} onClick={props.close}>&times;</button>
                        <div className="oneUsersExcel-block">
                            <form onSubmit={submitForm}>
                                <div className={`userReport`}>
                                    <label htmlFor="startDate">Start date</label>
                                    <input type="date" value={startDate} onChange={startDateHandler} id="startDate" placeholder="Start date" />
                                </div>

                                <div className={`userReport`}>
                                    <label htmlFor="endDate">End date</label>
                                    <input type="date" value={endDate} onChange={endDateHandler} id="endDate" placeholder="End date" />
                                </div>

                                {errors.dateEr && (<p className={`userReport-erMessage`}>{errors.dateEr}</p>)}
                                {errors.message && (<p className={`userReport-erMessage`}>{errors.message}</p>)}

                                <div>
                                    <button className={`userReport-button`}>Check Info</button>
                                </div>
                            </form>

                            {userReport !== null && (
                                <div className={`userReport-block`}>
                                    <div className={`userReportTitle`}>
                                        <p>Name</p>
                                        <p>Price per hour</p>
                                        <p>Count of hours</p>
                                        <p>Total</p>
                                    </div>

                                    <div className={`userReportValue`}>
                                        <p>{userReport.firstName} {userReport.secondName}</p>
                                        <p>{userReport.pricePerHour}</p>
                                        <p>{userReport.countOfHoursPerPeriod}</p>
                                        <p>{userReport.sumHoursPricePerPeriod}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}