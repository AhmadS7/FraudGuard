// Simulate Kafka and Zookeeper setup (not real Kafka)
console.log('Starting simulated Kafka and Zookeeper...');

// Mock User Profiles (In-Memory - No Database)
const userProfiles = {};

// Mock Transaction Data Producer (Go-like in JavaScript)
function produceMockTransactions() {
  const transactionTypes = ['payment', 'login', 'account_update'];
  const userIds = ['user123', 'user456', 'user789', 'user000'];
  const ipAddresses = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '127.0.0.1'];

  setInterval(() => {
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const transaction = {
      timestamp: Date.now(),
      type: transactionTypes[Math.floor(Math.random() * transactionTypes.length)],
      userId: userId,
      amount: Math.floor(Math.random() * 1000), // Simulate amount
      ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
    };
    console.log('Producing transaction:', transaction);
    consumeTransaction(transaction); // Directly consume for simulation
  }, 1000); // Produce every 1 second
}

// Mock Kafka Consumer and Preprocessor (Go-like in JavaScript)
function consumeTransaction(transaction) {
  console.log('Consuming transaction:', transaction);
  const preprocessedTransaction = preprocess(transaction);
  invokeLambda(preprocessedTransaction);
}

function preprocess(transaction) {
  // Basic sanitization and feature extraction (example)
  return {
    ...transaction,
    amount: parseFloat(transaction.amount), // Ensure amount is a number
    isHighValue: transaction.amount > 500, // Simple feature
  };
}

// Simulate AWS Lambda Invocation (Go-like in JavaScript)
function invokeLambda(transaction) {
  console.log('Invoking Lambda with:', transaction);
  // In a real scenario, this would be an AWS SDK call to Lambda.

    // Get or create user profile
  if (!userProfiles[transaction.userId]) {
    userProfiles[transaction.userId] = {
      recentTransactions: [],
      usualIpAddress: transaction.ipAddress, // Initialize with first seen IP
      usualTransactionTimes: [], // Could be enhanced to store hour ranges
    };
  }

  const isFraudulent = simulateFraudDetectionModel(transaction, userProfiles[transaction.userId]);

  if (isFraudulent) {
    handleFraudulentTransaction(transaction, isFraudulent);
  } else {
    console.log('Transaction is not fraudulent.');
  }

    // Update user profile (very basic)
  userProfiles[transaction.userId].recentTransactions.push(transaction.timestamp);
    // Keep only the last 10 transactions
  userProfiles[transaction.userId].recentTransactions = userProfiles[transaction.userId].recentTransactions.slice(-10);
  if (Math.random() > 0.8) { // Simulate user mostly using the same IP
        userProfiles[transaction.userId].usualIpAddress = transaction.ipAddress;
  }
}

// Simulate Fraud Detection Model (Go-like, simplified)
function simulateFraudDetectionModel(transaction, userProfile) {
    // Rule 1: High Value
  if (transaction.isHighValue) {
      return "HIGH_VALUE";
  }

  // Rule 2: Velocity (more than 3 transactions in the last 60 seconds)
  const recentTransactions = userProfile.recentTransactions.filter(
    (timestamp) => transaction.timestamp - timestamp < 60000
  );
  if (recentTransactions.length > 3) {
      return "HIGH_VELOCITY";
  }

  // Rule 3: Location Anomaly (Simplified - just checks against the "usual" IP)
  if (transaction.ipAddress !== userProfile.usualIpAddress) {
      return "LOCATION_ANOMALY";
  }

    // Rule 4: Time anomaly (super simplified)
    const hour = new Date(transaction.timestamp).getHours();
    if (hour < 6 || hour > 22) { // Assume most transactions are between 6 AM and 10 PM
        return "UNUSUAL_TIME";
    }

  return false; // Not fraudulent
}

// Handle Fraudulent Transaction (Go-like in JavaScript)
function handleFraudulentTransaction(transaction, reason) {
  console.warn('Fraudulent transaction detected!', transaction, `Reason: ${reason}`);
    // Simulate actions based on alert level
    switch (reason) {
        case "HIGH_VALUE":
            console.log('- Sending alert (simulated)');
            console.log('- Temporarily holding transaction (simulated)');
            break;
        case "HIGH_VELOCITY":
            console.log('- Sending high-priority alert (simulated)');
            console.log('- Blocking transaction (simulated)');
            console.log('- Temporarily locking account (simulated)');
            break;
        case "LOCATION_ANOMALY":
        case "UNUSUAL_TIME":
            console.log('- Sending alert (simulated)');
            console.log('- Requiring additional verification (simulated)');
            break;
        default:
            console.log('- Sending alert (simulated)');
            console.log('- Monitoring account (simulated)');
    }
  console.log('- Storing in quarantine DB (simulated)');
}

// Start the process
produceMockTransactions();
