// TAITS Business Proof Kit — Google Apps Script backend
// Schema columns (in order):
// email | first-seen | day-1 | day-2 | day-3 | day-4 | day-5 | last-active | sentence | checklist-state

var SHEET_NAME = 'Progress';

var COLUMNS = [
  'email',
  'first-seen',
  'day-1',
  'day-2',
  'day-3',
  'day-4',
  'day-5',
  'last-active',
  'sentence',
  'checklist-state',   // NEW: JSON string, e.g. {"day-1":[true,false,true,true,false]}
];

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
  }
  // Ensure header row has all expected columns (handles adding new columns to existing sheets)
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  COLUMNS.forEach(function(col, i) {
    if (headers.indexOf(col) === -1) {
      var nextCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextCol).setValue(col);
    }
  });
  return sheet;
}

function findRowByEmail(sheet, email) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase().trim() === email.toLowerCase().trim()) {
      return i + 1; // 1-indexed row number
    }
  }
  return -1;
}

function colIndex(colName) {
  return COLUMNS.indexOf(colName); // 0-indexed
}

function doGet(e) {
  var params = e.parameter;
  var action = params.action;
  var email = (params.email || '').toLowerCase().trim();

  var result;

  if (action === 'get') {
    result = handleGet(email);
  } else if (action === 'save') {
    result = handleSave(params, email);
  } else {
    result = { error: 'Unknown action' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var params = e.parameter;
  var action = params.action;
  var email = (params.email || '').toLowerCase().trim();

  var result;

  if (action === 'get') {
    result = handleGet(email);
  } else if (action === 'save') {
    result = handleSave(params, email);
  } else {
    result = { error: 'Unknown action' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGet(email) {
  if (!email) return { found: false, error: 'No email provided' };

  var sheet = getOrCreateSheet();
  var rowNum = findRowByEmail(sheet, email);

  if (rowNum === -1) return { found: false };

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];

  var result = { found: true };
  headers.forEach(function(header, i) {
    result[header] = rowData[i];
  });

  return result;
}

function handleSave(params, email) {
  if (!email) return { success: false, error: 'No email provided' };

  var sheet = getOrCreateSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowNum = findRowByEmail(sheet, email);
  var now = new Date().toISOString();

  if (rowNum === -1) {
    // New row
    var newRow = COLUMNS.map(function(col) {
      if (col === 'email') return email;
      if (col === 'first-seen') return now;
      if (col === 'last-active') return now;
      return params[col] || '';
    });
    sheet.appendRow(newRow);
  } else {
    // Update existing row — write only columns present in params, always update last-active
    headers.forEach(function(header, i) {
      if (header === 'last-active') {
        sheet.getRange(rowNum, i + 1).setValue(now);
      } else if (header !== 'email' && header !== 'first-seen' && params[header] !== undefined) {
        sheet.getRange(rowNum, i + 1).setValue(params[header]);
      }
    });
  }

  return { success: true };
}
