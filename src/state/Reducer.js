export const InitialState = {
  title: 'A.I. Ching',
};

export const SET_TITLE = 'SET_TITLE';

export const setTitle = title => {
  return {type: SET_TITLE, payload: title};
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_TITLE:
      let title = action.payload;
      return {...state, title};

    default:
      throw new Error(`unknown action ${action.type}.`);
  }
};

export const AppReducer = (state, action) => {
  return reducer(state, action);
};

export default AppReducer;
