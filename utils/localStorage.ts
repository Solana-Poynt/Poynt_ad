export const saveDataToLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // console.log("Error saving data:", error);
  }
};

export const getDataFromLocalStorage = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (error) {
    // console.log("Error retrieving data:", error);
    return null;
  }
};

export const deleteDataFromLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // console.log("Error deleting data:", error);
  }
};
