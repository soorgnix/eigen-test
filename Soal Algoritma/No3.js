INPUT = ['xc', 'dz', 'bbb', 'dz']
QUERY = ['bbb', 'ac', 'dz']

OUTPUT = []
for (i = 0; i < QUERY.length; i++) {
  const result = INPUT.filter(x => x == QUERY[i]);
  OUTPUT[i] = result.length;
}

console.log(...OUTPUT)