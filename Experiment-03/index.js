const fs = require('fs');

fs.writeFile("EXP-03.txt", "Hii NodeJs Lovers.", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("The Data is Added !");
});

fs.readFile("EXP-03.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});

fs.appendFile("EXP-03.txt", "   Node.js is a powerful and versatile JavaScript runtime that allows developers to build scalable and high-performance applications. Its event-driven, non-blocking I/O model ensures efficient handling of numerous concurrent connections, making it ideal for real-time applications. With a vast ecosystem of packages available through npm, developers can easily integrate various functionalities into their projects. Node.js also benefits from a strong community that continually contributes to its growth and improvement. Its ability to handle both frontend and backend development with JavaScript simplifies the development process and enhances productivity.", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("The data is Added");
})

fs.rename("EXP-03", "EXPERIMENT-03", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("The File Name is changed.")
});

fs.unlink("EXPERIMENT-03", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("The file is DELETED.")
});