export const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key]) || typeof obj[key] == "object") {
        return (
          encodeURIComponent(key) +
          "=" +
          encodeURIComponent(JSON.stringify(obj[key]))
        );
      } else {
        return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
      }
    })
    .join("&");
};
