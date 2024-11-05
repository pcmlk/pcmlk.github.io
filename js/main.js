function insertContact() {
    var c = ['l','a','@','n','h','o','s','.','t','r','e','k','v',':','m','i','x','g'];
  
    var hostnameRegexMatch = window.location.hostname.match(/.*?\.(.*)/);

    if (hostnameRegexMatch === null){
      return;
    }
  
    var textMail = c[4]+c[1]+c[0]+c[0]+c[5]+c[2]+hostnameRegexMatch[1];
    document.getElementById("print-mail").innerHTML = textMail;
    document.getElementById("mail").href = "mailto:"+textMail;
  }
  
  window.onload = insertContact;