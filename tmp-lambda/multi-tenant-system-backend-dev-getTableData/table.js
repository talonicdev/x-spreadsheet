const { handler } = require("./handler");
const _Responses = require("./config/Responses");
const { User } = require("./services/User");

exports.create = handler(async (params) => {
  let tableData = await User.create(params);
  // if (tableData.statusCode != 200) {
  //   return tableData;
  // }
  if (tableData) {
    return _Responses._200({
      message: "Table created successfully",
      data: tableData,
    });
  } else {
    return _Responses._404({
      message: "Something went wrong",
    });
  }
});

exports.getTables = handler(async (params) => {
  let tenantId = params.user["cognito:username"];
  let resData = await User.getTables(tenantId);
  return _Responses._200({
    message: "Tables fetched successfully",
    data: resData,
  });
});

exports.getTableData = handler(async (params) => {
  let tenantId = params.user["cognito:username"];
  let tableId = params.pathParameters.tableId;
  let resData = await User.getTableData(tenantId, tableId);
  return _Responses._200({
    message: "Table Data fetched successfully",
    data: resData,
  });
});
