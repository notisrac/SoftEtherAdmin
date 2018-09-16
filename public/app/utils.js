function getUptime(startDateString) {
  // parse the date
  var startDate = Date.parse(startDateString);
  // get the difference
  var dateDifference = Date.now() - startDate;
  // get the total ms, s, m, h, d
  var dateData = getDateTimeTotals(dateDifference);
  // select the largest that is not 0
  if (dateData.d > 0) {
    return dateData.d + "d";
  } else if (dateData.h > 0) {
    return dateData.h + "h";
  } else if (dateData.m > 0) {
    return dateData.m + "m";
  } else {
    return dateData.s + "s";
  }
}

function getDateTimeTotals(date) {
  return {
    ms: Math.floor(date % 1000),
    s: Math.floor((date / 1000) % 60),
    m: Math.floor((date / 60000) % 60),
    h: Math.floor((date / 3600000) % 24),
    d: Math.floor(date / 86400000)
  };
}

function convertToLargestDataUnit(value) {
  var bytes = value.replace(/\D/g, ""); // bytes
  var units = getDataUnits(bytes);
  if (units.pb > 0) {
    return units.pb + "P";
  } else if (units.gb > 0) {
    return units.gb + "G";
  } else if (units.mb > 0) {
    return units.mb + "M";
  } else if (units.kb > 0) {
    return units.kb + "k";
  } else {
    return units.b + "B";
  }
}

function getDataUnits(value) {
  return {
    b: value,
    kb: Math.floor(value / 1024),
    mb: Math.floor(value / 1048576),
    gb: Math.floor(value / 1073741824),
    pb: Math.floor(value / 1099511627776)
  };
}

function getArrayHeaders(data) {
    if (data.length < 1) {
        return [];
    }
    return Object.keys(data[0]);
}