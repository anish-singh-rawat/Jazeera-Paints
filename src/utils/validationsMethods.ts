export const validateDropdownItem = (dropDownItem: any): boolean => {
  if (!dropDownItem) return false;
  return dropDownItem?.name !== "";
};

export const getDate = (date: any) => {
  const startDate = new Date(date);
  const [month, day, year] = [
    startDate.getMonth(),
    startDate.getDate(),
    startDate.getFullYear(),
  ];

  return `${day >= 10 ? day : "0" + day}-${month >= 10 ? month + 1 : "0" + (month + 1)}-${year}`;
};

export const formatDateToISO = (date: any) => {
  const startDate = new Date(date);
  const [month, day, year] = [
    startDate.getMonth(),
    startDate.getDate(),
    startDate.getFullYear(),
  ];

  return `${year}-${month >= 10 ? month + 1 : "0" + (month + 1)}-${day >= 10 ? day : "0" + day}`;
};

export const formatDateToISOWithTime = (date: any, isEndOfDay: boolean = false) => {
  const startDate = new Date(date);
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1; // JavaScript months are 0-based.
  const day = startDate.getDate();

  // Format month and day
  const formattedMonth = month < 10 ? `0${month}` : month.toString();
  const formattedDay = day < 10 ? `0${day}` : day.toString();

  // Determine time part based on whether it's the end of the day
  const time = isEndOfDay ? "23:59:59" : "00:00:00";

  return `${year}-${formattedMonth}-${formattedDay} ${time}`;
};


