const fs = require('fs');
const path = require('path');

// Test script to demonstrate real payload processing
const testRealPayloads = () => {
  console.log('🧪 Testing Real WhatsApp Webhook Payloads');
  console.log('==========================================\n');
  
  const payloadFiles = [
    'conversation_1_message_1.json',
    'conversation_1_status_1.json',
    'conversation_2_message_1.json',
    'conversation_2_status_1.json',
    'conversation_2_message_2.json',
    'conversation_2_status_2.json'
  ];
  
  payloadFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${fileName}`);
      return;
    }
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const payload = JSON.parse(fileContent);
      
      console.log(`📄 ${fileName}:`);
      console.log(`   Payload Type: ${payload.payload_type}`);
      console.log(`   GS App ID: ${payload.gs_app_id}`);
      console.log(`   Object: ${payload.metaData?.object || payload.object}`);
      
      // Extract basic info
      const entries = payload.metaData?.entry || payload.entry || [];
      entries.forEach((entry, index) => {
        console.log(`   Entry ${index + 1}:`);
        console.log(`     ID: ${entry.id}`);
        
        if (entry.changes) {
          entry.changes.forEach((change, changeIndex) => {
            console.log(`     Change ${changeIndex + 1}: ${change.field}`);
            
            if (change.value?.messages) {
              console.log(`       Messages: ${change.value.messages.length}`);
              change.value.messages.forEach((msg, msgIndex) => {
                console.log(`         Message ${msgIndex + 1}:`);
                console.log(`           From: ${msg.from}`);
                console.log(`           Type: ${msg.type}`);
                console.log(`           Body: ${msg.text?.body || 'N/A'}`);
                console.log(`           Timestamp: ${msg.timestamp}`);
              });
            }
            
            if (change.value?.statuses) {
              console.log(`       Statuses: ${change.value.statuses.length}`);
              change.value.statuses.forEach((status, statusIndex) => {
                console.log(`         Status ${statusIndex + 1}:`);
                console.log(`           ID: ${status.id}`);
                console.log(`           Status: ${status.status}`);
                console.log(`           Recipient: ${status.recipient_id}`);
                console.log(`           Timestamp: ${status.timestamp}`);
                if (status.conversation) {
                  console.log(`           Conversation ID: ${status.conversation.id}`);
                  console.log(`           Origin: ${status.conversation.origin?.type}`);
                }
              });
            }
          });
        }
      });
      
      console.log('');
    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error.message);
    }
  });
  
  console.log('✅ Payload analysis completed!');
  console.log('\nTo process these payloads:');
  console.log('1. Set up your MongoDB connection in .env');
  console.log('2. Run: npm run process-real');
  console.log('3. Or use the API endpoint: POST /api/test-webhook');
};

// Run the test
testRealPayloads();
