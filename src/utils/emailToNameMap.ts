const names = [
// NAME NAMES HERE
  ];
  
  const emailToNameMap: { [key: string]: string } = {};
  
  names.forEach((name, index) => {
    emailToNameMap[`student${index + 1}@face.ams`] = name;
  });
  
  export default emailToNameMap;
  
