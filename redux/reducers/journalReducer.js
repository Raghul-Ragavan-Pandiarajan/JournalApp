import { JOURNAL_ADD, JOURNAL_DELETE, JOURNAL_DELETE_ALL } from '../constants';
const initialState = {
    journalsData : [
        // {
        //         id: '1',
        //         date: 'August 11, 2023',
        //         title: 'Lorem ipsum dolor sit amet',
        //         content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nNulla hendrerit magna at quam congue, id vestibulum quam dictum. Suspendisse ac risus nec neque eleifend tempus. Vivamus ut arcu non urna luctus condimentum. Fusce a vestibulum justo, vel bibendum orci.\nNam bibendum orci quis pharetra cursus. Duis eget dolor vel libero tempus aliquam nec a ante. Cras vulputate hendrerit nunc, at sagittis ex sodales at. In eget laoreet erat.\nProin sed neque eget purus auctor porttitor in sit amet nulla.`,
        //       },
        //       {
        //         id: '2',
        //         date: 'January 02, 2022',
        //         title: 'Pellentesque habitant morbi tristique',
        //         content: `Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\nDuis ac neque non sapien mattis sodales. Sed efficitur ac urna in luctus. Integer facilisis, neque sit amet tincidunt ullamcorper, felis elit semper nisl, eu volutpat enim velit at turpis. \nNunc et eros varius, vestibulum odio at, varius libero. In hac habitasse platea dictumst.\nDonec egestas, justo id eleifend malesuada, elit augue suscipit orci, nec dignissim est nisl nec ante.`,
        //       },
        //       {
        //         id: '3',
        //         date: 'July 12, 2023',
        //         title: 'Cras non dui facilisis, congue libero sed, bibendum sem',
        //         content: `Cras non dui facilisis, congue libero sed, bibendum sem. Fusce nec eros leo. Praesent a suscipit neque.\nCurabitur placerat volutpat nisi eget fringilla. Aenean bibendum suscipit ante a eleifend. Curabitur non lectus ac erat malesuada dignissim ac ut nisl. Nulla posuere, est at luctus sollicitudin, est metus ultrices felis, nec interdum orci sapien vel felis.\nSed id neque a tellus bibendum accumsan. Aliquam convallis metus non nisl pharetra, sit amet feugiat elit bibendum. Fusce accumsan nec velit at tempus. Integer pharetra, purus non tincidunt laoreet, arcu nisi hendrerit risus, sit amet tincidunt nulla ex eu tellus.`,
        //       },
    ]
};
const journalReducer = (state = initialState, action) => {
switch(action.type) {
case JOURNAL_ADD: {
    
    const { id, date, title, content } = action.payload
    const journalExists = state.journalsData.some((journal) => journal.id === id);
    if (!journalExists) {
return {
...state,
journalsData : [ ...state.journalsData , { id, date, title, content }]
};
}
return state
}
case JOURNAL_DELETE: {
    const { id } = action.payload
return {
  ...state, 
  journalsData : state.journalsData.filter((journal) => id !== journal.id) 
}

}
case JOURNAL_DELETE_ALL: {
    return {
      ...state,
      journalsData: [], 
    };
  }

default:
return state;
}
}
export default journalReducer;