const
  stripe = require('stripe')(process.env.API_KEY),
  express = require('express'),
  endpointSecret = process.env.ENDPOINT_SECRET,

  // This example uses Express to receive webhooks
  app = express();

// Retrieve the raw body as a buffer and match all content types
app.use(require('body-parser').raw({type: '*/*'}));

app.post('/webhook', (request, response) => {
  // Validate events are sent by Stripe, not a third party
  let sig = request.headers['stripe-signature'];

  try {
    let event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    
    // For testing purposes, log the request body to the console
    // to compare with the request body shown in the Dashboard.
    // In a production environment, you'll want to store this
    // event in your database.
    console.log(JSON.stringify(event));
    
    // Do something with event
  }
  catch (err) {
    response.status(400).end()
  }
  
  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Running on port ' + listener.address().port);
});