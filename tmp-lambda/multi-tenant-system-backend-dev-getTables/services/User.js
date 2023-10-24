const AWS = require("aws-sdk");
const { getCollectionCollection } = require("./DB_Connection");
const { S3Bucket } = require("./S3");
const { ObjectId } = require("mongodb");

AWS.config.update({ region: process.env.AWS_REGION });

const User = {
  create: async (params) => {
    try {
      // if (params.spreadsheetData) {
      //   const payloadSizeInBytes = Buffer.from(
      //     JSON.stringify(params.spreadsheetData)
      //   ).length;
      //   const maxSizeAllowed = 500000; // 500 kb (spreadsheetData JSON size limit)
      //   console.log("=> spreadsheetData size", payloadSizeInBytes);
      //   if (payloadSizeInBytes > maxSizeAllowed) {
      //     return {
      //       statusCode: 413,
      //       body: {
      //         message: "Request payload size exceeds the allowed limit.",
      //       },
      //     };
      //   }
      // }

      const fileData = [];
      // for (let index = 0; index < params.attachments.length; index++) {
      //   let element = params.attachments[index].url;
      //   const base64Content = element.split(";base64,").pop();
      //   const binaryContent = Buffer.from(base64Content, "base64");
      //   const sizeLimit = 204800; // 2 mb for each file limit
      //   console.log("=> attachedFile size", binaryContent.length);
      //   if (binaryContent.length > sizeLimit) {
      //     return {
      //       statusCode: 413,
      //       message: "File size exceeds the limit.",
      //     };
      //   }
      // }

      for (let index = 0; index < params.attachments.length; index++) {
        let element = params.attachments[index];
        const docBuffer = new Buffer.from(
          element.url.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        let uploadFileData = await S3Bucket.uploadFile(docBuffer);
        const fileObj = {
          url: uploadFileData.url,
          date: Date.now(),
        };
        fileData.push(fileObj);
      }

      const spreadSheetData = {
        tenantId: params.user["cognito:username"],
        table_id: `table_${Date.now()}`,
        access_type: params.access_type,
        creator: params.user.email,
        owner: params.user.email,
        createAt: Date.now(),
        formData: {
          tableName: params.tableName,
          notes: params.notes,
          attachments: fileData,
          "spreadsheet-data": params.spreadsheetData,
        },
      };

      const collection_col_table_data = await getCollectionCollection(
        "col_table_data"
      );
      const createTableResponse = await collection_col_table_data.insertOne({
        ...spreadSheetData,
      });

      let tableInfo = {
        tenantId: params.user["cognito:username"],
        tableId: new ObjectId(createTableResponse.insertedId).toString() || "",
        tableRefId: spreadSheetData.table_id,
        access_type: params.access_type,
        creator: params.user.email,
        owner: params.user.email,
        tableName: params.tableName,
        createAt: Date.now(),
      };

      const collection_col_table_list = await getCollectionCollection(
        "col_table_list"
      );
      const response = await collection_col_table_list.insertOne({
        ...tableInfo,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  getTables: async (tenantId) => {
    try {
      const collection = await getCollectionCollection("col_table_list");
      const data = await collection.find({ tenantId: tenantId }).toArray();
      return data;
    } catch (error) {
      throw error;
    }
  },
  getTableData: async (tenantId, tableId) => {
    try {
      const collection = await getCollectionCollection("col_table_data");
      const data = await collection
        .find({
          $and: [
            { _id: new ObjectId(tableId.toString()) },
            { tenantId: tenantId },
          ],
        })
        .toArray();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = { User: User };
