function getBrowserName() {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";

  if (userAgent.indexOf("Chrome") > -1 && !userAgent.indexOf("Edge") > -1) {
    browserName = "C";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "F";
  } else if (userAgent.indexOf("Safari") > -1 && !userAgent.indexOf("Chrome") > -1) {
    browserName = "S";
  } else if (userAgent.indexOf("Edge") > -1) {
    browserName = "E";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserName = "O";
  } else if (userAgent.indexOf("MSIE") > -1 || !!document.documentMode) { // IE 10+
    browserName = "I";
  }

  return browserName;
}

function getOperatingSystem() {
    const userAgent = navigator.userAgent;
    let os = "Unknown OS";

    if (userAgent.indexOf("Win") !== -1) {
        os = "W";
    } else if (userAgent.indexOf("Mac") !== -1) {
        os = "m";
    } else if (userAgent.indexOf("Linux") !== -1) {
        os = "L";
    } else if (userAgent.indexOf("Android") !== -1) {
        os = "A";
    } else if (userAgent.indexOf("like_Mac") !== -1) { // For iOS devices
        os = "i";
    }

    return os;
}

let name = getBrowserName()+"_at_"+navigator.platform.split(" ")[1];
function getSystemIdent(){
    return name;
}

export{ getBrowserName, getOperatingSystem, getSystemIdent }