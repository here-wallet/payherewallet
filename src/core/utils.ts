import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const changeSearch = (data: Record<string, string>) => {
  const search = new URLSearchParams(data);
  const base = window.location.origin + window.location.pathname + "?" + search;
  window.history.replaceState({}, document.title, base);
};

export const getSearch = () => {
  const search = new URLSearchParams(window.location.search);
  return Object.fromEntries(search.entries());
};

export const validatePhone = (phone: string) => {
  return !isNaN(+phone.replace("+", "")) && phone.length > 6;
};

export const formatPhone = (phone: string) => {
  if (phone === "+") return "";
  return "+" + phone.replaceAll(/\D/g, "");
};

export const formatAmount = (amt: string) => {
  const [a = "0", b = ""] = amt.replaceAll(",", ".").split(".");
  if (amt.includes(".")) {
    return a.replaceAll(/\D/g, "") + "." + b.replaceAll(/\D/g, "");
  }

  return a.replaceAll(/\D/g, "");
};

export const showError = (msg: string) => {
  Toastify({
    text: msg,
    gravity: "bottom",
    position: "left",
    duration: 2000,
    style: {
      background: "#000",
      color: "#fff",
      maxWidth: "100%",
      borderRadius: "12px",
      boxShadow: "none",
    },
  }).showToast();
};
