export default function (payload) {
  // return `hello ${payload}`;

  const doc = {
    content: [
      `Hello ${payload}`,
    ],
  };


  return doc;
}
