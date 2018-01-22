"use strict";
app.controller("productController", function($scope, $location, $http, $timeout){
  $scope.currentStatus = 'A';
  $scope.showImage = false;
  $scope.productCheckedList = {};
  $scope.productCheckedArray = [];
  $scope.totalPrice = 0;
  $scope.totalTime = 0;
  $scope.creditcardMessage = "";
  $scope.payer = 0;
  $scope.tradeNo = 0;
  $scope.fingerprintImageURL = "images/default.png";
  $scope.fingerprintStatus = 0;
  $scope.fingerprintStatusMessage = "";
  $scope.functionSelect = ''
  $scope.arrowImageURL = "images/arrow.jpg";
  $scope.minu_Buffer = "";
  $scope.userId="";
  $scope.fpIndex="";
  $scope.scoreLevel=2500;
  $scope.NumofMinutiae=0;
  $scope.apiURL = "http://104.215.55.168:3000";

  $scope.processAgainFunction = function(){
    //$scope.currentStatus = 'R';
    console.log("Again ~ " + $scope.functionSelect);
    $scope.refreshHTML();
    switch($scope.functionSelect)
    {
    	case 'S':
    	$scope.processSearchFunction();
    	break;

    	case 'V':
    	$scope.processVerFunction();
    	break;

    }

  };
  
  $scope.processSearchFunction = function(){
    $scope.processBioServergetServerInfo();
    $scope.functionSelect = 'S';
    $scope.fingerprintImageURL = "images/default.png";
    console.log("search ~ " + $scope.functionSelect);
    $scope.processFingerprintScan();
    
  };
  
  $scope.processAddFunction = function(){
    $scope.functionSelect = 'A';
    $scope.fingerprintImageURL = "images/default.png";
    console.log("Add ~ "+ $scope.functionSelect);
    $scope.getFingerprintScan();

    
    
  };

  $scope.processDelFunction = function(){
    $scope.functionSelect = 'D';
    console.log("Del ~ "+ $scope.functionSelect);
    //$scope.processFingerprintScan();
    $scope.getUserData();
  };

  $scope.processVerFunction = function(){
    $scope.functionSelect = 'V';
    console.log("Ver ~ "+ $scope.functionSelect);
   // $scope.processFingerprintScan();
    $scope.getUserData();
  };



  $scope.processFingerprintScan = function(){
    $scope.currentStatus = 'B';
    $scope.showImage = true;
    $timeout(function(){
      snapImage($scope);
    }, 500);
  };

  
  $scope.getFingerprintScan = function(){
    $scope.currentStatus = 'C';
    $scope.showImage = true;
    $timeout(function(){
      snaphot($scope);
    }, 500);
  };
  
    /*
  $scope.processFingerprintScan = function(){
    $scope.currentStatus = 'B';
    $scope.showImage = true;
    $timeout(function(){
      snapImage($scope);
    }, 500);
  };
*/
 $scope.getUserData = function(userMinutiae){
    
    if($scope.functionSelect == 'A')
       $scope.currentStatus = 'Z';
    else if($scope.functionSelect == 'V')
        $scope.currentStatus = 'Y';
    else if($scope.functionSelect == 'D')
    	$scope.currentStatus = 'D';

     console.log("userInput status~ "+$scope.currentStatus);
 };
 

  $scope.submit = function(){
  	if($scope.functionSelect == 'D')
  	{
  		  $scope.userId=document.getElementById("userid").value;
        var e = document.getElementById("fpid");
        $scope.fpIndex = e.options[e.selectedIndex].value;
  	}
  	else
  	{
    	$scope.userId=document.getElementById("userID").value;
    	var e = document.getElementById("fpID");
      $scope.fpIndex = e.options[e.selectedIndex].value;

    }
    console.log("userid: " + $scope.userId);
    console.log("fpID: "+$scope.fpIndex);
   
   //var e =String($scope.fpIndex);
   //console.log("index num: "+ e);
    if( $scope.userId=="")
    { 
     alert("Input User ID~");
     return;
    }    
    else if(($scope.fpIndex =="") ||(e<1) || (e>10))
    {
       console.log($scope.fpIndex<"1");
       console.log($scope.fpIndex>"10");
      alert("Input FP ID(1-10)~");
      return;
    }
    if($scope.functionSelect == 'D')
	    $scope.DelFPData( $scope.userId, $scope.fpIndex ); 
	else  
		$scope.AddFPData( $scope.minu_Buffer);

	};

  $scope.nextStep = function(){
    $scope.userId=document.getElementById("UID").value;
    console.log("userid: " + $scope.userId);
    if( $scope.userId=="")
    { 
       alert("Input User ID~");
       return;
    }    
    //$scope.VerFPData( $scope.minu_Buffer);
    $scope.processFingerprintScan();
  };

  $scope.toggleCheckedProduct = function(key){
    if($scope.productCheckedList[key] === true){
      $scope.totalPrice += $scope.productsData[key].price;
      $scope.productCheckedArray.push(key);
    }
    else{
      $scope.totalPrice -= $scope.productsData[key].price;
      var a = $scope.productCheckedArray.indexOf(key);
      $scope.productCheckedArray.splice(a, 1);
    }
  };
  
  $scope.resetCheckedProducts = function(){
    for (var i = 0; i < $scope.productsData.length; i++) {
                $scope.productCheckedList[i] = false;
            }
            $scope.productCheckedArray = [];
    $scope.totalPrice = 0;
  };
  
  $scope.processBioServer = function(userMinutiae){
    // console.log(userMinutiae);
    var data = {
       minutiae: userMinutiae
    };
    
    // var apiURL = "http://192.168.1.63:3000/api/identifyFP";
    // var apiURL = "http://138.91.18.226:3000/api/identifyFP";
    //var apiURL = "http://52.175.157.145:3000/api/identifyFP";
    var apiURL = "http://104.215.55.168:3000/api/identifyFP";
   
    console.log("bio server");
    return $http({
      url: apiURL,
      data: $.param(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(function(data) {
      console.log(data);
      $scope.processServerFeedBack(data);
     /* if(data.data.code == 200){
        $scope.currentStatus = 'C';
        $scope.payer = data.data.data.userId;
        $scope.tradeNo = data.data.data.fpIndex;
        $scope.totalPrice = data.data.data.score;
        $scope.totalTime = data.data.resTime;

      }
      else{
        $scope.currentStatus = 'D';
        $scope.totalTime = data.data.resTime;
      }*/
    }, function(err) {
      console.log(err);
      alert("Failure !");
    });
    
    //console.log(data);
  };

   $scope.processBioServerAddApi = function(userMinutiae, userId, fpIndex){
    // console.log(userMinutiae);
    
    var data = {
       userId: userId,
       minutiae: userMinutiae,
       fpIndex:fpIndex
    };
    
    // var apiURL = "http://192.168.1.63:3000/api/identifyFP";
    // var apiURL = "http://138.91.18.226:3000/api/identifyFP";
    //var apiURL = "http://52.175.157.145:3000/api/addFP";
    var apiURL = "http://104.215.55.168:3000/api/addFP";
    
    console.log("bio server");
    return $http({
      url: apiURL,
      data: $.param(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(function(data) {
     
      console.log(data);
       $scope.processServerFeedBack(data);
     
    }, function(err) {
      console.log(err);
       alert("Failure");
    });
    

    //console.log(data);
  };
  //////////////////// getServerInfo
  $scope.processBioServergetServerInfo = function(userMinutiae){
    console.log("processBioServergetServerInfo");
    var data = {
       //minutiae: userMinutiae
    };
    
    // var apiURL = "http://192.168.1.63:3000/api/identifyFP";
    // var apiURL = "http://138.91.18.226:3000/api/identifyFP";
    //var apiURL = "http://52.175.157.145:3000/api/identifyFP";
    var apiURL = "http://104.215.55.168:3000/api/getServerInfo";
    
    console.log("Get Server Info");
    return $http({
      url: apiURL,
      data: $.param(data),
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(function(data) {
      //console.log(data);
     // $scope.processServerFeedBack(data);
       $scope.NumofMinutiae = data.data.count;
        console.log("NumofMinutiae"+$scope.NumofMinutiae);
     /* if(data.data.code == 200){
        $scope.currentStatus = 'C';
        $scope.payer = data.data.data.userId;
        $scope.tradeNo = data.data.data.fpIndex;
        $scope.totalPrice = data.data.data.score;
        $scope.totalTime = data.data.resTime;

      }
      else{
        $scope.currentStatus = 'D';
        $scope.totalTime = data.data.resTime;
      }*/
    }, function(err) {
      console.log(err);
      alert("Failure !");
    });
    
    //console.log(data);
  };

  /////////////////////
// fs.access('/HIS/123.png', fs.constants.R_OK | fs.constants.W_OK, (err) => {
 // 			console.log(err ? 'no access!' : 'can read/write');
//	});

  $scope.processServerFeedBack = function(data){
  		var fs = require('fs');

        if(data.data.code == 403){
           alert("NONE");
           $scope.functionSelect = 'Q';
        }
        else if(data.data.code == 404){
            
            //alert("NONE");
            console.log("404! "+$scope.functionSelect);
           // $scope.functionSelect = 'Q';


        }
        else if(data.data.code == 406){
            alert("Data Error");
            $scope.functionSelect = 'Q';
        }
        else if(data.data.code == 501){
            alert("Input Error");
            $scope.functionSelect = 'Q';
        }
        else if(data.data.code != 200){
        	 alert("Error");
            $scope.functionSelect = 'Q';
        }
      /*  else{
        	//$scope.fingerprintImageURL = __dirname + '/HIS/' +
            fs.access('/HIS/123.png', fs.constants.R_OK | fs.constants.W_OK, (err) => {
  				console.log(err ? 'no access!' : 'can read/write');
  				 $scope.ShowResult();
	  		});
        }*/


        switch($scope.functionSelect)
        {
           case 'S':
           console.log("Search api parse...");
           if(data.data.code != 404){
            $scope.payer = data.data.data.userId;
            $scope.tradeNo = data.data.data.fpIndex;
            $scope.totalPrice = data.data.data.score;
            
           }
           else{
             console.log("404 !!!");
              $scope.totalPrice = 0;
           }
            $scope.totalTime = data.data.resTime/1000;
            $scope.fingerprintImageURL = __dirname + '/HIS/' + $scope.payer+".png";
           // var checkDir = fs.existsSync($scope.fingerprintImageURL);
           var checkDir=1;
			//console.log("file is Exist: "+checkDir);
      console.log("fpid: "+$scope.tradeNo);

			if(checkDir && ($scope.totalPrice > $scope.scoreLevel))
			      $scope.currentStatus = 'S';
			else{
				//alert("無此使用者資料或無相關紀錄");
              //$scope.refreshHTML(); 
               $scope.payer ="NONE"
              $scope.currentStatus = 'F';
			}
           break;

           case 'A':
           console.log("Add api parese ...");
           console.log(data.data.code);
          if(data.data.code == 200)
          {
            alert("Done");

          }
          // $scope.AddFPData(minu_codeBuffer.toString('hex'));
           $scope.refreshHTML();
           break;

           case 'D':
           console.log("Delete api parese ...");
           console.log(data.data.code);
          if(data.data.code == 200)
          {
            alert("Done");

          }
           $scope.refreshHTML();
           break;

           case 'V':
           console.log("Verify api..." + $scope.currentStatus );
       		$scope.payer = $scope.userId;
            $scope.tradeNo = data.data.data.fpIndex;
            $scope.totalPrice = data.data.data.score;
            $scope.totalTime = data.data.resTime/1000;
            $scope.fingerprintImageURL = __dirname + '/HIS/' + $scope.payer+".png";
             //var checkDir = fs.existsSync($scope.fingerprintImageURL);
             var checkDir = 1;
			//console.log("file is Exist: "+checkDir);
      console.log("fpid: "+$scope.tradeNo);
			if(checkDir && ($scope.totalPrice > $scope.scoreLevel))
			      $scope.currentStatus = 'S';
			else{
				//alert("無此使用者資料或無相關紀錄");
              //$scope.refreshHTML(); 
              $scope.payer = "NONE"
              $scope.currentStatus = 'F';
			}
           break;

           case 'Q':
           console.log("QQ");
           $scope.refreshHTML();

           break;
           

        }
        console.log("processServerFeedBack...END");
         
  };

  $scope.refreshHTML = function(){
    	  console.log("Refrsh HTML page");
          $scope.showImage = false;
          $scope.fingerprintImageURL = "images/default.png";
          $scope.minu_Buffer = "";
          $scope.userId="";
          $scope.fpIndex="";
          $scope.datapackage={};
          document.getElementById("userID").value="";
          //document.getElementById("fpID").value="";
           document.getElementById("fpID").selectedIndex = "0";
          document.getElementById("UID").value="";
          document.getElementById("userid").value="";
         // document.getElementById("fpid").value="";
          document.getElementById("fpid").selectedIndex = "0";
          $scope.currentStatus = 'A';
  };

  $scope.processBioServerDelApi = function(userId,fpIndex){
    // console.log(userMinutiae);
    
    var data = {
       userId: userId,
       fpIndex:fpIndex
    };
     
    
    // var apiURL = "http://192.168.1.63:3000/api/identifyFP";
    // var apiURL = "http://138.91.18.226:3000/api/identifyFP";
    //var apiURL = "http://52.175.157.145:3000/api/deleteFP";
    var apiURL = "http://104.215.55.168:3000/api/deleteFP";
    
    console.log("bio server - deleteFP");
    return $http({
      url: apiURL,
      data: $.param(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(function(data) {
      console.log(data);
       $scope.processServerFeedBack(data);
     /* if(data.data.code == 200){
        $scope.currentStatus = 'C';
     //   $scope.payer = data.data.data.userId;
     //   $scope.tradeNo = data.data.data.fpIndex;
     //   $scope.totalPrice = data.data.data.score;
        $scope.totalTime = data.data.resTime;
      }
      else{
        $scope.currentStatus = 'R';
        $scope.totalTime = data.data.resTime;
      }*/
    }, function(err) {
      console.log(err);
      alert("Server Response Fail ~");
    });
    
    //console.log(data);
  };

  $scope.processBioServerVerApi = function(userId, userMinutiae){
    // console.log(userMinutiae);
    
    var data = {
       userId: userId,
       minutiae: userMinutiae
    };
    
    // var apiURL = "http://192.168.1.63:3000/api/identifyFP";
    // var apiURL = "http://138.91.18.226:3000/api/identifyFP";
    //var apiURL = "http://52.175.157.145:3000/api/verifyFP";
    var apiURL = "http://104.215.55.168:3000/api/verifyFP";

    console.log("bio server");
    return $http({
      url: apiURL,
      data: $.param(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(function(data) {
      console.log(data);
      $scope.processServerFeedBack(data);
      /*if(data.data.code == 200){
        $scope.currentStatus = 'C';
        $scope.payer = data.data.data.userId;
        $scope.tradeNo = data.data.data.fpIndex;
        $scope.totalPrice = data.data.data.score;
        $scope.totalTime = data.data.resTime;
      }
      else{
        $scope.currentStatus = 'D';
        $scope.totalTime = data.data.resTime;
      }*/
    }, function(err) {
      console.log(err);
       alert("Failure");
    });
    
    //console.log(data);
  };

  $scope.processCheckOut = function(){
    $scope.currentStatus = 'B';
    $scope.showImage = false;
  };
  
  $scope.showProducts = function(){
    $scope.currentStatus = 'A';
    $scope.showImage = false;
  };
  
  $scope.identifyFPData = function(fpCode){
 	console.log(fpCode);
    var DataTypes = require("data-struct").DataTypes;
    var DataReader = require("data-struct").DataReader;
    var DataWriter = require("data-struct").DataWriter;

    var startTime = 0;
    var endTime = 0;
    // 發起連線 開始 =======
    startTime = new Date().getTime();
      // 連線 結束 =======
      endTime = new Date().getTime();
      // 計算花多久時間
      $scope.totalTime = (endTime - startTime) / 1000 + " sec";

        $scope.processBioServer(fpCode);

    var buf  = new Buffer(fpCode, 'hex');
   
    var query = {
      messageLength: 520,
      messageCode: 106,
      sequenceNumber: 1,
      fp_iso_code: buf
    };
    
    var queryScheme = {
      messageLength: DataTypes.uint32,
      messageCode: DataTypes.uint16,
      sequenceNumber:  DataTypes.uint16,
      fp_iso_code: DataTypes.shortBuffer
    };
    
    var queryBuf = DataWriter(query, queryScheme);
    
    //console.log(queryBuf);
    // client.write(queryBuf);
    console.log("identifyFPData END~");
  };
  
  $scope.AddFPData = function(fpCode){
 
    //console.log(fpCode);
    var DataTypes = require("data-struct").DataTypes;
    var DataReader = require("data-struct").DataReader;
    var DataWriter = require("data-struct").DataWriter;

    var startTime = 0;
    var endTime = 0;
    // 發起連線 開始 =======
    startTime = new Date().getTime();
      // 連線 結束 =======
    endTime = new Date().getTime();
      // 計算花多久時間
    $scope.totalTime = (endTime - startTime) / 1000 + " sec";

    console.log("miuntiae:"+fpCode);
    console.log("ID"+ $scope.userId);
    console.log("index:"+$scope.fpIndex);
    $scope.processBioServerAddApi(fpCode, $scope.userId, $scope.fpIndex);

    var buf  = new Buffer(fpCode, 'hex');
    
    var query = {
      messageLength: 520,
      messageCode: 106,
      sequenceNumber: 1,
      fp_iso_code: buf
    };
    
    var queryScheme = {
      messageLength: DataTypes.uint32,
      messageCode: DataTypes.uint16,
      sequenceNumber:  DataTypes.uint16,
      fp_iso_code: DataTypes.shortBuffer
    };
    
    var queryBuf = DataWriter(query, queryScheme);
    //console.log(queryBuf);
    // client.write(queryBuf);
   
    console.log("AddFPData END~");
  };

  $scope.DelFPData = function(fpId, fpCode){

    var DataTypes = require("data-struct").DataTypes;
    var DataReader = require("data-struct").DataReader;
    var DataWriter = require("data-struct").DataWriter;

    var startTime = 0;
    var endTime = 0;
    // 發起連線 開始 =======
    startTime = new Date().getTime();
      // 連線 結束 =======
    endTime = new Date().getTime();
      // 計算花多久時間
    $scope.totalTime = (endTime - startTime) / 1000 + " sec";

    $scope.processBioServerDelApi(fpId,fpCode);

   /* var buf  = new Buffer(fpCode, 'hex');
    
    var query = {
      messageLength: 520,
      messageCode: 106,
      sequenceNumber: 1,
      fp_iso_code: buf
    };
    
    var queryScheme = {
      messageLength: DataTypes.uint32,
      messageCode: DataTypes.uint16,
      sequenceNumber:  DataTypes.uint16,
      fp_iso_code: DataTypes.shortBuffer
    };
    
    var queryBuf = DataWriter(query, queryScheme);
    */
    //console.log(queryBuf);
    // client.write(queryBuf);
    console.log("DelFPData END~");
  };  

  $scope.VerFPData = function(fpCode){
    console.log();
  
    var DataTypes = require("data-struct").DataTypes;
    var DataReader = require("data-struct").DataReader;
    var DataWriter = require("data-struct").DataWriter;

    var startTime = 0;
    var endTime = 0;
    // 發起連線 開始 =======
    startTime = new Date().getTime();
      // 連線 結束 =======
    endTime = new Date().getTime();
      // 計算花多久時間
    $scope.totalTime = (endTime - startTime) / 1000 + " sec";

    $scope.processBioServerVerApi($scope.userId,fpCode);

   /* var buf  = new Buffer(fpCode, 'hex');
    
    var query = {
      messageLength: 520,
      messageCode: 106,
      sequenceNumber: 1,
      fp_iso_code: buf
    };
    
    var queryScheme = {
      messageLength: DataTypes.uint32,
      messageCode: DataTypes.uint16,
      sequenceNumber:  DataTypes.uint16,
      fp_iso_code: DataTypes.shortBuffer
    };
    
    var queryBuf = DataWriter(query, queryScheme);
    */
    //console.log(queryBuf);
    // client.write(queryBuf);
    console.log("identifyFPData END~");
  };    
  
});


function snaphot($scope){

  var ffi = require('ffi');
  var ref = require('ref');
  var path = require('path');
  var fs = require('fs');

  
  var dllFM220api = ffi.Library(__dirname + '/fm220api.dll', {
    "FP_ConnectCaptureDriver": [ 'int', [ 'int' ] ],
    "FP_DisconnectCaptureDriver": ['int', ['int']],  
    "FP_CreateImageHandle": ['int', ['int', 'int', 'int']],
    "FP_DestroyImageHandle": ['int', ['int', 'int']],
    "FP_GetImage": ['int', ['int', 'int']],
    "FP_SaveImage": ['int', ['int', 'int', 'int', 'string']],
    "FP_GetTemplate": ['int', ['int', 'string', 'int', 'int']],
    "FP_Snap": ['int', ['int']]
  });
   // $scope.currentStatus = 'B';
  var FM220Connection = dllFM220api.FP_ConnectCaptureDriver(0);
  if(FM220Connection == 0)
  {
    console.log("FM220 connection failed!!");
    dllFM220api.FP_DisconnectCaptureDriver(FM220Connection);   
    $scope.fingerprintStatus = 1;
  }
  else{
    console.log("FM220 Connected.");
    
    var FM220SnapStatus = 1;
    var FM220ImageHandle = dllFM220api.FP_CreateImageHandle(FM220Connection, 8, 10);
    
    while(FM220SnapStatus == 1){
      if(FM220ImageHandle == 0){
        console.log("FM220 image handle creation failed.");
        $scope.fingerprintStatus = 2;
        break;
      }
      else{
        var tempCapture = dllFM220api.FP_Snap(FM220Connection);
        var FM220GetImageStatus = dllFM220api.FP_GetImage(FM220Connection, FM220ImageHandle);
        if(FM220GetImageStatus == 0){
          var FileName = new Date().getTime()+'_image.bmp';
          var appDir = path.dirname(require.main.filename);
          //console.log(appDir);
          
         // console.log(path.parse(appDir).root);
          //fs.mkdirSync();
         //if (!fs.existsSync(path.parse(appDir).root + '/capture/')) {
         //   console.log("Create Capture Folder");
         //   fs.mkdirSync(path.parse(appDir).root + '/capture/');
         //}
          //  var imageFileName = path.parse(appDir).root + '/capture/' + FileName;
           var imageFileName = __dirname + '/capture/' + FileName;
          var imageFileName = __dirname + '/capture/' + new Date().getTime()+'_image.bmp';
          
          var imageSaveStatus = dllFM220api.FP_SaveImage(FM220Connection, FM220ImageHandle, 13, imageFileName);

          if(imageSaveStatus == 0){
            $scope.fingerprintImageURL = imageFileName;
             
          }   
          else{
            $scope.fingerprintStatus = 4;
            console.log('FM220 Image Saving Failed.');
            console.log(imageFileName);
          }
            
        }
        else{
          $scope.fingerprintStatus = 3;
          console.log('Get Image Failed.');
        }
          
        
        if(tempCapture == 0){
          console.log("Image Captured.");
          FM220SnapStatus = 0;
          $scope.fingerprintStatus = 5;
          
        }
      }     
    }
    
    if($scope.fingerprintStatus == 5){
      $scope.showImage = false;
    
      var minu_codeBuffer  = new Buffer(512);
      var getTemplateStatus = dllFM220api.FP_GetTemplate(FM220Connection, minu_codeBuffer, 1, 0);
      if(getTemplateStatus == 0){
       console.log("get FP image name: "+FileName);  
        $scope.minu_Buffer= minu_codeBuffer.toString('hex');
       
       $scope.getUserData(minu_codeBuffer.toString('hex'));
      }
      else
       console.log(getTemplateStatus);
    }        
    else
      console.log($scope.fingerprintStatus);
    
    dllFM220api.FP_DestroyImageHandle(FM220Connection, FM220ImageHandle);
    dllFM220api.FP_DisconnectCaptureDriver(FM220Connection);
    console.log("snaphot END~");
  } 
} 

function snapImage($scope){

  var ffi = require('ffi');
  var ref = require('ref');
  var path = require('path');
  var fs = require('fs');
  
  var dllFM220api = ffi.Library(__dirname + '/fm220api.dll', {
    "FP_ConnectCaptureDriver": [ 'int', [ 'int' ] ],
    "FP_DisconnectCaptureDriver": ['int', ['int']],
    "FP_CreateImageHandle": ['int', ['int', 'int', 'int']],
    "FP_DestroyImageHandle": ['int', ['int', 'int']],
    "FP_GetImage": ['int', ['int', 'int']],
    "FP_SaveImage": ['int', ['int', 'int', 'int', 'string']],
    "FP_GetTemplate": ['int', ['int', 'string', 'int', 'int']],
    "FP_Snap": ['int', ['int']]
  });
  

  var FM220Connection = dllFM220api.FP_ConnectCaptureDriver(0);
  if(FM220Connection == 0)
  {
    console.log("FM220 connection failed!!");
    dllFM220api.FP_DisconnectCaptureDriver(FM220Connection);
    $scope.fingerprintStatus = 1;
  }
  else{
    console.log("FM220 Connected...");
    
    var FM220SnapStatus = 1;
    var FM220ImageHandle = dllFM220api.FP_CreateImageHandle(FM220Connection, 8, 10);
    
    while(FM220SnapStatus == 1){
      if(FM220ImageHandle == 0){
        console.log("FM220 image handle creation failed.");
        $scope.fingerprintStatus = 2;
        break;
      }
      else{
        var tempCapture = dllFM220api.FP_Snap(FM220Connection);
        var FM220GetImageStatus = dllFM220api.FP_GetImage(FM220Connection, FM220ImageHandle);
        if(FM220GetImageStatus == 0){
           var FileName = new Date().getTime()+'_image.bmp';
           var appDir = path.dirname(require.main.filename);
            //console.log(appDir);
          
          //console.log(path.parse(appDir).root);
         // fs.mkdirSync();
        // if (!fs.existsSync(path.parse(appDir).root + '/capture/')) {
         //   console.log("Create Capture Folder");
         //   fs.mkdirSync(path.parse(appDir).root + '/capture/');
        // }
         //   var imageFileName = path.parse(appDir).root + '/capture/' + FileName;
           var imageFileName = __dirname + '/capture/' + FileName;
          var imageSaveStatus = dllFM220api.FP_SaveImage(FM220Connection, FM220ImageHandle, 13, imageFileName);
          if(imageSaveStatus == 0){
            $scope.fingerprintImageURL = imageFileName;
          }   
          else{
            $scope.fingerprintStatus = 4;
            //console.log('FM220 Image Saving Failed.');
          }
            
        }
        else{
          $scope.fingerprintStatus = 3;
          console.log('Get Image Failed.');
        }
          
        
        if(tempCapture == 0){
          console.log("Image Captured...");
          console.log(imageFileName);
          FM220SnapStatus = 0;
          $scope.fingerprintStatus = 5;
          
        }
      }     
    }
    
    if($scope.fingerprintStatus == 5){
      $scope.showImage = false;
    // $scope.currentStatus = 'L';

      var minu_codeBuffer  = new Buffer(512);
      var getTemplateStatus = dllFM220api.FP_GetTemplate(FM220Connection, minu_codeBuffer, 1, 0);
      if(getTemplateStatus == 0){
         
        switch($scope.functionSelect)
        {
           case 'S':
           console.log("Search api");
           $scope.identifyFPData(minu_codeBuffer.toString('hex'));
           break;

           case 'A':
           console.log("Add api");
          // $scope.AddFPData(minu_codeBuffer.toString('hex'));
           break;

           case 'D':
           console.log("Delete api");
           $scope.DelFPData();
           break;

           case 'V':
           console.log("Verify api");
           $scope.minu_Buffer= minu_codeBuffer.toString('hex');
           //$scope.getUserData(minu_codeBuffer.toString('hex'));
           $scope.VerFPData( $scope.minu_Buffer);
           break;
        }

       
  
      }
      else
       console.log(getTemplateStatus);
    }        
    else
      console.log($scope.fingerprintStatus);
    
    dllFM220api.FP_DestroyImageHandle(FM220Connection, FM220ImageHandle);
    dllFM220api.FP_DisconnectCaptureDriver(FM220Connection);
    console.log("snap Image End~"+$scope.currentStatus);
  } 
} 