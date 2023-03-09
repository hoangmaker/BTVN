const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


var danhSachNguoiGui = []
io.on('connection', (socket) => {
  danhSachNguoiGui.push({id: socket.id, soLanNoiBay: 0})
  socket.on('chat message', msg => {
    for (let i=0; i<danhSachNguoiGui.length; i++) {
      if (danhSachNguoiGui[i].id == socket.id) {
        let soLanNoiBayCuaNguoiHienTai = danhSachNguoiGui[i].soLanNoiBay
        if (soLanNoiBayCuaNguoiHienTai < 3) { 
          if (msg == "fuck you") {
            io.emit('chat message', "***")
            soLanNoiBayCuaNguoiHienTai++
            danhSachNguoiGui[i].soLanNoiBay = soLanNoiBayCuaNguoiHienTai
          } else {
            io.emit('chat message', msg)
          }
        } else {
          io.emit('chat message', {thongBao: "Tai khoan cua ban da bi khoa, vi noi tuc qua nhieu", idNguoiBiKhoa: socket.id})
          danhSachNguoiGui[i].soLanNoiBay = 0
        }
      }
    }
    //Đảo ngược chuỗi
    let reverse = ""
      for(let i = msg.length -1; i >= 0; i--){
        reverse += msg[i]
      }
      io.emit('chat message', reverse)  
  });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});