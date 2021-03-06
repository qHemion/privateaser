'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];

function getPayment(actor, who){
	var i;
	for (i=0; i<actor.payment.length; i++)
	{
		if(actor.payment[i].who == who)
		{
			return actor.payment[i];
		}
	}
	return undefined;
	
}

function computingPrices() {
	var i;
	for (i = 0; i < events.length; i++) { 
		var myBarId = events[i].barId;
		var myBar = undefined;
		var j;
		for(j = 0; j<bars.length; j++){
			if(bars[i].id==myBarId)
			{
				myBar = bars[i];
			}
		}
		if(myBar == undefined)
		{
			events[i].price = 0;
		}
		else{
			events[i].price = myBar.pricePerHour * events[i].time + myBar.pricePerPerson * events[i].persons;
			if(events[i].persons>60)
			{
				events[i].price = (events[i].price)/2;
			}else if(events[i].persons>20){
				events[i].price = (events[i].price * 7 ) / 10;
			}else if (events[i].persons>10){
				events[i].price = (events[i].price * 9) / 10;
			}
			
			var totalCommission = (events[i].price * 3) /  10;
			
			events[i].commission.insurance = totalCommission / 2;
			events[i].commission.treasury = events[i].persons;
			events[i].commission.privateaser = totalCommission - (events[i].commission.insurance + events[i].commission.treasury);
			
			if(events[i].options.deductibleReduction==true)
			{
				events[i].price+=events[i].persons;
				events[i].commission.privateaser+=events[i].persons;
			}
			
			var myActors = undefined;
			
			for(j=0; j<actors.length; j++){
				if(actors[j].eventId == events[i].id)
				{
					myActors = actors[j];
				}
			}
			
			if(myActors!=undefined)
			{
				var currentActor = getPayment(myActors, "booker");
				if(currentActor!= undefined) currentActor.amount = events[i].price;
				currentActor = getPayment(myActors, "bar");
				if(currentActor!= undefined) currentActor.amount = events[i].price - totalCommission;
				currentActor = getPayment(myActors, "insurance");
				if(currentActor!= undefined) currentActor.amount = events[i].commission.insurance;
				currentActor = getPayment(myActors, "treasury");
				if(currentActor!= undefined) currentActor.amount = events[i].commission.treasury;
				currentActor = getPayment(myActors, "privateaser");
				if(currentActor!= undefined) currentActor.amount = events[i].commission.privateaser;
				
			}
		}
	}
}

computingPrices();
console.log(bars);
console.log(events);
console.log(actors);
