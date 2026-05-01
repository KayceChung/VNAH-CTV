const SHEET_NAME = "NHÂN_SỰ";

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
  Signature_Staff: "Signature_Staff",
  Scan_CCCD: "Scan CCCD",
  ID_Card_Pic: "ID Card Pic",
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

  // ===== DEBUG: Log incoming data =====
  Logger.log("===== registerEmployee() CALLED =====");
  Logger.log("Incoming data keys: " + Object.keys(data).join(", "));
  Logger.log("id_employees: " + id_employees);
  Logger.log("has signature_data? " + !!data.signature_data);
  Logger.log("has cccd_image_data? " + !!data.cccd_image_data);
  if (data.signature_data) {
    Logger.log("signature_data type: " + typeof data.signature_data);
    Logger.log("signature_data length: " + (data.signature_data ? data.signature_data.length : "N/A"));
    Logger.log("signature_data first 100 chars: " + String(data.signature_data).substring(0, 100));
  }
  // ===== END DEBUG =====

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
  const signatureStaffIndex = headers.indexOf(COLUMNS.Signature_Staff);
  const idCardPicIndex = headers.indexOf(COLUMNS.ID_Card_Pic);

  // Debug logging for column indices
  Logger.log("Column Indices Debug:");
  Logger.log("ID_number: " + idNumberIndex + " (expected col A)");
  Logger.log("Working_at: " + workingAtIndex + " (expected col AP)");
  Logger.log("Relation_ship: " + relationshipIndex + " (expected col Z)");
  Logger.log("Department: " + departmentIndex + " (expected col AG)");
  Logger.log("Branch: " + branchIndex + " (expected col W)");
  Logger.log("Branch_CODE: " + branchCodeIndex + " (expected col X)");
  Logger.log("Title: " + titleIndex + " (expected col AI)");
  Logger.log("Signature_Staff: " + signatureStaffIndex);
  Logger.log("ID_Card_Pic: " + idCardPicIndex);

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

  // Handle signature file upload
  Logger.log("DEBUG: signature_data present? " + (!!data.signature_data));
  Logger.log("DEBUG: signature_data is null? " + (data.signature_data === null));
  Logger.log("DEBUG: signature_data is undefined? " + (data.signature_data === undefined));
  Logger.log("DEBUG: signature_data value: " + data.signature_data);
  
  if (data.signature_data && String(data.signature_data).trim() !== "") {
    try {
      Logger.log("DEBUG: Starting signature upload for " + id_employees);
      Logger.log("DEBUG: signature_data length: " + data.signature_data.length);
      Logger.log("DEBUG: signature_data type: " + typeof data.signature_data);
      Logger.log("DEBUG: signature_data first 100 chars: " + String(data.signature_data).substring(0, 100));
      
      // Create filename with format: UUID.Signature_Staff.timestamp.png
      const timestamp = Math.floor(Date.now() / 1000);  // Epoch seconds
      const signatureFileName = id_number + ".Signature_Staff." + timestamp + ".png";
      const folderName = "Kho_chu_ky_NV";
      Logger.log("DEBUG: Generated filename: " + signatureFileName);
      
      const signatureResult = saveFileToGoogleDrive(
        data.signature_data, 
        signatureFileName, 
        "image/png",
        folderName  // Folder for signatures
      );
      Logger.log("DEBUG: Signature URL created: " + signatureResult.url);
      const signaturePath = folderName + "/" + signatureFileName;  // Path for AppSheet: Kho_chu_ky_NV/ID.Signature_Staff.timestamp.png
      Logger.log("DEBUG: Signature path: " + signaturePath);
      Logger.log("DEBUG: Signature column index: " + signatureStaffIndex);
      if (signatureStaffIndex !== -1) {
        newRowData[signatureStaffIndex] = signaturePath;  // Save path structure for AppSheet
        Logger.log("DEBUG: Signature path saved to row at index " + signatureStaffIndex + ": " + signaturePath);
      }
    } catch (error) {
      Logger.log("ERROR uploading signature: " + error);
      Logger.log("ERROR message: " + error.message);
      Logger.log("ERROR stack: " + error.stack);
      Logger.log("ERROR toString: " + error.toString());
    }
  } else {
    Logger.log("WARNING: No signature_data provided in request or signature_data is empty");
    Logger.log("WARNING: data.signature_data = " + data.signature_data);
  }

  // Handle CCCD image file upload
  if (data.cccd_image_data) {
    try {
      // Create filename with format: UUID.ID Card Pic.timestamp.jpg
      const timestamp = Math.floor(Date.now() / 1000);  // Epoch seconds
      const cccdFileName = id_number + ".ID Card Pic." + timestamp + ".jpg";
      const folderName = "Anh_chup_nhan_vien";
      Logger.log("DEBUG: Generated CCCD filename: " + cccdFileName);
      
      const cccdResult = saveFileToGoogleDrive(
        data.cccd_image_data, 
        cccdFileName, 
        "image/jpeg",
        folderName  // Folder for ID card photos
      );
      Logger.log("DEBUG: CCCD URL created: " + cccdResult.url);
      const cccdPath = folderName + "/" + cccdFileName;  // Path for AppSheet: Anh_chup_nhan_vien/ID.ID Card Pic.timestamp.jpg
      Logger.log("DEBUG: CCCD path: " + cccdPath);
      Logger.log("DEBUG: CCCD column index: " + idCardPicIndex);
      if (idCardPicIndex !== -1) {
        newRowData[idCardPicIndex] = cccdPath;  // Save path structure for AppSheet
        Logger.log("DEBUG: CCCD path saved to ID Card Pic column at index " + idCardPicIndex + ": " + cccdPath);
      }
    } catch (error) {
      Logger.log("Error uploading ID card photo: " + error);
    }
  }

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
    Signature_Staff: valueOf(record, COLUMNS.Signature_Staff),
    Scan_CCCD: valueOf(record, COLUMNS.Scan_CCCD),
    ID_Card_Pic: valueOf(record, COLUMNS.ID_Card_Pic),
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

/**
 * Save base64 data as file in Google Drive and return shareable URL + path structure
 * @param {string} base64Data - Base64 encoded file data
 * @param {string} fileName - Name of the file
 * @param {string} mimeType - MIME type (e.g., image/png, image/jpeg)
 * @param {string} folderName - Google Drive folder name to save in
 * @returns {object} { url: googleDriveUrl, path: "folderName/fileName" }
 */
function saveFileToGoogleDrive(base64Data, fileName, mimeType, folderName) {
  try {
    Logger.log("=== saveFileToGoogleDrive START ===");
    Logger.log("fileName: " + fileName);
    Logger.log("mimeType: " + mimeType);
    Logger.log("folderName: " + folderName);
    Logger.log("base64Data length: " + base64Data.length);
    
    // Extract base64 content (remove data:image/png;base64, prefix if present)
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
    Logger.log("After extraction - base64String length: " + base64String.length);
    
    // Decode base64 to bytes
    const decodedData = Utilities.base64Decode(base64String);
    Logger.log("Decoded data size: " + decodedData.length + " bytes");
    
    // Create blob
    const blob = Utilities.newBlob(decodedData, mimeType, fileName);
    Logger.log("Blob created: " + blob.getName());
    
    // Get or create the specified folder in Google Drive
    Logger.log("Finding/creating folder: " + folderName);
    let folder = findOrCreateFolder(folderName);
    Logger.log("Folder found/created, ID: " + folder.getId());
    
    // Create file in folder
    Logger.log("Creating file in folder...");
    const file = folder.createFile(blob);
    Logger.log("File created: " + file.getName() + " (ID: " + file.getId() + ")");
    
    // Set file to be viewable by anyone with link
    Logger.log("Setting sharing permissions...");
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    Logger.log("Sharing permissions set");
    
    // Return both shareable link and path structure
    const url = file.getUrl();
    const path = folderName + "/" + fileName;  // Path structure for AppSheet: folderName/fileName
    Logger.log("File URL: " + url);
    Logger.log("File Path: " + path);
    Logger.log("=== saveFileToGoogleDrive SUCCESS ===");
    return { url: url, path: path };
  } catch (error) {
    Logger.log("=== saveFileToGoogleDrive ERROR ===");
    Logger.log("Error message: " + error.message);
    Logger.log("Error: " + error);
    Logger.log("Error toString: " + error.toString());
    throw error;
  }
}

/**
 * Find or create a folder in Google Drive
 */
function findOrCreateFolder(folderName) {
  try {
    Logger.log("Looking for folder: " + folderName);
    const folders = DriveApp.getFoldersByName(folderName);
    
    if (folders.hasNext()) {
      const folder = folders.next();
      Logger.log("Folder found: " + folder.getId());
      return folder;
    } else {
      Logger.log("Folder not found, creating new folder: " + folderName);
      const newFolder = DriveApp.createFolder(folderName);
      Logger.log("New folder created: " + newFolder.getId());
      return newFolder;
    }
  } catch (error) {
    Logger.log("ERROR in findOrCreateFolder: " + error);
    Logger.log("ERROR: " + error.toString());
    throw error;
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to check Google Drive permissions
 * Call this to verify GAS can access Drive
 */
function testGoogleDriveAccess() {
  try {
    Logger.log("=== TEST: Google Drive Access ===");
    
    // Test 1: Can we list folders?
    Logger.log("Test 1: Listing folders in Drive root...");
    const folders = DriveApp.getFoldersByName("VNAH_Signatures");
    let folderCount = 0;
    while (folders.hasNext()) {
      folders.next();
      folderCount++;
    }
    Logger.log("Found " + folderCount + " folders named 'VNAH_Signatures'");
    
    // Test 2: Can we create a test folder?
    Logger.log("Test 2: Creating test folder...");
    const testFolder = DriveApp.createFolder("VNAH_TEST_" + new Date().getTime());
    Logger.log("Test folder created: " + testFolder.getId());
    
    // Test 3: Can we create a file?
    Logger.log("Test 3: Creating test file...");
    const blob = Utilities.newBlob("Test content", "text/plain", "test.txt");
    const file = testFolder.createFile(blob);
    Logger.log("Test file created: " + file.getId());
    
    // Test 4: Can we set sharing?
    Logger.log("Test 4: Setting sharing permissions...");
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    Logger.log("Sharing set successfully");
    
    // Test 5: Get the file URL
    const url = file.getUrl();
    Logger.log("File URL: " + url);
    
    Logger.log("=== ALL TESTS PASSED ===");
    return {
      success: true,
      message: "Google Drive access working!",
      testFolderId: testFolder.getId(),
      testFileId: file.getId()
    };
    
  } catch (error) {
    Logger.log("=== TEST FAILED ===");
    Logger.log("Error: " + error);
    Logger.log("Error message: " + error.message);
    Logger.log("Error stack: " + error.stack);
    return {
      success: false,
      error: error.toString(),
      message: "Google Drive access FAILED - check authorization!"
    };
  }
}