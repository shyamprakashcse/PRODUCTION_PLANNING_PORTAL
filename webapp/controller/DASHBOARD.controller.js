sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/routing/Router"
], function(Controller,MessageBox,MessageToast,Router) {
	"use strict";
	/*eslint linebreak-style: ["error", "windows"]*/

    
    var URL,userHeader,data,userId,PlannedOrder,PlorderCount=0,ProdorderCount=0;
    var ProdOrder; 
   
    
	return Controller.extend("COM.PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL.controller.DASHBOARD", {

	  onInit:function(){
	  		this.getRouter().getRoute("dashboard").attachMatched(this.onRouteMatched,this);  
	  		
	  },//end of oninit function
	  
      getRouter:function(){
		    return sap.ui.core.UIComponent.getRouterFor(this); 
		    
		},// END OF GETROUTER 
		
	  	onRouteMatched:function(oEvent){
		  
		  var oArguments = oEvent.getParameter("arguments"); 
		  var view = this.getView(); 
		  var compressedData = oArguments.value;  
		  userHeader = JSON.parse(compressedData); 
		  userId = userHeader["Flief"];
		 
		  var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZODATA_PPP_INTERNPROJECT_SRV/", true);   
		 
		// planning order 
		 
		 URL = "PLANNEDORDERSet?$filter=Flief eq '"+userId+"'&$format=json";
			  	oModel.read(URL,{
			 	                                         context: null, 
			                                        	urlParameters : null, 
			                                         	async : false, 
			 	
			 	success : function(oData,oResponse){
			 		
			 	              	console.log(oData);  
			 	             	PlannedOrder = oData.results;  
			 	                PlorderCount = PlannedOrder.length ; 
			 	              	console.log("planned order header  is "); 
			 	              	console.log(PlannedOrder); 
			 		
			 	                 },  // end of success call back , 
			 	                 
			 	                 
			 	    error : function(oData,oResponse){ 
			 	    	
			 	    	MessageBox.error("error");
			 	  
			 	    }// end of error call back 
			 });  // end of oModel.read   
			 
			 
			 
			 // production order 
			 
			 //URL = "PRODORDERSet?$filter=Plant eq '"+ userHeader["Plwrk"] + "'&$format=json";
			 URL = "PRODORDERSet?$filter=Plant eq '0001'&$format=json";
			  	oModel.read(URL,{
			 	                                         context: null, 
			                                        	urlParameters : null, 
			                                         	async : false, 
			 	
			 	success : function(oData,oResponse){
			 		
			 	              	console.log(oData);  
			 	             	ProdOrder = oData.results;  
			 	                ProdorderCount = ProdOrder.length ; 
			 	              	console.log("prod order header  is "); 
			 	              	console.log(ProdOrder); 
			 		
			 	                 },  // end of success call back , 
			 	                 
			 	                 
			 	    error : function(oData,oResponse){ 
			 	    	
			 	    	MessageBox.error("error");
			 	  
			 	    }// end of error call back 
			 });  // end of oModel.read  
			 
		        data =  {
			 	              	"Flief" : userHeader.Flief, 
			 	              	"Kunnr" : userHeader.Kunnr, 
			 	              	"Usnam" : userHeader.Usnam, 
			 	              	"Passkey" : userHeader.Passkey,
			 	              	"Designation" : userHeader.Designation,
			 	              	"Plwrk" : userHeader.Plwrk, 
			 	              	"Pwwrk" : userHeader.Pwwrk ,
			 	              	"Plcnt" : PlorderCount, 
			 	              	"Prcnt" : ProdorderCount 
			 	              
			 	              	
			 	              	
			 	        } 
			 	        
			 	        
			var oPage = this.getView().byId("TileBoard")
	 	    var oModel = new sap.ui.model.json.JSONModel(); 
	 	    oModel.setData(data); 
	 	    oPage.setModel(oModel,"planmodel"); 
			 	              
			 	     
			 
			 
	  	},// end of onRouteMatched function 
		 
	    onFilterSelect:function(oEvent){
	  		var sKey = oEvent.getParameter("key"); 
	  		if(sKey === 'Logout'){
	  			console.log(sKey);
	  			var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
			   oRouter.navTo("");
	  		}
	  		else if (sKey === "planord" || sKey === "Prodord"){
	  			var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
	  		   var compressor = JSON.stringify(data); 
	  		   oRouter.navTo("home",{"value":compressor}); 
	  		}
	  	
	  	
	  }, // end of onFilter 
	  
	  pltile:function(){
	  		var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
	  		var compressor = JSON.stringify(data); 
	  		oRouter.navTo("home",{"value":compressor}); 
	  }, 
	  
	  prtile:function(){
	  		var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
	  		var compressor = JSON.stringify(data); 
	  		oRouter.navTo("home",{"value":compressor}); 
	  }
	  
		
	  
		
	});

});