var config = {
    user: "user1",
    host: "host1",
    stdOutElemId: "stdOut",
    stdInElemId: "stdIn",
}

var cmdHistory = {
    commands: [],
    index: 0
}

var htmlBuilder = (function() {
    return {
        createUserHost: function() {
            return "[<span class=\"warning\">"+config.user+"</span>@<em class=\"info\">"+config.host+"</em> ~]$ ";
        },
        createCmdInput: function() {
            return "<input type=\"text\" id=\""+config.stdInElemId+"\" class=\"button\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" autofocus=\"\">";
        },
        createLsTotal: function(total) {
            return "<br/>total "+total+"<br/>";
        },  
        createLsLine: function(fileSize, month, day, year,fileName) {
            return "<span class=\"danger\">-rw-r--r--</span>  1 <span class=\"warning\">root root</span>     "+fileSize+" "+month+"  "+day+"  "+year+" <span class=\"neon\"><a href='"+fileName+"'>"+fileName+"</a></span><br/>";
        },   
        createError: function(errorMsg) {
            return "<br/><span class=\"danger\">"+errorMsg+"</span><br/>";
        }, 
        createTextLine: function(cmd,first) {
            return (first?"<br/>":"")+cmd+"<br/>";
        },   
        createHelp: function() {
            return "<br/><span class=\"neon\">commands available</span><br/>";
        },
        createHelpLine: function(cmd,help,eg) {
            var line = cmd;
            while(line.length!=10)
                line+=" ";
            return line+"<span class=\"info\">"+help+"</span>"+(eg?"<span class=\"warning\">    "+eg+"</span><br/>":"<br/>");     
        },  
    }  
})();   

var commands = (function() {
    return {
        /* External commands section */
        ls: function(stdOut, cmdInput) {
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createLsTotal("2046"));}, 500);
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createLsLine("1003","Jul"," 1","2117","about.html"));}, 600);    
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createLsLine("1043","Jun","12","2117","chapter1.html"));}, 700);    
            commands.createInput(stdOut, cmdInput, 800);
        },
        browse: function(stdOut, cmdInput, fileName) {
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createTextLine("resolving "+fileName+"...",true));}, 500);
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createTextLine("connecting "+fileName+"...",false));}, 1000);
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createTextLine("loading "+fileName+"...",false));}, 2000);
            setTimeout(function(){window.location.href = fileName;}, 3000);
        },
        clear: function(stdOut, cmdInput) {
            setTimeout(function(){stdOut.innerHTML="";}, 500);
            commands.createInput(stdOut, cmdInput, 600);
        },
        history: function(stdOut, cmdInput) {
            let timeout = 500;
            let first = true;
            for (cmd of cmdHistory.commands){
                let cmdCopy = (' ' + cmd).slice(1);
                setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createTextLine(cmdCopy,first)); first = false;}, timeout);
                timeout+=100;
            }
            commands.createInput(stdOut, cmdInput, timeout);
        },
        toggle: function(stdOut, cmdInput) {
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createTextLine("loading style...",true));}, 500);
            setTimeout(function(){eighties.toggleMode();}, 600);
            commands.createInput(stdOut, cmdInput, 700);
        },
        help: function(stdOut, cmdInput) {
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelp());}, 500);
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelpLine("ls","list files"));}, 600);    
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelpLine("browse","navigate to web page","e.g. browse chapter1.html"));}, 700);
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelpLine("clear","clear the screen"));}, 800); 
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelpLine("history","print history of previous commands"));}, 900); 
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelpLine("toggle","change style to 80s"));}, 1000); 
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createHelpLine("help","print available commands"));}, 1100);
            commands.createInput(stdOut, cmdInput, 1200);
        },
        /* Internal commands section */
        error: function(stdOut, cmdInput, errorMsg) {
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createError(errorMsg));}, 500);
            commands.createInput(stdOut, cmdInput, 600);
        },
        createInput: function(stdOut, cmdInput, timeout){
            setTimeout(function(){stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createUserHost());}, timeout);
            setTimeout(function(){stdOut.appendChild(cmdInput); cmdInput.value=""; cmdInput.style.display="inline"; cmdInput.focus()}, timeout);
        }
    }  
})();   

var cli = (function() {
    return {
        interpreter: function(stdOut, cmdInput) {
            if(cmdInput.value==="ls" || cmdInput.value.startsWith("ls "))
                commands.ls(stdOut,cmdInput);
            else if(cmdInput.value==="clear" || cmdInput.value.startsWith("clear "))
                commands.clear(stdOut,cmdInput);
            else if(cmdInput.value==="browse" || cmdInput.value.startsWith("browse ")){
                fileName = cmdInput.value.split(" ")[1];
                if (['about.html', 'chapter1.html'].indexOf(fileName) >= 0) {
                    commands.browse(stdOut,cmdInput,fileName);
                }else
                    commands.error(stdOut,cmdInput,"provide a valid file name, e.g. browse about.html");
            }
            else if(cmdInput.value==="history" || cmdInput.value.startsWith("history "))
                commands.history(stdOut,cmdInput);
            else if(cmdInput.value==="help" || cmdInput.value.startsWith("help "))
                commands.help(stdOut,cmdInput);
            else if(cmdInput.value==="toggle" || cmdInput.value.startsWith("toggle "))
                commands.toggle(stdOut,cmdInput);
            else
                commands.error(stdOut,cmdInput,cmdInput.value + ": command not found");
        }
    }  
})();   

var terminal = (function() {
    return {
        init: function() {
            var stdOut = document.getElementById(config.stdOutElemId);
            stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createUserHost());
            stdOut.insertAdjacentHTML("beforeend",htmlBuilder.createCmdInput());

            var cmdInput = document.getElementById(config.stdInElemId);
            cmdInput.addEventListener("keyup", function(event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    cmdInput.style.display = "none";
                    stdOut.insertAdjacentHTML("beforeend",cmdInput.value);
                    cli.interpreter(stdOut,cmdInput);
                    cmdHistory.commands.push(cmdInput.value);
                    cmdHistory.index++;
                } else if (event.keyCode === 38) {
                    if(cmdHistory.index===0)
                        cmdHistory.index=cmdHistory.commands.length-1;
                    else
                        cmdHistory.index--;
                    cmdInput.value = cmdHistory.commands[cmdHistory.index];
                } else if (event.keyCode === 40) {
                    if(cmdHistory.index===cmdHistory.commands.length-1)
                        cmdHistory.index=0;
                    else
                        cmdHistory.index++;
                    cmdInput.value = cmdHistory.commands[cmdHistory.index];
                }
            });
            
            // run help automatically
            setTimeout(function(){
                cmdInput.value="help";
                cmdInput.style.display = "none";
                stdOut.insertAdjacentHTML("beforeend",cmdInput.value);
                cli.interpreter(stdOut,cmdInput);
                cmdHistory.commands.push(cmdInput.value);
                cmdHistory.index++;
                }
            , 1000);

            // run ls automatically
            setTimeout(function(){
                cmdInput.value="ls";
                cmdInput.style.display = "none";
                stdOut.insertAdjacentHTML("beforeend",cmdInput.value);
                cli.interpreter(stdOut,cmdInput);
                cmdHistory.commands.push(cmdInput.value);
                cmdHistory.index++;
                }
            , 3000);
        },        
    }
})();   

window.onload = terminal.init