const names = [
    "Ampong, Ronel",
    "Anedez, Ryan Mark",
    "Baraero, Sean Michael",
    "Biblanias, Yzza",
    "Bolante, Joed",
    "Bracero, Charlz Ivan",
    "Buscaino, Jed",
    "Caracas, Daniel Lloyd",
    "Celimen, John Renz",
    "Chavez, Dan Khervin",
    "Conlu, Joneil",
    "De Luna, Jed Erione",
    "De Vera, Aubrey Kyla",
    "Decial, Jerry",
    "Dela Pieza, Mark Jaspher",
    "Eluna, John Dietrich",
    "Gabriel, Prince Railey",
    "Lapuz, Johann Erl",
    "Llegue, Richard Omie",
    "Lopez, Jasffer John",
    "Magsino, Arravellah",
    "Magyaya, John Albert",
    "Malana, Mary Joy",
    "Manalo, Steinberg",
    "Martinez, Shawn Erwin",
    "Millena, John Joseph",
    "Navarro, Jules Rhenz",
    "Non, Elliser",
    "Orbida, Nethouie Ljoy Angelo",
    "Pable, Joevani",
    "Paloca, Vince Eli",
    "Parala, Arbie",
    "Piqueras, Cristan",
    "Pulido, John Lexter",
    "Recena, Aira Mae",
    "Regachuelo, John Cris",
    "Renomeron, Fritz Mathew",
    "Reyes, Roel Vincent",
    "Roldan, Patrick Owen",
    "Sacurat, Norjane Kyla",
    "Sardoma, Joseph",
    "Sayat, Reian",
    "Tatlonghari, Daniel",
    "Timbang, Romeo Felipe",
    "Torda, Kaide Kerl",
    "Valisno, Christ Mathew",
    "Vidallo, Melquisedec"
  ];
  
  const emailToNameMap: { [key: string]: string } = {};
  
  names.forEach((name, index) => {
    emailToNameMap[`student${index + 1}@face.ams`] = name;
  });
  
  export default emailToNameMap;
  