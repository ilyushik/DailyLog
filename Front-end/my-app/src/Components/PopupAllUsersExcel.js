import "./PopupAllUsersExcel.css"
import {useSelector} from "react-redux";
import {Fragment, useState} from "react";
import axios from "axios";

export default function PopupAllUsersExcel(props) {
    const mode = useSelector(state => state.theme.theme);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});

    const startDateHandler = (e) => {
        e.preventDefault();
        setStartDate(e.target.value);
    }

    const endDateHandler = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
    }

    const downloadExcel = async () => {
        const url = `${process.env.REACT_APP_BACKEND_LINK}/report/download/excel?startDate=${startDate}&endDate=${endDate}`;
        try {
            const response = await axios.get(url, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'report.xlsx';
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            console.log('Файл успешно загружен');
            props.close()
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            setErrors(error.response.data);
            console.log(error.response.data);
        }
    };



    const submitForm = (e) => {
        e.preventDefault()
        downloadExcel()
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

                                <div>
                                    <button className={`userReport-button`}>Check Info</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}