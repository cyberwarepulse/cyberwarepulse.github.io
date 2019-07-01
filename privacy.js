var privacy = (function() {
    return {
        agree: function() {
            privacy.setCookie("privacy", "agree", 365);
            privacy.checkCookie();
        }, 
        checkCookie: function() {
            var cookiePrivacy = privacy.getCookie("privacy");
            var banner = document.getElementById("privacyBanner");
            if (!cookiePrivacy || cookiePrivacy != "agree") {
                if(banner)
                    setTimeout(function(){banner.style.display = "flex";}, 500);
            } else if (cookiePrivacy && cookiePrivacy === "agree") {
                if(banner)
                    banner.style.display = "none";
            }
        },        
        setCookie: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          }
    }  
})();   

window.onload = privacy.checkCookie
