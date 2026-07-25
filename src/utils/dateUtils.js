// Date helper utilities for hotel management

export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getNextDayString = (dateStr) => {
  let base;
  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      base = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      base = new Date();
    }
  } else {
    base = new Date();
  }
  base.setDate(base.getDate() + 1);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const partsIn = checkIn.split('-');
  const partsOut = checkOut.split('-');
  if (partsIn.length !== 3 || partsOut.length !== 3) return 0;

  const d1 = new Date(parseInt(partsIn[0], 10), parseInt(partsIn[1], 10) - 1, parseInt(partsIn[2], 10));
  const d2 = new Date(parseInt(partsOut[0], 10), parseInt(partsOut[1], 10) - 1, parseInt(partsOut[2], 10));

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
