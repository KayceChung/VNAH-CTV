const SHEET_NAME = "Employees";

const COLUMNS = {
  ID_Employees: "ID Employess",
  Pass_word: "Pass_word",
  Name: "Name",
  DoB: "DoB",
  Sex: "Sex",
  Address: "Address",
  Phone: "Phone",
  Zalo: "Zalo",
  Email: "Email",
  Branch: "Branch",
  Branch_CODE: "Branch_CODE",
  Department: "Department",
  Title: "Title",
  Working_at: "Working_at",
  Ward: "Ward",
  ID_number: "ID",
  Status: "Status",
  LAST_CHANGE_BY: "LAST_CHANGE_BY",
  LAST_CHANGE_AT: "LAST_CHANGE_AT",
  COUNT: "COUNT",
  UPDATE_AT: "UPDATE_AT",
  Relation_ship: "Relation_ship",
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const action = data.action;

    if (action === "verifyIdentity") return verifyIdentity(data);
    if (action === "updateEmployee") return updateEmployee(data);
    if (action === "registerEmployee") return registerEmployee(data);

    return respond({ error: "Unknown action" });
  } catch (error) {
    return respond({
      success: false,
      message: error.message || "Unexpected server error",
    });
  }
}

function verifyIdentity(data) {
  const fullName = normalizeText(data.full_name);
  const phone = normalizePhone(data.phone);

  if (!fullName || !phone) {
    return respond({ found: false, message: "Missing full_name or phone" });
  }

  const sheet = getSheet();
  const rowData = findEmployeeRowByIdentity(sheet, fullName, phone);

  if (!rowData) {
    return respond({ found: false });
  }

  return respond({
    found: true,
    employee: buildEmployee(rowData.record),
  });
}

function updateEmployee(data) {
  const fullName = normalizeText(data.full_name);
  const phone = normalizePhone(data.phone);
  const updates = data.updates || {};
  const sheet = getSheet();
  const rowData = findEmployeeRowByIdentity(sheet, fullName, phone);

  if (!rowData) {
    return respond({ success: false, message: "Employee not found" });
  }

  const headers = rowData.headers;
  const rowIndex = rowData.rowIndex;
  const now = new Date();

  if (updates.name !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Name, String(updates.name || "").trim());
  }
  if (updates.username !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.ID_Employees, String(updates.username || "").trim());
  }
  if (updates.password !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Pass_word, String(updates.password || ""));
  }
  if (updates.email !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Email, String(updates.email || "").trim());
  }
  if (updates.address !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Address, String(updates.address || "").trim());
  }
  if (updates.zalo !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Zalo, String(updates.zalo || "").trim());
  }
  setCellByHeader(sheet, headers, rowIndex, COLUMNS.LAST_CHANGE_BY, String(updates.username || valueOf(rowData.record, COLUMNS.ID_Employees) || fullName));
  setCellByHeader(sheet, headers, rowIndex, COLUMNS.LAST_CHANGE_AT, now);
  setCellByHeader(sheet, headers, rowIndex, COLUMNS.COUNT, Number(valueOf(rowData.record, COLUMNS.COUNT) || 0) + 1);
  setCellByHeader(sheet, headers, rowIndex, COLUMNS.UPDATE_AT, now);

  SpreadsheetApp.flush();

  const refreshedRow = findEmployeeRowByIdentity(sheet, normalizeText(String(updates.name || fullName)), phone) || findEmployeeRowByUsername(sheet, String(updates.username || valueOf(rowData.record, COLUMNS.ID_Employees)));

  return respond({
    success: true,
    employee: refreshedRow ? buildEmployee(refreshedRow.record) : buildEmployee(rowData.record),
  });
}

/**
 * Register a new employee account
 * Stores UUID in ID_number column, plain text password
 */
function registerEmployee(data) {
  const id_number = String(data.id_number || "").trim();
  const id_employees = String(data.id_employees || "").trim();
  const password = String(data.password || "");
  const name = String(data.name || "").trim();
  const dob = String(data.dob || "").trim();
  const sex = String(data.sex || "").trim();
  const address = String(data.address || "").trim();
  const phone = String(data.phone || "").trim();
  const zalo = String(data.zalo || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const working_at = String(data.working_at || "").trim();
  const ward = String(data.ward || "").trim();
  const relation_ship = String(data.relation_ship || "").trim();
  const title = String(data.title || "").trim();
  const department = String(data.department || "3").trim();
  const branch = String(data.branch || "TT_8").trim();
  const branch_code = String(data.branch_code || "TT_8").trim();

  // Validate all required fields
  if (!id_employees || !password || !name || !dob || !sex || !address || !phone || !email || !working_at || !ward) {
    return respond({
      success: false,
      message: "All fields are required"
    });
  }

  const sheet = getSheet();

  // Check if ID_Employees already exists
  if (findEmployeeRowByUsername(sheet, id_employees)) {
    return respond({
      success: false,
      message: "ID_Employees already exists"
    });
  }

  // Check if Email already exists
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(header) {
    return String(header).trim();
  });
  const emailIndex = headers.indexOf(COLUMNS.Email);

  if (emailIndex !== -1) {
    for (var i = 1; i < values.length; i += 1) {
      if (String(values[i][emailIndex]).trim().toLowerCase() === email) {
        return respond({
          success: false,
          message: "Email already registered"
        });
      }
    }
  }

  // Get column indices - with debug logging
  const idNumberIndex = headers.indexOf(COLUMNS.ID_number);
  const nameIndex = headers.indexOf(COLUMNS.Name);
  const dobIndex = headers.indexOf(COLUMNS.DoB);
  const sexIndex = headers.indexOf(COLUMNS.Sex);
  const addressIndex = headers.indexOf(COLUMNS.Address);
  const phoneIndex = headers.indexOf(COLUMNS.Phone);
  const zaloIndex = headers.indexOf(COLUMNS.Zalo);
  const emailIndex2 = headers.indexOf(COLUMNS.Email);
  const workingAtIndex = headers.indexOf(COLUMNS.Working_at);
  const wardIndex = headers.indexOf(COLUMNS.Ward);
  const idEmployeesIndex = headers.indexOf(COLUMNS.ID_Employees);
  const passwordIndex = headers.indexOf(COLUMNS.Pass_word);
  const titleIndex = headers.indexOf(COLUMNS.Title);
  const departmentIndex = headers.indexOf(COLUMNS.Department);
  const branchIndex = headers.indexOf(COLUMNS.Branch);
  const branchCodeIndex = headers.indexOf(COLUMNS.Branch_CODE);
  const statusIndex = headers.indexOf(COLUMNS.Status);
  const lastChangeByIndex = headers.indexOf(COLUMNS.LAST_CHANGE_BY);
  const lastChangeAtIndex = headers.indexOf(COLUMNS.LAST_CHANGE_AT);
  const countIndex = headers.indexOf(COLUMNS.COUNT);
  const updateAtIndex = headers.indexOf(COLUMNS.UPDATE_AT);
  const relationshipIndex = headers.indexOf(COLUMNS.Relation_ship);

  // Validate all required columns exist
  if (idNumberIndex === -1 || idEmployeesIndex === -1 || passwordIndex === -1 || nameIndex === -1) {
    return respond({
      success: false,
      message: "Missing required columns in sheet: ID_number=" + idNumberIndex + ", ID_Employees=" + idEmployeesIndex + ", Pass_word=" + passwordIndex + ", Name=" + nameIndex
    });
  }

  const now = new Date();
  var newRowData = new Array(headers.length);
  
  // Initialize all cells with empty string
  for (var j = 0; j < newRowData.length; j += 1) {
    newRowData[j] = "";
  }

  // Set values
  newRowData[idNumberIndex] = id_number;
  newRowData[idEmployeesIndex] = id_employees;
  newRowData[passwordIndex] = password;
  newRowData[nameIndex] = name;
  if (dobIndex !== -1) newRowData[dobIndex] = dob;
  if (sexIndex !== -1) newRowData[sexIndex] = sex;
  if (addressIndex !== -1) newRowData[addressIndex] = address;
  if (phoneIndex !== -1) newRowData[phoneIndex] = phone;
  if (zaloIndex !== -1) newRowData[zaloIndex] = zalo;
  if (emailIndex2 !== -1) newRowData[emailIndex2] = email;
  if (workingAtIndex !== -1) newRowData[workingAtIndex] = working_at;
  if (wardIndex !== -1) newRowData[wardIndex] = ward;
  if (titleIndex !== -1) newRowData[titleIndex] = title;
  if (departmentIndex !== -1) newRowData[departmentIndex] = department;
  if (branchIndex !== -1) newRowData[branchIndex] = branch;
  if (branchCodeIndex !== -1) newRowData[branchCodeIndex] = branch_code;
  if (relationshipIndex !== -1) newRowData[relationshipIndex] = relation_ship;
  if (statusIndex !== -1) newRowData[statusIndex] = "❌ DEACTIVATE";
  if (lastChangeByIndex !== -1) newRowData[lastChangeByIndex] = "SYSTEM_REGISTER";
  if (lastChangeAtIndex !== -1) newRowData[lastChangeAtIndex] = now;
  if (countIndex !== -1) newRowData[countIndex] = 1;
  if (updateAtIndex !== -1) newRowData[updateAtIndex] = now;

  sheet.appendRow(newRowData);
  SpreadsheetApp.flush();

  return respond({
    success: true,
    message: "Registration successful. Waiting for admin approval.",
    employee: {
      ID_number: id_number,
      ID_Employees: id_employees,
      Name: name,
      Status: "❌ DEACTIVATE"
    }
  });
}

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function findEmployeeRowByIdentity(sheet, fullName, phone) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return null;
  }

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });
  const nameIndex = headers.indexOf(COLUMNS.Name);
  const phoneIndex = headers.indexOf(COLUMNS.Phone);

  if (nameIndex === -1 || phoneIndex === -1) {
    throw new Error("Name or Phone column not found");
  }

  for (var index = 1; index < values.length; index += 1) {
    if (normalizeText(values[index][nameIndex]) === fullName && normalizePhone(values[index][phoneIndex]) === phone) {
      return {
        headers: headers,
        record: rowToRecord(headers, values[index]),
        rowIndex: index + 1,
      };
    }
  }

  return null;
}

function findEmployeeRowByUsername(sheet, username) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return null;
  }

  const headers = values[0].map(function(header) {
    return String(header).trim();
  });
  const usernameIndex = headers.indexOf(COLUMNS.ID_Employees);

  if (usernameIndex === -1) {
    throw new Error(COLUMNS.ID_Employees + " column not found");
  }

  for (var index = 1; index < values.length; index += 1) {
    if (String(values[index][usernameIndex]).trim() === String(username || "").trim()) {
      return {
        headers: headers,
        record: rowToRecord(headers, values[index]),
        rowIndex: index + 1,
      };
    }
  }

  return null;
}

function rowToRecord(headers, row) {
  return headers.reduce(function(accumulator, header, index) {
    accumulator[header] = row[index];
    return accumulator;
  }, {});
}

function setCellByHeader(sheet, headers, rowIndex, headerName, value) {
  const columnIndex = headers.indexOf(headerName);
  if (columnIndex === -1) {
    throw new Error(headerName + " column not found");
  }

  sheet.getRange(rowIndex, columnIndex + 1).setValue(value);
}

function valueOf(record, key) {
  return record[key] == null ? "" : record[key];
}

function buildEmployee(record) {
  return {
    ID_Employees: valueOf(record, COLUMNS.ID_Employees),
    Name: valueOf(record, COLUMNS.Name),
    DoB: valueOf(record, COLUMNS.DoB),
    Sex: valueOf(record, COLUMNS.Sex),
    Phone: valueOf(record, COLUMNS.Phone),
    Zalo: valueOf(record, COLUMNS.Zalo),
    Email: valueOf(record, COLUMNS.Email),
    Address: valueOf(record, COLUMNS.Address),
    Branch: valueOf(record, COLUMNS.Branch),
    Department: valueOf(record, COLUMNS.Department),
    Title: valueOf(record, COLUMNS.Title),
    Working_at: valueOf(record, COLUMNS.Working_at),
    Ward: valueOf(record, COLUMNS.Ward),
    ID_number: valueOf(record, COLUMNS.ID_number),
    Status: valueOf(record, COLUMNS.Status),
    Pass_word: valueOf(record, COLUMNS.Pass_word),
    Relation_ship: valueOf(record, COLUMNS.Relation_ship),
  };
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}