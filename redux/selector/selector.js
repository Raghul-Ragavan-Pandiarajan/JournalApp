export const getDataById = (journalsData, id) => {
    return journalsData.find(item => item.id === id);
  };