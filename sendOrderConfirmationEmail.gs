// Title: sendOrderConfirmationEmail.gs
// Date: 5/15/2020
// Author: Andrew Bäck 
// Description: When a customer submits the Google Form, this function is triggered and sends them an  
//                order confirmation email using the "Thank You.html" email template. This function 
//                builds the email body to include 1) a bulleted order summary and 2) directions to  
//                pay for their order via a dynamic link to Paypal with the payment amount pre-populated.
//
//              The front-end Google Form that triggers this event is designed to collect basic information
//                about the customer's order (e.g., which coffee they want and the amount/frequency, their 
//                email address, and physical mailing address) that is then used to build the email.  
 


function onFormSubmit(e) {
  var price;
  var paymentURL;
  var HtmlOrder = '<ul>';
  var curDate = Utilities.formatDate(new Date(), "GMT+1", "MM/dd/yyyy")
  
  //Logger.log(values);
  
  //Build the order summary     
  HtmlOrder += '<li>' + 'Coffee Type: ' + e.namedValues["What can I send you?"] + '</li>';
  HtmlOrder += '<li>' + 'Quantity: ' + e.namedValues["How much coffee would you like?"] + '</li>';
  HtmlOrder += '<li>' + 'Frequency: ' + e.namedValues["How often should I roast coffee for you?"] + '</li>';
  HtmlOrder += '<li>' + 'Shipping Address: ' + e.namedValues["Where should I send the coffee?"] + '</li>';
  HtmlOrder += '<li>' + 'Order Date: ' + curDate + '</li>';
  
  //Calculate the total price of the order ("price") and create a custom payment URL
  price = (Number(String(e.namedValues["How much coffee would you like?"]).substring(0,1)))*8+3
  paymentURL = '<personal_paypal.me_link>/' + String(price)
  
  //Add the total price of the order as the final bullet of the order summary
  HtmlOrder += '<li>' + '<strong>Order Total: $' + price + '</strong></li></ul>';
  
  //Create the HTML message
  var htmlBody = HtmlService.createHtmlOutputFromFile('Thank You'); 
  var message = htmlBody.getContent()
  message = message.replace("%URL", paymentURL)
  message = message.replace("%ORDER", HtmlOrder)

  GmailApp.sendEmail(e.namedValues["Email Address"], 'Thank you for your order!', '', {htmlBody:message})
}
