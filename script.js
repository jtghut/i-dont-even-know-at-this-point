// A simple Node.js script that demonstrates various capabilities

// Utility function to format dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  }).format(date);
};

// Function to fetch data from an API
async function fetchRandomUsers(count = 3) {
  try {
    console.log(`Fetching ${count} random users...`);
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return [];
  }
}

// Main function to run our demo
async function main() {
  console.log('=== Node.js Demo Script ===');
  console.log(`Current time: ${formatDate(new Date())}`);
  console.log('\nNode.js version:', process.version);
  console.log('Platform:', process.platform);
  
  // File system operations
  console.log('\n=== File System Demo ===');
  const fs = await import('fs/promises');
  try {
    // Create a temporary file
    await fs.writeFile('temp.txt', 'Hello, Node.js!');
    console.log('Created temp.txt file');
    
    // Read the file
    const content = await fs.readFile('temp.txt', 'utf8');
    console.log('File content:', content);
    
    // Delete the file
    await fs.unlink('temp.txt');
    console.log('Deleted temp.txt file');
  } catch (err) {
    console.error('File system error:', err.message);
  }
  
  // API fetch demo
  console.log('\n=== API Fetch Demo ===');
  const users = await fetchRandomUsers();
  console.log('Random users:');
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name.first} ${user.name.last} (${user.email})`);
  });
  
  // Simple calculation demo
  console.log('\n=== Calculation Demo ===');
  const numbers = Array.from({length: 10}, () => Math.floor(Math.random() * 100));
  console.log('Random numbers:', numbers);
  console.log('Sum:', numbers.reduce((a, b) => a + b, 0));
  console.log('Average:', numbers.reduce((a, b) => a + b, 0) / numbers.length);
  console.log('Max:', Math.max(...numbers));
  console.log('Min:', Math.min(...numbers));
  
  console.log('\n=== Demo Complete ===');
}

// Run the main function
main().catch(err => console.error('Main error:', err));

