const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: "ca-central-1",
});

const S3Bucket = {
  uploadFile: async (imageBuffer) => {
    let timeStamp = new Date().getTime();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "file_" + timeStamp,
      Body: imageBuffer,
    };
    let data = { key: params.Key };
    let uploadResult = await s3.upload(params).promise();
    let url = uploadResult.Location;
    console.log("Upload Photo URL ===> ", url);
    data.url = url;
    data.timeStamp = timeStamp;
    return data;
  },
};

module.exports = {
  S3Bucket: S3Bucket,
};
