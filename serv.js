var express = require('express')
  , http = require('http')
  , path = require('path')
  , app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.send('Proper HTTP response');
});

app.post('/', function(req, res){
  console.log(req.body);
  res.send('Proper HTTP response');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express HTTP server listening on port ' + app.get('port'));
});
