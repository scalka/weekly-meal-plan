const RootReducer = (state, { type, payload }) => {
  switch (type) {
    case 'UPDATE_STATUS': {
      return { ...state, status: payload };
    }
    case 'UPDATE_ALL_RECIPES': {
        return { ...state, normalizedRecipes: payload };
    }
    case 'UPDATE_ALL_PLANNED': {
        return { ...state, normalizedPlanned: payload };
    }
    default:
      return state;
  }
};

export default RootReducer;
