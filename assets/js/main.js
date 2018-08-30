// put your js here :-)

function gPBN(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(location.href);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))}function sC(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+";"+e+";path=/"}function gC(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}function saveUTMs(){for(i=0;i<utmArray.length;i++)null!=gC(utmArray[i])&&""!=gC(utmArray[i])||sC(utmArray[i],gPBN(utmArray[i]),.5)}function getUTMs(){var a=[];for(i=0;i<utmArray.length;i++)a[utmArray[i]]=gC(utmArray[i]);return a}var utmArray=["utm_source","utm_medium","utm_term","utm_content","utm_campaign"];
 saveUTMs()
 
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

function getCampaigns(){

    var CampaignUTMs = getUTMs();


   

         
    var cookieCampaign = readCookie('utm_campaign');

    if(cookieCampaign){

      var utms =  {
                    utm_campaign : readCookie('utm_campaign'),
                    utm_content  : readCookie('utm_content'),
                    utm_medium   : readCookie('utm_medium'),
                    utm_source   : readCookie('utm_source'),
                    utm_term   : readCookie('utm_term')
                  }

      sessionStorage.setItem('campaign', JSON.stringify(utms));
                 }
}

function formatPrice(price) {

    if (typeof price !== 'string') {
        price = price.toString();
    }



    var remainder = price.length % 3;
    var thousands = price.substr(remainder).replace(/(\d{3})(?=\d)/g, '$1.');

    return '$' + (remainder > 0 ? price.substr(0, remainder) + '.' + thousands : thousands);
}

function goToByScroll(id){
  
    // Scroll
  $('html,body').animate({
      scrollTop: $(id).offset().top},
      'slow');
}

function checkFinance(income, gender, dni){
    var p1 = new Promise(function(resolve, reject){

        $.ajax({
            url: '/api/calculator/?income='+income+'&gender='+gender+'&cdi='+dni,
            type: 'get',
            dataType: 'json',
                success: function (data){
                    
               
    
                    resolve(data);
    
                
                },
                error: function (error){

                    reject(error);
                    
                }
    
            });

      });

      

      return p1;
}

function IFcall(){



    var vehicle = JSON.parse(localStorage.getItem('vehicleBlock'));
    var fee     = localStorage.getItem('fee');
    var cashAdvance = parseInt(localStorage.getItem('cashAdvance'));
    var usedCarValue = parseInt(localStorage.getItem('usedCar'));
    var totalCashAdvance = cashAdvance + usedCarValue;

    var company = parseInt(localStorage.getItem('company'));
   
    var payload = {
        "company": company,
        "vehicle": vehicle.vehicle,
        "cash_advance": parseInt(totalCashAdvance),
        "desired_fee_payment": {
            "from": 0,
            "to": parseInt(fee)
        },
        "customer": {
            "credit_score": null,
            "financing": {
                "approved": true,
                "approved_entities": [{
                    entity: 'Santander',
                    income: 50000,
                    max_fee: 15000
                  }],
                  "rejected_entities": []
            }
        },
        "simulate": [
            {
              "type": "saving",
              "quantity": 5
            },
            {
              "type": "loan",
              "quantity": 5
            }
          ]
};
    localStorage.setItem('payloadSisy', JSON.stringify(payload));
  //  var payload = {"company":15,"vehicle":{"make":{"id":47,"name":"Volkswagen","nice_name":"Volkswagen","slug":"volkswagen"},"model":{"id":"776","name":"Up","nice_name":"UP","slug":"up"},"trim":{"id":"467","name":"1.0 Move Up! 3Ptas. (L18)","nice_name":"1.0 Move Up! 3Ptas. (L18)","year":2018,"price":289300,"slug":"10-move-up-3ptas-l18"}},"cash_advance":170000,"used_vehicle":{"make":{},"model":{},"trim":{"price":{}}},"customer":{"credit_score":null,"financing":{"approved":true,"approved_entities":[{"entity":"Supervielle","income":59000,"max_fee":19175},{"entity":"Santander","income":59000,"max_fee":17700}],"rejected_entities":[]}},"desired_fee_payment":{"from":0,"to":10000},"simulate":[{"type":"saving","quantity":5},{"type":"loan","quantity":5}]};

    var p1 = new Promise(function(resolve, reject){

        $.ajax({
            url: '/api/sisyphus/simulations',
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(payload),
                success: function (data){
                    
                    resolve(data);
    
                
                },
                error: function (error){

                    reject(error);
                    
                }
    
            });

      });

      

      return p1;

      

}

function callNMF(Fee, SelectedIF_id, IF_type, siteCall){


  
  var avaibleIF = JSON.parse(localStorage.getItem('IFS')) || null;
  var selectedIf;
  var siteCall = siteCall || null;

    if(siteCall){
        var endpointUrl = '/simulations';
    }else{
        var endpointUrl = '/api/nmf/flows/melania';
    }


  var Fee = Fee || null;
  var IF_type = IF_type || null;
  var modelName = localStorage.getItem('modelName');
  var modelSlug = localStorage.getItem('modelSlug');
  var mongoId = localStorage.getItem('MongoId') || null;


      var vehicleBlock = JSON.parse(localStorage.getItem('vehicleBlock'));
      var formData     = JSON.parse(localStorage.getItem('formData')); 



      var brandSlug    = vehicleBlock.vehicle.make.name.toLowerCase();     

      var brandForm = {
        'id':vehicleBlock.vehicle.make.id,
        'name': vehicleBlock.vehicle.make.name,
        'slug':  brandSlug
      };

    var modelDataForm = {
        'id': vehicleBlock.vehicle.model.id,
        'name': vehicleBlock.vehicle.model.name,
        'slug': modelSlug
    }

    var versionDataForm = {
        'id': vehicleBlock.vehicle.trim.id,
        'name': vehicleBlock.vehicle.trim.name,
        'price': parseInt(vehicleBlock.vehicle.trim.price)

    }

   var contact = {
        "name": formData.name,
        "document": formData.document,
        "surname": formData.surname,
        "email": formData.email,
        "phone": {
          "prefix": formData.phone.prefix,
          "block": formData.phone.block
        }
      }
    


   var company = parseInt(localStorage.getItem('company'));
 
    if(mongoId){
                var payload =  {
                    company: company,
                    id: mongoId,
                    contact: contact,
                    meta: {source: 'enduro'},
                    simulation: {
                        company: company,
                        origin: 197,
                        brand: brandForm,
                        model: modelDataForm,
                        version: versionDataForm,
                        cashAdvance: parseInt(localStorage.getItem('cashAdvance')),
                        fee: Fee,
                        campaign :{
                        utm_campaign : readCookie('utm_campaign'),
                        utm_content  : readCookie('utm_content'),
                        utm_medium   : readCookie('utm_medium'),
                        utm_source   : readCookie('utm_source'),
                        utm_term   : readCookie('utm_term')
                        },
                        amountToFinance: Math.round(parseInt(vehicleBlock.vehicle.trim.price) - parseInt(localStorage.getItem('cashAdvance'))),
                        comment:'',
                        pinedo:{
                        selected: selectedIf,
                        volatile:avaibleIF
                        }
                        }
                    };

                   


            }else{
                var payload =  {
                    company: company,
                    contact: contact,
                    meta: {source: 'enduro'},
                    simulation: {
                        company: company,
                        origin: 197,
                        brand: brandForm,
                        model: modelDataForm,
                        version: versionDataForm,
                        cashAdvance: parseInt(localStorage.getItem('cashAdvance')),
                        fee: Fee,
                        campaign :{
                        utm_campaign : readCookie('utm_campaign'),
                        utm_content  : readCookie('utm_content'),
                        utm_medium   : readCookie('utm_medium'),
                        utm_source   : readCookie('utm_source'),
                        utm_term   : readCookie('utm_term')
                        },
                        amountToFinance: Math.round(parseInt(vehicleBlock.vehicle.trim.price) - parseInt(localStorage.getItem('cashAdvance'))),
                        comment:'',
                        pinedo:{
                        selected: selectedIf,
                        volatile:avaibleIF
                        }
                        }
                    };


                   

    }


    
    var p1 = new Promise(function(resolve, reject){

    $.ajax({
        url: endpointUrl, 
        type: 'post',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(payload),
            success: function (data){

             
                localStorage.setItem('MongoId',data._id);
                resolve(data);
                        
                    if(siteCall != 'form'){
                     window.setTimeout(function(){

                                    window.location.href ="/"+brandSlug+"/send/thanks";
               
                                       }, 1500); 

                    }
               

 
            },
            error: function (error){

                reject(error);
                console.log(error);
                
            }

        });

    
    });

    return p1;

}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatPrice(price, minus) {

    var min = minus||null;
  
            if (typeof price !== 'string') {
                price = price.toString();
            }
  
            var remainder = price.length % 3;
            var thousands = price.substr(remainder).replace(/(\d{3})(?=\d)/g, '$1.');
  
            if(min){
  
              return '- $' + (remainder > 0 ? price.substr(0, remainder) + '.' + thousands : thousands);            
  
            }else{
  
              return '$' + (remainder > 0 ? price.substr(0, remainder) + '.' + thousands : thousands);
              
            }
  
  }

  function createAmount(selectObj, maxAmount, valSel){

   
    $('#'+selectObj).children().remove().end();

    var i = 0;
    while (i < parseInt(maxAmount)) {
         $('#'+selectObj).append($('<option>', {
            value: i,
            text: '$'+i
        }));

        if(i == valSel){
            $("#"+selectObj+" option:last").attr("selected", "selected");
        }

        i+=50000;
    }

    $('#'+selectObj).prop('disabled', false);    


  

  }

function modifyAmount(selectObj, nextObject, versionPrice){


    var valueExist = $('#'+selectObj).val();

    var nextVal = $('#'+nextObject).val();

    var maxAmount = versionPrice - valueExist;

  
   
   if(nextVal == 0){

            $("#"+nextObject).empty();

            var i = 0;
            while (i < parseInt(maxAmount)) {
                $('#'+nextObject).append($('<option>', {
                    value: i,
                    text: '$'+i
                }));

                i+=50000;
            }

    }else{
        $("#"+ nextObject+" option").each(function()
        {
           
            if(parseInt($(this).attr('value')) >= maxAmount){
                  
                  $(this).remove();
    
            }else{
                
                var e = parseInt($("#"+ nextObject+" option:last").attr('value'))+ 50000;
                if(e < maxAmount){
                    $('#'+nextObject).append($('<option>', {
                        value: e,
                        text: '$'+e
                    }));
                }
           

            }
           
    
    
        });
    }


      

}

  function callLeads(){



       var Fee =  localStorage.getItem('fee');
  
  var modelName = localStorage.getItem('modelName');
  var modelSlug = localStorage.getItem('modelSlug');
 


      var vehicleBlock = JSON.parse(localStorage.getItem('vehicleBlock'));
      var formData     = JSON.parse(localStorage.getItem('formData')); 



      var brandSlug    = vehicleBlock.vehicle.make.name.toLowerCase();     

      var brandForm = {
        'id':vehicleBlock.vehicle.make.id,
        'name': vehicleBlock.vehicle.make.name,
        'slug':  brandSlug
      };

    var modelDataForm = {
        'id': vehicleBlock.vehicle.model.id,
        'name': vehicleBlock.vehicle.model.name,
        'slug': modelSlug
    }

    var versionDataForm = {
        'id': vehicleBlock.vehicle.trim.id,
        'name': vehicleBlock.vehicle.trim.name,
        'price': parseInt(vehicleBlock.vehicle.trim.price)

    }

   var contact = {
        "name": formData.name,
        "document": 2000000,
        "surname": formData.surname,
        "email": formData.email,
        "phone": {
          "prefix": formData.phone.prefix,
          "block": formData.phone.block
        }
      }
    
      var company = parseInt(localStorage.getItem('company'));

       var payload =  {
                    company: company,
                    contact: contact,
                    meta: {source: '0kms.com'},
                    simulation: {
                        company: company, 
                        origin: 197,
                        brand: brandForm,
                        model: modelDataForm,
                        version: versionDataForm,
                        usedCar: parseInt(localStorage.getItem('usedCar')), // valor usado
                        cashAdvance: parseInt(localStorage.getItem('cashAdvance')),
                        fee: Fee,
                        campaign :{
                        utm_campaign : readCookie('utm_campaign'),
                        utm_content  : readCookie('utm_content'),
                        utm_medium   : readCookie('utm_medium'),
                        utm_source   : readCookie('utm_source'),
                        utm_term   : readCookie('utm_term')
                        },
                        amountToFinance:  parseInt(localStorage.getItem('amountToFinance')),
                        comment:'',
                        
                    }
                };

                                $.ajax({
                            url: 'https://calculator.motormax.la/leads', 
                            type: 'post',
                            dataType: 'json',
                            contentType: "application/json",
                            data: JSON.stringify(payload),
                                success: function (data){
                    
                                  localStorage.setItem('ahivoyyo', JSON.stringify(data));          
                         
                                },
                                error: function (error){
                    
                                    reject(error);
                                    console.log(error);
                                    
                                }
                    
                            });

  }