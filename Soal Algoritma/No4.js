Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

function diagCount(matrix) {
  let diag1 = 0;
  let diag2 = 0;
  let j = matrix.length - 1;
  for (i = 0; i < matrix.length; i++) {
    diag1 += matrix[i][i];
    diag2 += matrix[i][j];
    j--;
  }
  return diag1 - diag2;
}

console.log(diagCount(Matrix)); 