
'use strict';
var fs        = require('fs');
var pathFn    = require('path');
var mkdirp    = require('mkdirp');
var absolutePathReg = /^[a-zA-Z0-9]*?\:\/\//

module.exports.initCopy = function(assetDirName, assetFiles){
  
  var hexoAssetPath = pathFn.join(process.env.PWD , assetDirName);
  var hexoAssetPath_sampleDir = pathFn.join(process.env.PWD , assetDirName , "sample");
  if(!fs.existsSync(hexoAssetPath)){
    //create dir
    mkdirp.sync( hexoAssetPath_sampleDir );
    console.log("\u001b[32m[hexo-generator-amp] (initial copy asset)\u001b[0m asset dir: "+ hexoAssetPath_sampleDir);
    
  }
  for(var i=0; i< assetFiles.length; i++){
    if(!fs.existsSync( pathFn.join(hexoAssetPath_sampleDir , pathFn.basename(assetFiles[i])) )){
      mkdirp.sync( pathFn.dirname( pathFn.join(hexoAssetPath_sampleDir , pathFn.basename(assetFiles[i])) ));
      fs.createReadStream( pathFn.join(__dirname , assetFiles[i]) ).pipe(fs.createWriteStream( pathFn.join(hexoAssetPath_sampleDir , pathFn.basename(assetFiles[i])) ));
    }
  }
  
  return true;
};

module.exports.copyAssets = function(assetDirName, distDirName ,copyFiles){
  var hexoAssetPath = pathFn.join(process.env.PWD , assetDirName);
  if(fs.existsSync(hexoAssetPath)){
    //copy asset dir
    if( !fs.existsSync(pathFn.join(process.env.PWD , "source" , distDirName)) )mkdirp.sync( pathFn.join(process.env.PWD , "source" , distDirName) );
    for(var i=0; i< copyFiles.length; i++){
      if(fs.existsSync( pathFn.join(hexoAssetPath , copyFiles[i]) )){
        // fs.createReadStream( pathFn.join(hexoAssetPath , copyFiles[i]) ).pipe(fs.createWriteStream( pathFn.join(process.env.PWD , "source" , distDirName , pathFn.basename(copyFiles[i])) ));
        mkdirp.sync( pathFn.dirname( pathFn.join(process.env.PWD , "source" , distDirName , copyFiles[i])));
        fs.createReadStream( pathFn.join(hexoAssetPath , copyFiles[i]) ).pipe(fs.createWriteStream( pathFn.join(process.env.PWD , "source" , distDirName , copyFiles[i]) ));
      }else if( absolutePathReg.test(copyFiles[i]) ){
        // External path
      }else{
        console.log("\u001b[31m[hexo-generator-amp] (error) not found asset file. \u001b[0mplease check setting option, and  path: "+  pathFn.join(hexoAssetPath , copyFiles[i]) );
        return false
      }
    }
    return true;
  }else{
    console.log("\u001b[31m[hexo-generator-amp] (error) not found asset Directory. please check setting option, and  path: "+  hexoAssetPath );
    return false;
  }
};