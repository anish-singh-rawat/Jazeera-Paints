const APP_ID = "Revest-Retail";
// const localStorage: any = window.localStorage;
// const sessionStorage: any = typeof window === "object" ? window.sessionStorage : {};
const localStorage: any = require("localStorage");
const sessionStorage: any = require("localStorage");

const setData = (setName: string, setObject: string, isLocal = true) => {
  setName = APP_ID + "-" + setName;
  if (setObject) {
    setObject =
      typeof setObject == "string" ? setObject : JSON.stringify(setObject);
  }
  if (isLocal === true) {
    return localStorage.setItem(setName, setObject);
  } else {
    return sessionStorage.setItem(setName, setObject);
  }
};

const getData = (getName: string, isLocal = false) => {
  getName = APP_ID + "-" + getName;
  let data = null;
  if (isLocal === true) {
    data = localStorage.getItem(getName);
  } else {
    data = sessionStorage.getItem(getName);
  }
  if (data) {
    data =
      data.indexOf("{") > -1 || data.indexOf("[") > -1
        ? JSON.parse(data)
        : data;
  }
  return data;
};

const removeData = (key: string, isLocal = false) => {
  key = APP_ID + "-" + key;
  if (isLocal === true) {
    return localStorage.removeItem(key);
  } else {
    return sessionStorage.removeItem(key);
  }
};

const clearData = () => {
  let user = getData("remember-me", true);
  localStorage.clear();
  sessionStorage.clear();
  if (user != null) {
    setData("remember-me", user, true);
  }
  return;
};

const AppStorage = {
  getData,
  setData,
  removeData,
  clearData,
};

export default AppStorage;
