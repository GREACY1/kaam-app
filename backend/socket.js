const Message = require('./models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a job chat room
    socket.on('joinRoom', ({ jobId }) => {
      socket.join(jobId);
      console.log(`Socket ${socket.id} joined room ${jobId}`);
    });

    // Send a message
    socket.on('sendMessage', async ({ jobId, senderId, text }) => {
      try {
        // Save message to database
        const msg = await Message.create({
          jobId,
          sender: senderId,
          text
        });

        // Send to everyone in the room instantly
        io.to(jobId).emit('newMessage', {
          _id: msg._id,
          sender: senderId,
          text,
          createdAt: msg.createdAt,
        });

      } catch (err) {
        console.log('Message error:', err);
      }
    });

    // Get old messages when opening chat
    socket.on('getMessages', async ({ jobId }) => {
      try {
        const messages = await Message.find({ jobId })
          .sort({ createdAt: 1 });
        socket.emit('allMessages', messages);
      } catch (err) {
        console.log('Get messages error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};