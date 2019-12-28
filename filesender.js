var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');

//a file checker to make sure no overwriting of an existing file
function getGoodFn(path){
  var fn=path;
  var i=1;
  for(;;){
    try {
      if (fs.existsSync(fn)) {
        if ( i>100) //try 100 times
          return "badname_"+i;
        fn=path+"_"+i;
      } else{
        return fn;
      }
    }catch(err) {
      console.error(err);
    }
    i++;
  }
}

// response with a file uploading form
function response8(req,res){
   console.log("In function response");
   res.writeHead(200, {'Content-Type': 'text/html'});
   res.write("path: "+req.url);
 
   fs.readFile('uploadfile.html', function(err, data) {
     res.write(data);
     res.end();
   });
}

function requestHandler(req, res) {
  console.log("debug 1:" + req.url)
  if (req.url == '/fileupload') {
    //var q = url.parse(req.url, true).query;
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var imgname = fields.imagename;
      var orgname = files.filetoupload.name;
      if(imgname == ""){
         imgname=orgname;
      }
      var oldpath = files.filetoupload.path;
      //var newpath = '/Users/yali/homestuff/images/' + imgname;
      var newpath = './images/' + imgname;
      var newpath1= getGoodFn(newpath);
      console.log("debug 4: "+imgname);
      console.log("oldpath: "+oldpath);
      console.log("newpath: "+newpath1);
      console.log("orgname: "+orgname);
      fs.rename(oldpath, newpath1, function (err) {
        if (err) throw err;
      });
      response8(req,res);
    });
  }else{
    console.log("debug 3")
    response8(req,res);
  }
}

var server = http.createServer(requestHandler).listen(3000);
