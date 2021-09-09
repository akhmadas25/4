const http = require('http');
const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();
const { request } = require('express');
const uploadFile = require('./middlewares/uploadFile');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const dbConnection = require ('./connection/db');
const session = require('express-session');


app.use(session({
    cookie :  {maxAge : 1000 * 60 * 60 * 2,},
    store : new session.MemoryStore(),
    resave : false,
    saveUninitialized : true,
    secret : 'SangatRahasia',
  })
);
app.use(function(req,res,next){
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

app.use(session({
    cookie :  {maxAge : 1000 * 60 * 60 * 2,},
    store : new session.MemoryStore(),
    resave : false,
    saveUninitialized : true,
    secret : 'SangatRahasia',
  })
);
app.use(function(req,res,next){
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

app.set('view engine', 'hbs');

app.use('/public', express.static(path.join(__dirname, 'public')));


hbs.registerPartials(__dirname + '/views/partials');


app.get('/', function(request,response) {
    const title = 'Provinsi';

    response.render('index', {
        title,
        
      });

});

app.get('/detail', function(request,response) {
    const title = 'Detail';

    response.render('detail', {
        title,
        
      });

});

app.get('/addProvinsi', function(request,response) {
    const title = 'AddProvinsi';

    response.render('addProvinsi', {
        title,
        
      });

});

app.post('/addProvinsi', uploadFile('image') ,function(request,response) {
    var {nama, tanggal} = request.body;
    var image = '';
  
    if (request.file){
      image = request.file.filename;
    }
  
    if (nama == '' || image == ''  || tanggal == '') {
      request.session.message = {
        type: 'danger',
        message: 'Please insert all field!',
      };
      return response.redirect('/addProvinsi');
    }
      const query = `INSERT INTO provinsi_tb (nama, photo, tanggal) VALUES ("${nama}", "${image}","${tanggal}")`;
      dbConnection.getConnection(function(err,conn){
        if(err) throw err;
          conn.query(query,function(err,result) {
            if (err) throw err;
  
            request.session.message = {
              type: 'success',
              message: 'Add artis has success',
            };
  
            response.redirect('/addProvinsi');
          });
  
          conn.release();
       });
  });

app.get('/addKabupaten', function(request,response) {
    const title = 'AddKabuupaten';
    const query = `SELECT id, nama FROM provinsi_tb`;
  
    dbConnection.getConnection(function (err,conn) {
      if (err) throw err;
      conn.query(query, function (err, results) {
        if (err) throw err;
        const provinsi = [];
  
        for (var result of results) {
          provinsi.push({
            id: result.id,
            nama: result.nama,
          });
        }
  
        response.render('addKabupaten', {
          title,
          
          provinsi,
        });
      });
    });
  });

app.post('/addKabupaten', uploadFile('image') ,function(request,response) {
    var {nama, tanggal} = request.body;
    var image = '';
  
    if (request.file){
      image = request.file.filename;
    }
  
    if (nama == '' || image == ''  || tanggal == '') {
      request.session.message = {
        type: 'danger',
        message: 'Please insert all field!',
      };
      return response.redirect('/addKabupaten');
    }
      const query = `INSERT INTO kabupaten_tb (nama, photo, tanggal) VALUES ("${nama}", "${image}","${tanggal}")`;
      dbConnection.getConnection(function(err,conn){
        if(err) throw err;
          conn.query(query,function(err,result) {
            if (err) throw err;
  
            request.session.message = {
              type: 'success',
              message: 'Add artis has success',
            };
  
            response.redirect('/addKabupaten');
          });
  
          conn.release();
       });
  });



const port = 5000;
const server = http.createServer(app);
server.listen(port);
console.debug(`Server listening on port ${port}`);