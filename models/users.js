const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId

const userSchema = new Schema({
    userId: { type : ObjectId, required: false },
    username: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    emailToken: { type: String, required: true},
    isVerified: { type: Boolean, required: true}
  });
  
  exports.Users = mongoose.model("Users", userSchema);
  

  const fileSchema = new Schema({
    fileId: { type : ObjectId,required: false },
    title: { type: String, required: true},
    description: { type: String, required: true},
    filename: { type: String, required: true},
    filetype: { type: String, required: true}
  });
  
  exports.Files = mongoose.model("Files", fileSchema);


  const downloadSchema = new Schema({
    downloadId: { type : ObjectId,required: false },
    file: {type: Schema.Types.ObjectId, ref: 'Files'},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
  });
  
  exports.Downloads = mongoose.model("Downloads", downloadSchema);

  const emailingSchema = new Schema({
    downloadId: { type : ObjectId,required: false },
    file: {type: Schema.Types.ObjectId, ref: 'Files'},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
  });
  
  exports.Emailings = mongoose.model("Emailings", emailingSchema);
  