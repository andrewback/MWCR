// Title: atCapacity.gs
// Date: 5/20/2020
// Author: Andrew Bäck 
// Description: When a customer submits the Google Form, this function is triggered and checks that  
//                there is enough capacity to handle their order. If not, the form displays a message
//                indicating that too many orders have been received but that they should try again tomorrow.

function Capacity(e) {
  var form = FormApp.openById('1qPrxl5DT0lWOMNM0PGdJtIc3JJYVw3OFKSywOusrlyM');
  var ss = SpreadsheetApp.openById("1q63y8_q_WcalzxQDNDkSK2vi_hQAxbVI54pcfKQxJPw");
  var sheet = ss.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var curDate = Utilities.formatDate(new Date(), "GMT+1", "MM/dd/yyyy")

  Logger.log('current date: ' + curDate.toString());
  
  //Filter on today's orders
  var rows = data;
  Logger.log('first order date: ' + (rows[1][0]).toString());
  
  var filteredRows = rows.filter(function(row){
  if (Utilities.formatDate(new Date(row[0]), "GMT+1", "MM/dd/yyyy") === curDate) {
    return row;
  }
});
  
  Logger.log('filtered order dates: ' + filteredRows);
  
  //Count the number of orders today
  var ordersToday = filteredRows.length;
  
  Logger.log('ordersToday: ' + ordersToday.toString());
  
  var msg = 'Sorry, we have received too many orders today! \n \n'+'Please check back again tomorrow.';
  
  if (ordersToday >= 3) {
    form.setAcceptingResponses(false);
    form.setCustomClosedFormMessage(msg);  
  };
}  
