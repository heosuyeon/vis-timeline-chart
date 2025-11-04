export function stringifyObject(object: any): string {
  if (!object) return "";
  var replacer = function (key: string, value: any) {
    if (value && value.tagName) {
      return "DOM Element";
    } else {
      return value;
    }
  };
  return JSON.stringify(object, replacer);
}
