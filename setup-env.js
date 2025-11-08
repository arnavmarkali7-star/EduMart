const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 EduMart Environment Setup\n');
console.log('Please provide the following information:\n');

rl.question('Enter your MongoDB Atlas password: ', (password) => {
  const envContent = `PORT=5000
MONGODB_URI=mongodb+srv://arnavmarkali7_db_user:${password}@cluster0.ofyt5ma.mongodb.net/edumart?retryWrites=true&w=majority
JWT_SECRET=edumart_secret_key_2024_change_in_production_please
JWT_EXPIRE=7d
NODE_ENV=development
`;

  fs.writeFileSync('.env', envContent);
  console.log('\n✅ .env file created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure your IP is whitelisted in MongoDB Atlas');
  console.log('2. Run: npm install (if not already done)');
  console.log('3. Run: cd client && npm install firebase');
  console.log('4. Run: npm run dev');
  console.log('\n🎉 Setup complete!');
  rl.close();
});

