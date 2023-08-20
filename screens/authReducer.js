// authReducer.js
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isSignIn: true,
      };
    case 'SIGN_UP':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isSignIn: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        isLoading: false,
        isSignIn: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };
    // Add other cases here if needed
    default:
      return state;
  }
};

export default authReducer;

// authReducer.js
// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_USER':
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//       };
//     case 'SIGN_IN':
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//         isSignIn: true,
//       };
//     case 'SIGN_UP':
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//         isSignIn: true,
//       };
//     case 'SIGN_OUT':
//       return {
//         ...state,
//         user: null,
//         isLoading: false,
//         isSignIn: false,
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         isLoading: action.payload,
//       };
//     case 'SET_USERNAME':
//       return {
//         ...state,
//         username: action.payload,
//       };
//     // Add other cases here if needed
//     default:
//       return state;
//   }
// };

// export default authReducer;


// const authReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_USER':
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//       };
//     case 'SIGN_IN':
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//         isSignIn: true, // Set isSignIn to true
//       };
//     case 'SIGN_UP':
//       return {
//         ...state,
//         user: action.payload,
//         isLoading: false,
//         isSignIn: true, // Set isSignIn to true
//       };
//     case 'SIGN_OUT':
//       return {
//         ...state,
//         user: null,
//         isLoading: false,
//         isSignIn: false, // Set isSignIn to false
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         isLoading: action.payload,
//       };
   
//     case 'SET_USERNAME':
//       return {
//         ...state,
//         username: action.payload,
//       };
//     case 'UPDATE_LEADERBOARD_DATA':
//       return {
//         ...state,
//         leaderboardData: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default authReducer;
