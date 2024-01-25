const makeid = (
  length: number,
  onlyNums: boolean = true,
  useChars: string = '',
): string => {
  let result = '';
  let characters = '';

  if (useChars != '') {
    characters = useChars;
  } else {
    if (onlyNums) characters = '0123456789';
    else characters = 'ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789';
  }

  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export default makeid;
