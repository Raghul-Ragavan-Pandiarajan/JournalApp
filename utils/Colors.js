const commonColor = {
    colors: {
      commonWhite: '#FFFFFF',
      commonBlack: '#000000',
      commonPurple: '#8568f0',
      commonRed: '#fc1e1e',
      commonGrey: '#EAEAEA'
    },
  };
  
  const light = {
    colors: {
      themeColor: '#FFFFFF',
      white: '#fcfbfc',
      gray: 'gray',
      ...commonColor.colors,
    },
  };
  
  const dark = {
    colors: {
      themeColor: '#000000',
      white: '#FFFFFF',
      gray: 'white',
      ...commonColor.colors,
    },
  };
  
  export default { light, dark };