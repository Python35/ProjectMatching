var Zoho = require('node-zoho');

var zoho = new Zoho({authToken:'7f14c5ed18c0bd67cde737b91575435025891d4ee1'});
var records = [
    {
        "Lead Source" : "Site Registration",
        "First Name"  : "Test",
        "Last Name"   : "Testerson",
        "Email"       : "test@testerson.com",
    }
];

zoho.execute('crm', 'Leads', 'insertRecords', records, callback);

// to pass optional parameters
zoho.execute('crm', 'Leads', 'insertRecords', records, {wfTrigger: true}, callback);

var callback = function (err, result) {
    if (err !== null) {
        console.log(err);
    } else if (result.isError()) {
        console.log(result.message);
    } else {
        console.log(result.data);
    }
}

