export const isSubset = (gasesList, inputGasesList) => {
  let i = 0;
  let j = 0;
  for (i = 0; i < inputGasesList.length; i++) {
    for (j = 0; j < gasesList.length; j++) {
      if (inputGasesList[i] === gasesList[j].gas) break;
    }

    /* If the above inner loop was
        not broken at all then arr2[i]
        is not present in arr1[] */
    if (j === gasesList.length) return false;
  }

  /* If we reach here then all
    elements of arr2[] are present
    in arr1[] */
  return true;
};
