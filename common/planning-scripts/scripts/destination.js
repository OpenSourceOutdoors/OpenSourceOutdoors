const googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyDPoYu1d5L6kKUdC0VFqoKzgnR4kMBmZ4A",
  Promise
});

module.exports = {
  command: "destination",
  aliases: ["dest"],
  desc: "work with locations",
  builder: yargs => {
    yargs.command(
      "search <text>",
      "find a location",
      () => {},
      argv => {
        console.log(`searching for ${argv.text}`);
        googleMapsClient.places({ query: argv.text }).asPromise().then(response => {
          console.log(response.json.results);
        });
      }
    );
    yargs.command(
      "add <text>",
      "save location to destinations package",
      () => {},
      argv => {
        console.log(`searching for ${argv.text}`);
        googleMapsClient.places({ query: argv.text }).asPromise().then(response => {
          if (response.json.results && response.json.results.length === 1) {
            console.log("saving location to destinations:");
            console.log(response.json.results);
          } else {
            console.log("must be exactly one result to add location");
          }
        });
      }
    );
  },
  handler: argv => {
    console.log(`setting ${argv.key} to ${argv.value}`);
    if (argv.search) {
      console.log("foo");
    }
  }
};
