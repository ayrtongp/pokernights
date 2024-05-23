import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function formatValue2(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function getCurrentDateTime() {
  const currentDate = new Date();
  const options = { timeZone: "America/Sao_Paulo", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("pt-BR", options);

  const [date, hour] = formattedDate.replace(',', '').split(' ')
  const [day, month, year] = date.split('/')

  return `${year}-${month}-${day} ${hour}`;
}

export function notifyError(error) {
  toast.error(error, {
    position: "top-right", autoClose: 3000, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: false, progress: undefined, theme: "light",
  });
}

export function notifySuccess(success) {
  toast.success(success, {
    position: "top-right", autoClose: 3000, hideProgressBar: false,
    closeOnClick: true, pauseOnHover: false, progress: undefined, theme: "light",
  });
}