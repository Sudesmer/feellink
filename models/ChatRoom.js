const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  participants: [{
    type: String,
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  roomType: {
    type: String,
    enum: ['private', 'group'],
    default: 'private'
  },
  roomName: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ lastMessageTime: -1 });

// Static method to find or create chat room
chatRoomSchema.statics.findOrCreateRoom = async function(userId1, userId2) {
  // Sort participants to ensure consistent room creation
  const participants = [userId1, userId2].sort();
  
  let room = await this.findOne({ 
    participants: { $all: participants },
    roomType: 'private'
  });
  
  if (!room) {
    room = await this.create({
      participants: participants,
      roomType: 'private'
    });
  }
  
  return room;
};

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
