var eighties = (function() {
    return {
        toggleMode: function() {
            var link = document.getElementById("80s");
            if(link)
                link.parentNode.removeChild(link);
            else{
                link = document.createElement('link');  
                link.id = '80s';
                link.rel = 'stylesheet';  
                link.type = 'text/css'; 
                link.href = '80s.css';
                document.getElementsByTagName('HEAD')[0].appendChild(link);  
            }
        }, 
    }  
})();   
