/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your application specific code will go here
 */

define(['ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'knockout', 'ojs/ojarraydataprovider', 
        'ojs/ojknockout', 'ojs/ojchart', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojmessages',
        'ojs/ojpopup'],
  function(ResponsiveUtils, ResponsiveKnockoutUtils, ko, ArrayDataProvider) {
     function ControllerViewModel() {
       var self = this;

      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("NoteBook");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("razik.anas@gmail.com");
      //input code 
      self.inputCode = ko.observable('');
      //chart type
      self.chartType = ko.observable('bar');

      /*self.inputCode.subscribe(function(newCode) {
        console.log(typeof newCode);
        console.log(newCode);
      });*/
      self.preparedData = ko.observableArray();
      self.errors = ko.observableArray();
      
      self.buttonCliked = function(event){
        var errors = [];
        self.errors(errors);
        if(self.inputCode() !== ''){

          var tmp = [];

          var rows = self.inputCode().split('\\n');
          var series = rows[0].split('\\t');
          var counter = 0;
          for(var i = 0; i < series.length; i++){
            for(var j = 1; j < rows.length; j++){
              var row = rows[j].split('\\t');
              var item = parseInt(row[i]);
              var dataRow = { id: counter++, series: series[i], group: null, quater: null, value: item };
              if(event.currentTarget.id === 'bar'){
                dataRow.group = 'group'+j;
              } else if(event.currentTarget.id === 'area'){
                dataRow.quater = 'quater'+j;
              }
              if(isNaN(dataRow.value)){
                var nanValue = {
                  severity: 'error',
                  summary: 'data error',
                  detail: 'Values cannot be alphanumeric, please enter just numeric values',
                  autoTimeout: parseInt(ko.observable('0')(), 10)
                };
                errors.push(nanValue);
                self.errors(errors);
                return;
              }
              tmp.push(dataRow);
            }
          }
        }
        self.chartType(event.currentTarget.id);
        self.preparedData(tmp);
      };
      self.dataSource = new ArrayDataProvider(self.preparedData, {keyAttributes: 'id'});
      self.messagesDataprovider = new ArrayDataProvider(self.errors);

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);
     }

     return new ControllerViewModel();
  }
);
