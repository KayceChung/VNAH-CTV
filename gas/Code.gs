const SHEET_NAME = "Employees";
const WEBHOOK_URL = "https://yi7a1c8g.rpcld.co/webhook/48886004-231e-4cf0-8640-9f4f40b85db3";

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
  Department: "Department",
  Title: "Title",
  Working_at: "Working_at",
  Ward: "Ward",
  ID_number: "ID number",
  Status: "Status",
  LAST_CHANGE_BY: "LAST_CHANGE_BY",
  LAST_CHANGE_AT: "LAST_CHANGE_AT",
  COUNT: "COUNT",
  UPDATE_AT: "UPDATE_AT",
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const action = data.action;

    if (action === "verifyIdentity") return verifyIdentity(data);
    if (action === "updateEmployee") return updateEmployee(data);
    if (action === "getColumns") return getColumnsDebug();

    return respond({ error: "Hành động không xác định", received: action });
  } catch (error) {
    return respond({
      success: false,
      message: error.message || "Lỗi máy chủ không xác định",
    });
  }
}

function getColumnsDebug() {
  try {
    const sheet = getSheet();
    const values = sheet.getDataRange().getValues();
    if (values.length < 1) {
      return respond({ error: "Sheet trống" });
    }
    
    const headers = values[0].map(function(header) {
      return String(header).trim();
    });
    
    return respond({ 
      columns: headers,
      totalColumns: headers.length,
      totalRows: values.length 
    });
  } catch (error) {
    return respond({
      error: error.toString(),
      message: "Không thể lấy danh sách cột"
    });
  }
}

function verifyIdentity(data) {
  const fullName = normalizeText(data.full_name);
  const phone = normalizePhone(data.phone);

  if (!fullName || !phone) {
    return respond({ found: false, message: "Thiếu họ tên hoặc số điện thoại" });
  }

  const sheet = getSheet();
  const rowData = findEmployeeRowByIdentity(sheet, fullName, phone);

  if (!rowData) {
    return respond({ found: false, message: "Không tìm thấy nhân viên phù hợp" });
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
    return respond({ success: false, message: "Không tìm thấy nhân viên" });
  }

  const headers = rowData.headers;
  const rowIndex = rowData.rowIndex;
  const now = new Date();
  const oldZalo = valueOf(rowData.record, COLUMNS.Zalo);

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
    const newZalo = String(updates.zalo || "").trim();
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Zalo, newZalo);
    
    // Gọi webhook nếu Zalo thay đổi
    if (oldZalo !== newZalo) {
      callWebhook({
        action: "zalo_updated",
        timestamp: now.toISOString(),
        employee: {
          name: valueOf(rowData.record, COLUMNS.Name),
          phone: valueOf(rowData.record, COLUMNS.Phone),
          username: valueOf(rowData.record, COLUMNS.ID_Employees),
          oldZalo: oldZalo,
          newZalo: newZalo
        }
      });
    }
  }
  if (updates.dob !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.DoB, String(updates.dob || "").trim());
  }
  if (updates.sex !== undefined) {
    setCellByHeader(sheet, headers, rowIndex, COLUMNS.Sex, String(updates.sex || "").trim());
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
    const availableColumns = headers.join(", ");
    throw new Error("Không tìm thấy cột 'Name' hoặc 'Phone'. Các cột có sẵn: " + availableColumns);
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
    throw new Error("Không tìm thấy cột '" + COLUMNS.ID_Employees + "'");
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
    throw new Error("Không tìm thấy cột '" + headerName + "'");
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

function callWebhook(payload) {
  try {
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
      timeout: 10000
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log("Webhook gọi thành công: " + responseCode);
    Logger.log("Phản hồi: " + response.getContentText());
    
    return true;
  } catch (error) {
    Logger.log("Lỗi gọi webhook: " + error.toString());
    return false;
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}