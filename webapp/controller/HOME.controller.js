sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/routing/Router",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"COM/PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL/model/formatter"
	
], function(Controller,MessageBox,MessageToast,Router,Filter,FilterOperator,formatter) {
	"use strict";
	/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint no-console: "error" */
/* "parser": "@babel/eslint-parser" */
    
    var URL,UserObject,userId,data,PlannedOrder,ProdOrder; 
    var ProductionDataObject; 
    
   
	return Controller.extend("COM.PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL.controller.HOME", {   
	    formatter:formatter,
		onInit:function(){
			 
			this.getRouter().getRoute("home").attachMatched(this.onRouteMatched,this); 
			
		
	},// end of onInit function 
		
		getRouter:function(){
		    return sap.ui.core.UIComponent.getRouterFor(this); 
		    
		},
		onRouteMatched:function(oEvent){
		  
		  var oArguments = oEvent.getParameter("arguments"); 
		  var view = this.getView(); 
		  var compressedObject = oArguments.value;   
		  UserObject = JSON.parse(compressedObject);
		  userId = UserObject["Flief"]; 
	      console.log(UserObject); 
	      UserObject["TotalPlan"]=""; 
	      UserObject["YearPlan"]="" 
	      UserObject["MonthPlan"]=""
	      
	      // modelling and binding into the first page 
	        var FirstPage = this.getView().byId("detail")
	 	    var FPModel = new sap.ui.model.json.JSONModel(); 
	 	    FPModel.setData(UserObject); 
	 	    FirstPage.setModel(FPModel,"usermodel"); 
	      // planned order reading 
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
			 	               
			 	              	console.log("planned order header  is "); 
			 	              	console.log(PlannedOrder); 
			 		
			 	                 },  // end of success call back , 
			 	                 
			 	                 
			 	    error : function(oData,oResponse){ 
			 	    	
			 	    	MessageBox.error("error");
			 	  
			 	    }// end of error call back 
			 });  // end of oModel.read   
			 
		var NotificationModel = new sap.ui.model.json.JSONModel();  
	    
	    NotificationModel.setData({
	    	"results":PlannedOrder
	    });// end of set data function  
	    
	    this.getView().byId("idNotificationTable").setModel(NotificationModel);
	    console.log(this.getView().byId("idNotificationTable").getModel()); 
			 
		   // production order 
			 
			 //URL = "PRODORDERSet?$filter=Plant eq '"+ UserObject["Plwrk"] + "'&$format=json";
			  URL = "PRODORDERSet?$filter=Plant eq '0001'&$format=json";
			  	oModel.read(URL,{
			 	                                         context: null, 
			                                        	urlParameters : null, 
			                                         	async : false, 
			 	
			 	success : function(oData,oResponse){
			 		
			 	              	console.log(oData);  
			 	             	ProdOrder = oData.results;  
			 	                
			 	              	console.log("prod order header  is "); 
			 	              	console.log(ProdOrder); 
			 		
			 	                 },  // end of success call back , 
			 	                 
			 	                 
			 	    error : function(oData,oResponse){ 
			 	    	
			 	    	MessageBox.error("error");
			 	  
			 	    }// end of error call back 
			  	});  // end of oModel.read  
		     
		     
		 var ProductionModel = new sap.ui.model.json.JSONModel();  
	    
	    ProductionModel.setData({
	    	"results":ProdOrder
	    });// end of set data function  
	    
	    this.getView().byId("idProductionTable").setModel(ProductionModel);
	    console.log(this.getView().byId("idProductionTable").getModel());  
	    
	    
	    
	    // detail2 page count model 
	    
	     var ProductionPage = this.getView().byId("detail2")
	 	 var ProdModel = new sap.ui.model.json.JSONModel();  
	 	 ProductionDataObject = {
	 	 	"YearCount" : "", 
	 	 	"MonthCount" : "",
	 	 	"TotalProdCount" : ProdOrder.length 
	 	 	
	 	 }
	 	 ProdModel.setData(ProductionDataObject); 
	 	 ProductionPage.setModel(ProdModel,"usermodel"); 
		  
		   
		 
	 	  
	 	    
	 	    
	    
		}, // end of routematched 
		
		onPressNavToDetail: function () {
			this.getSplitContObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {
			this.getSplitContObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitContObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitContObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
            console.log("sToPageId is "+sToPageId)
            if(sToPageId == "dash"){
            	var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
	 			var compressedData = JSON.stringify(UserObject);
			    oRouter.navTo("dashboard",{"value":compressedData});
            }
			this.getSplitContObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitContObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
		},// ennd of onPressModeBtn 

		getSplitContObj: function () {
			var result = this.byId("SplitContDemo");
			if (!result) {
				Log.error("SplitApp object can't be found");
			}
			return result;
		}, // end of getSplitContObj
		
		 onTablePress:function(evt){
	 		MessageBox.success("Item Pressed");
	 	    var obj = evt.getSource().getCells()[0];
	 	    var index = parseInt(obj.sId.split("-").slice(-1)[0]); 
	 	    var selectedNotifID = evt.getSource().getCells()[0].getText();
	 	    var notificationData = this.getView().byId("idNotificationTable").getModel().getData()["results"]; 
	 	    var selectedRowData = notificationData[index]; 
	 	    
	 	    
	 	     console.log(selectedRowData)
	 	    
	 	    
	 	    
	 	  
	 
	 	    var oPage = this.getView().byId("detailDetail")
	 	    var oModel = new sap.ui.model.json.JSONModel(); 
	 	    oModel.setData(selectedRowData); 
	 	    oPage.setModel(oModel,"notifymodel"); 
	 	    
	 	    // console.log(this.getView().byId("detailDetail").getModel("notifymodel").getData()); 
	 	     this.getSplitContObj().to(this.createId("detailDetail"));
	 	  
	 	 
	 	  
	 	  
	 	
	 }, // end of on table press    
	 
	 onProdTablePress:function(evt){
	 	MessageBox.success("Item Pressed");
	 	    var obj = evt.getSource().getCells()[0];
	 	    var index = parseInt(obj.sId.split("-").slice(-1)[0]); 
	 	    var selectedNotifID = evt.getSource().getCells()[0].getText();
	 	    var notificationData = this.getView().byId("idProductionTable").getModel().getData()["results"]; 
	 	    var selectedRowData = notificationData[index]; 
	 	    
	 	    
	 	     console.log(selectedRowData)
	 	    
	 	    
	 	    
	 	  
	 
	 	    var oPage = this.getView().byId("detail3")
	 	    var oModel = new sap.ui.model.json.JSONModel(); 
	 	    oModel.setData(selectedRowData); 
	 	    oPage.setModel(oModel,"prodmodel"); 
	 	    
	 	    // console.log(this.getView().byId("detailDetail").getModel("notifymodel").getData()); 
	 	     this.getSplitContObj().to(this.createId("detail3"));
	 	  
	 	
	 }, // end of on product table press
	 
	 	onFilterSelect: function (oEvent) { 
	 		 var oBinding = this.byId("idNotificationTable").getBinding("items") ; 
	 		  var aFilters = [];
	 		  var sKey = oEvent.getParameter("key"); 
	 		  	
	 		  if(sKey == "Prodord"){
	 		  		this.getSplitContObj().to(this.createId("detail2"));
	 		  }
	 	
	 	else if(sKey === "Profile"){
	 		this.getSplitContObj().to(this.createId("detail2"));
	 	}
	 	
	 	else if(sKey === "dashboard"){
	 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
	 			var compressedData = JSON.stringify(UserObject);
			   oRouter.navTo("dashboard",{"value":compressedData});
	 	}
	 	
	 	else if(sKey === "production"){ 
	 	
	    
	    var ProductionModel = new sap.ui.model.json.JSONModel();  
	    
	     ProductionModel.setData({
	    	"results":ProdOrder
	    });// end of set data function  
	    
	    this.getView().byId("idProductionTable").setModel(ProductionModel); 
	    
	    ProductionDataObject["YearCount"] = ""; 
	    ProductionDataObject["MonthCount"] = "";
	    ProductionDataObject["TotalProdCount"] = ProdOrder.length;
	     var ProductionPage = this.getView().byId("detail2")
	 	 var ProdModel = new sap.ui.model.json.JSONModel();  
	 	 
	 	 ProdModel.setData(ProductionDataObject); 
	 	 ProductionPage.setModel(ProdModel,"usermodel"); 
		  
	 	}
	 	else if (sKey === "Plorder"){
	 	var NotificationModel = new sap.ui.model.json.JSONModel();  
	    
	    NotificationModel.setData({
	    	"results":PlannedOrder
	    });// end of set data function  
	    
	    this.getView().byId("idNotificationTable").setModel(NotificationModel); 
	       UserObject["TotalPlan"]=PlannedOrder.length; 
	      UserObject["YearPlan"]="" 
	      UserObject["MonthPlan"]=""
	    
	        var FirstPage = this.getView().byId("detail")
	 	    var FPModel = new sap.ui.model.json.JSONModel(); 
	 	    FPModel.setData(UserObject); 
	 	    FirstPage.setModel(FPModel,"usermodel");  
	 	}
	 	else if(sKey === "plyrsorter"){
	 	  if(!this.PlYearDialog){
	 		this.PlYearDialog = sap.ui.xmlfragment("COM.PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL.fragments.PLANYEARPICKER",this);  
	 		 this.getView().addDependent(this.PlYearDialog);
	 		}
	 		this.PlYearDialog.open(); 
	 		
	 	}
	 	
	 	else if(sKey === "plmonsorter"){ 
	 	   if(!this.PlMonthDialog){
	 		this.PlMonthDialog = sap.ui.xmlfragment("COM.PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL.fragments.PLANMONTHPICKER",this);  
	 		 this.getView().addDependent(this.PlMonthDialog);
	 		}
	 		this.PlMonthDialog.open(); 
	 	}
	 	
	 	else if(sKey === "Prodordsort"){
	 	     
	 	     
	 		 if(! this.yearDialog){
	 		this.yearDialog = sap.ui.xmlfragment("COM.PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL.fragments.YEARPICKER",this);  
	 		 this.getView().addDependent(this.monthDialog);
	 		}
	 		this.yearDialog.open(); 
	 	
        }
        
        else if(sKey === "MonthSorter"){
          	 if(! this.monthDialog){
	 		this.monthDialog = sap.ui.xmlfragment("COM.PRODUCTIONPLANNINGPORTALPRODUCTIONPLANNINGPORTAL.fragments.MONTHPICKER",this);  
	 		 this.getView().addDependent(this.monthDialog);
	 		}
	 		this.monthDialog.open(); 
        }
	 	
	 	else if (sKey === "Logout"){
	 		var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
			oRouter.navTo("");
	 	}//end of else if 
	 	
	 	  
	   oBinding.filter(aFilters);
	 		
	 	},// end of onFilterSelect 
	    
	    onOkDialog:function(evt){ 
	    	
	    	this.yearDialog.close();
	    	var date = sap.ui.getCore().byId("year").getValue();
	    	var datearr = date.split("-"); 
	    	var year = datearr[0]; 
	    	var month = datearr[1];
	    
	    
	    	
	    	var tempProporder =[] 
	        console.log("fetched year is")
	        console.log("dates are")
	        ProdOrder.forEach(function(Item){ 
	            var rowdate=Item.ProductionFinishDate ; 
	        	var rowyear = rowdate.getFullYear().toString()
	        	if(rowyear === year){
	        		tempProporder.push(Item);
	        	}
	        }); 
	        
	     
	     	
	     var ProductionModel = new sap.ui.model.json.JSONModel();  
	    
	    ProductionModel.setData({
	    	"results":tempProporder
	    });// end of set data function  
	    
	    this.getView().byId("idProductionTable").setModel(ProductionModel);
	    
	    ProductionDataObject["YearCount"] = tempProporder.length; 
	    ProductionDataObject["TotalProdCount"] = "";
	    ProductionDataObject["MonthCount"] = "";
	    var ProductionPage = this.getView().byId("detail2")
	 	 var ProdModel = new sap.ui.model.json.JSONModel();  
	 	 
	 	 ProdModel.setData(ProductionDataObject); 
	 	 ProductionPage.setModel(ProdModel,"usermodel");  
	 	 
	 	 
	     
	    
		  
	    	
	    	
	    },// end of onOkdialog function 
	    
	    onMonthSelect:function(evt){
	    	this.monthDialog.close();
	    	var date = sap.ui.getCore().byId("month").getValue();
	    	var datearr = date.split("-"); 
	    	var year = datearr[0]; 
	    	var month = parseInt(datearr[1]);
	    
	    	console.log("fetched month is"); 
	    	console.log(month)
	    	var tempProporder =[] 
	    
	        ProdOrder.forEach(function(Item){
	        	var rowdate=Item.ProductionFinishDate 
	        	var rowmonth = parseInt(rowdate.getMonth()) 
	        	if(rowmonth+1 === month){
	        		tempProporder.push(Item)
	        	}
	            
	        }); 
	        
	        
	        
	         var ProductionModel = new sap.ui.model.json.JSONModel();  
	    
	    ProductionModel.setData({
	    	"results":tempProporder
	    });// end of set data function  
	    
	    this.getView().byId("idProductionTable").setModel(ProductionModel);  
	    
	     ProductionDataObject["YearCount"] = ""; 
	    ProductionDataObject["TotalProdCount"] = "";
	    ProductionDataObject["MonthCount"] = tempProporder.length ;
	    var ProductionPage = this.getView().byId("detail2")
	 	 var ProdModel = new sap.ui.model.json.JSONModel();  
	 	 
	 	 ProdModel.setData(ProductionDataObject); 
	 	 ProductionPage.setModel(ProdModel,"usermodel"); 
	    
	     
	    	
	    },// end of onMonthSelect 
	   
	   onClose:function(evt){
	   	this.yearDialog.close();
	   },// end of onClose 
	   
	   onMonthClose:function(evt){
	   	this.monthDialog.close();
	   },// onMonthCloseEnd 
	   
	   onPlOkDialog:function(evt){ 
	   	
	   	this.PlYearDialog.close(); 
	   	var date = sap.ui.getCore().byId("year").getValue();
	    	var datearr = date.split("-"); 
	    	var year = datearr[0]; 
	    	var month = datearr[1];
	    
	    
	    	
	    	var tempProporder =[] 
	        console.log("fetched year is")
	        console.log("dates are")
	        PlannedOrder.forEach(function(Item){ 
	            var rowdate=Item.Pedtr ; 
	        	var rowyear = rowdate.getFullYear().toString()
	        	if(rowyear === year){
	        		tempProporder.push(Item);
	        	}
	        });  
	        
	     var NotificationModel = new sap.ui.model.json.JSONModel();  
	    
	    NotificationModel.setData({
	    	"results":tempProporder
	    });// end of set data function  
	    
	    this.getView().byId("idNotificationTable").setModel(NotificationModel);
	     
	      UserObject["TotalPlan"]=""; 
	      UserObject["YearPlan"]=tempProporder.length 
	      UserObject["MonthPlan"]=""
	    
	        var FirstPage = this.getView().byId("detail")
	 	    var FPModel = new sap.ui.model.json.JSONModel(); 
	 	    FPModel.setData(UserObject); 
	 	    FirstPage.setModel(FPModel,"usermodel");  
	        
	   
	   },// end of onPlOkDialog 
	    
	   onPlYrClose:function(evt){
	   	this.PlYearDialog.close(); 
	   },// end of onplyrclose 
	   
	   onPLMonthClose:function(evt){
	   		this.PlMonthDialog.close(); 
	   },//end of onPLMonthClose 
	   
	   onPLMonthSelect:function(evt){
	   	this.PlMonthDialog.close();  
	   		var date = sap.ui.getCore().byId("month").getValue();
	    	var datearr = date.split("-"); 
	    	var year = datearr[0]; 
	    	var month = parseInt(datearr[1]);
	    
	    	console.log("fetched month is"); 
	    	console.log(month)
	    	var tempProporder =[] 
	    
	        PlannedOrder.forEach(function(Item){
	        	var rowdate=Item.Pedtr
	        	var rowmonth = parseInt(rowdate.getMonth()) 
	        	if(rowmonth+1 === month){
	        		tempProporder.push(Item)
	        	}
	            
	        });  
	        
	          var NotificationModel = new sap.ui.model.json.JSONModel();  
	    
	    NotificationModel.setData({
	    	"results":tempProporder
	    });// end of set data function  
	    
	    this.getView().byId("idNotificationTable").setModel(NotificationModel); 
	    
	    
	     UserObject["TotalPlan"]=""; 
	      UserObject["YearPlan"]="" 
	      UserObject["MonthPlan"]=tempProporder.length ; 
	    
	        var FirstPage = this.getView().byId("detail")
	 	    var FPModel = new sap.ui.model.json.JSONModel(); 
	 	    FPModel.setData(UserObject); 
	 	    FirstPage.setModel(FPModel,"usermodel");  
	        
	   	
	   }

	
	
	}); 
	
});