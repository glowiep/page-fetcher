const args = process.argv.slice(2);
const url = args[0];
const filePath = args[1];

const request = require('request');
const fs = require('fs'); // use Node's file system module to write the file
const { isValidUrl } = require('./isValidUrl');
const stat = fs.stat;

// If there is no command line arguments entered
if (args.length === 0 || args.length > 2) {
  console.log("🛑 Please enter a URL and FILEPATH when running 'node fletcher.js'");
} else if (args.length === 1) {
  console.log("🛑 Please check your inputs, URL or FILEPATH is missing.");
}

// Check for URL validity
if (!isValidUrl(url)) {
  console.log("🛑 Please enter a valid URL.");
}

// make an http request and wait for the response.
request(url, (error, response, body) => {
  let fileName = "index.html";
  let fullFilePath = filePath + fileName;
  let statusCode = 0;

  if (error) {
    return `🚨 Error: ${error}`;
  }

  if (!(response.statusCode >= 200) || !(response.statusCode < 300)) {
    statusCode = response.statusCode;
    console.log(`🚨 Status: ${statusCode}. File download failed, please check URL.`);
  }

  // If HTTP request is successful, write the data into local filesystem
  fs.writeFile(fileName, body, error => {
    if (error) {
      return console.error(error);
    }
    // If status code is not a 200 type
    if (!(statusCode >= 200) || !(statusCode < 300)) {
      return response.statusCode;
    }

    // If downloaded successfully
    stat(fileName, (err, stats) => {
      if (err) {
        return `🚨 Error code: ${err.code}`;
      }
      let fileSize = stats.size;
      console.log(`✅ Downloaded ${fileSize} bytes and saved to ${fullFilePath}`);
    });
  });
});


// test pass
// node fetcher.js http://example.edu/ ./

// test fail
// node fetcher.js https://www.google.com/fdsafsafsa.html ./


/**STRETCH
 * 1. If the file path already exists,prompt them to type in Y(followed by the enter key) to overwrite the file, 
 * otherwise skip and exit the app. (readline module)
 * 
 * 2. File Path is Invalid
 * the app should fail and let the user know about this issue.
 */