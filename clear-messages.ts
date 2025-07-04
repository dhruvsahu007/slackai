// Clear only messages (DMs and channel messages) but keep users and channels
import { db } from "./server/db";
import { messages, aiSuggestions, meetingNotes } from "./shared/schema";

async function clearMessages() {
  console.log('🧹 Clearing all messages from the database...\n');

  try {
    // First, show current message count
    const currentMessages = await db.select().from(messages);
    console.log(`📊 Current message count: ${currentMessages.length}`);
    
    if (currentMessages.length === 0) {
      console.log('✅ No messages to clear!');
      process.exit(0);
      return;
    }

    // Show breakdown of message types
    const dmMessages = currentMessages.filter(msg => msg.recipientId !== null);
    const channelMessages = currentMessages.filter(msg => msg.channelId !== null);
    
    console.log(`📩 Direct Messages: ${dmMessages.length}`);
    console.log(`📢 Channel Messages: ${channelMessages.length}\n`);

    console.log('⚠️  WARNING: This will permanently delete ALL messages!');
    console.log('   - All direct messages between users');
    console.log('   - All channel messages');
    console.log('   - All AI suggestions and meeting notes');
    console.log('   - Users and channels will be KEPT\n');

    // Delete AI suggestions first (foreign key constraint)
    console.log('🗑️  Clearing AI suggestions...');
    await db.delete(aiSuggestions);
    console.log(`✅ Cleared AI suggestions`);

    // Delete meeting notes
    console.log('🗑️  Clearing meeting notes...');
    await db.delete(meetingNotes);
    console.log(`✅ Cleared meeting notes`);

    // Delete all messages
    console.log('🗑️  Clearing all messages...');
    await db.delete(messages);
    console.log(`✅ Cleared all messages`);

    // Verify deletion
    const finalMessages = await db.select().from(messages);
    
    console.log(`\n📊 Final message count: ${finalMessages.length}`);
    
    if (finalMessages.length === 0) {
      console.log('🎉 Successfully cleared all messages!');
      console.log('');
      console.log('💡 What was cleared:');
      console.log(`   ✅ ${dmMessages.length} direct messages`);
      console.log(`   ✅ ${channelMessages.length} channel messages`);
      console.log('   ✅ All AI suggestions');
      console.log('   ✅ All meeting notes');
      console.log('');
      console.log('🚀 You can now start fresh with clean channels and DMs!');
      console.log('👥 All users and channels have been preserved.');
    } else {
      console.log('❌ Something went wrong - some messages may still exist');
    }

  } catch (error) {
    console.error('❌ Error clearing messages:', error);
  }

  process.exit(0);
}

clearMessages();
