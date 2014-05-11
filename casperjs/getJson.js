//casperjs --ignore-ssl-errors=yes --web-security=no collector.js --collector=<<collector name>> [--log-level='debug']

/*var tempCasper = require('casper').create();*/


var casper = require('casper').create({   
    verbose: true, 
	/*logLevel: logLvl,*/
    pageSettings: {
         loadImages:  false,         // The WebPage instance used by Casper will
         loadPlugins: true,        // use these settings
         userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    },
	 viewportSize: {
        width: 1400,
        height: 768
    },
    onWaitTimeout: function() {
        logConsole('Wait TimeOut Occured');
        this.capture('xWait_timeout.png');
        this.exit();
    },
    onStepTimeout: function() {
        logConsole('Step TimeOut Occured');
        this.capture('xStepTimeout.png');
        this.exit();
    }
});




var debug=true;
function getConfs(sessions) {
	casper.echo("in");
	json_session = null;
	casper.each(sessions, function(self,session) {
		
		json_session.nom = 	session.h3;
	});
	
	
	require('utils').dump(sessions[0]);
    /*return Array.prototype.map.call(links, function(e) {
        try {
            // google handles redirects hrefs to some script of theirs
            return (/url\?q=(.*)&sa=U/).exec(e.getAttribute("href"))[1];
        } catch (err) {
            return e.getAttribute("href");
        }
    });*/
}

casper.start("http://afup.org/pages/phptourlyon2014/sessions.php", function() {
    // search for 'casperjs' from google form
    this.capture('phptour.png');
});

function replaceAll(wordToReplace,replace,data)
{
			re = new RegExp(wordToReplace, 'g');
			return data.replace(re,replace)
}
function sanitize(stringToReplace)
{
	var filteredData = new String(stringToReplace);
	filteredData = filteredData.trim();
	filteredData = filteredData.replace(/^[a-zA-Z0-9‰ˆ¸ƒ÷‹]*$/gi, '');
	filteredData = replaceAll('<[^>]*>', '',filteredData);
	filteredData = replaceAll('\n', '',filteredData);
	filteredData = replaceAll('\t', '',filteredData);
	filteredData = replaceAll('  ', ' ',filteredData);
	return filteredData;
}

function getDate(dateString,isStart) {
	/*var aDate 	= dateString.split(" ");
	var adateDetails= aDate[0].split("/");
	var year = adateDetails[2];
	var month = adateDetails[1];
	var day = adateDetails[0];
	var indexHour = 1;
	
	if(!isStart)
		indexHour = 4;*/
	
	var pattern = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}) - (\d{2}):(\d{2})/;
	if(isStart)
		date = new Date(dateString.replace(pattern,'$3-$2-$1T$4:$5:00'));
	else
		date = new Date(dateString.replace(pattern,'$3-$2-$1T$6:$7:00'));
		
	//date = new Date(year, month, day, hours, minutes, seconds, milliseconds)
	//date = new Date(year+"-"+month+"-"+day+"T"+aDate[indexHour]);
	return date;
}

function conference(name,date,salle,detail,conferencier) {
	var img_pattern = /<img.+?src=[\"'](.+?)[\"'].*?>/;
	this.name = sanitize(name);
	this.date = sanitize(date);
	this.salle = sanitize(salle);
	this.detail = sanitize(detail);
	this.conferencier = sanitize(conferencier.text);
	this.conferencier_img = (conferencier.html).match(img_pattern)[1];
	this.date_start = getDate(this.date,true);
	this.date_end = getDate(this.date,false);
	this.lang = (detail.indexOf("picto-en") > -1)?"EN":"FR";
} 

function convert2Json(data) {
	var json_result = "";
	for(i=0;i<data.length;i++)
	{
		json_result += JSON.stringify(data[i]);
		(i+1<data.length)? json_result += ",\r\n":null;
	}
	
	return "["+json_result+"]";
}

var all_confs = [];
casper.then(function() {
	
    // aggregate results for the 'phantomjs' search
    conf_names = this.getElementsInfo('.session h3');
	conf_date = this.getElementsInfo('.horaire');
	conf_salle = this.getElementsInfo('.salle');
	conf_detail = this.getElementsInfo('.abstract');
	//lang_detail = this.getElementsInfo('.abstract img');
	conf_conferencier = this.getElementsInfo('.conferencier');
	//require('utils').dump(conf_detail[0]);
	for(i=0;i<conf_names.length;i++)
	{
		all_confs[i] = new conference(conf_names[i].text,conf_date[i].text,conf_salle[i].text,conf_detail[i].html,conf_conferencier[i]);
		/*all_confs[i]['name'] = conf_names[i];
		all_confs[i]['date'] = conf_date[i];
		all_confs[i]['salle'] = conf_salle[i];
		all_confs[i]['detail'] = conf_detail[i];
		all_confs[i]['conferencier'] = conf_conferencier[i];*/
	}
	
	
});


	
casper.run(function() {
var fs = require('fs');
jsondata = convert2Json(all_confs);
fs.write("jsonconfs.json", jsondata, 'w');
//require('utils').dump(all_confs[0]);
	this.exit();
});
