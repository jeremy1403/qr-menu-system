const bcrypt = require('bcrypt');

async function main() {
  const hash = await bcrypt.hash('Admin1234', 10);
  console.log('Hash:', hash);
  
  const match = await bcrypt.compare('Admin1234', hash);
  console.log('Match:', match);
}

main();