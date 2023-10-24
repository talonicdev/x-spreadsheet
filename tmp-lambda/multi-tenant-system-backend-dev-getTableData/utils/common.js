exports.parseJwt = (token) => {

  console.log("=> token", JSON.stringify(token));

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const buff = new Buffer.from(base64, "base64");
  const payloadinit = buff.toString("ascii");
  return JSON.parse(payloadinit || "{}");
};

