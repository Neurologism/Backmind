export const arraysEqual = (array1: any[], array2: any[]): boolean => {
  if (array1 === array2) return true;
  if (array1 == null || array2 == null) return false;
  if (array1.length !== array2.length) return false;
  return array1.every((element, index) => element === array2[index]);
};
