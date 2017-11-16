const path = require("path");
const config = require("../lib/config");
const camel = require("to-camel-case");
const { get, set, link } = require("json-fs-db")(path.resolve("../../"));
const googleMapsClient = require("@google/maps").createClient({
  key: config.googleMapsAPIKey,
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
        googleMapsClient
          .places({ query: argv.text })
          .asPromise()
          .then(response => {
            console.log(response.json.results);
          });
      }
    );
    yargs.command(
      "add <text>",
      "save location to destinations package",
      () => {},
      async argv => {
        console.log(`searching for ${argv.text}`);
        const response = await googleMapsClient
          .places({ query: argv.text })
          .asPromise();
        if (response.json.results && response.json.results.length === 1) {
          const details = await googleMapsClient
            .place({ placeid: response.json.results[0].place_id })
            .asPromise();
          console.log("saving location to destinations:");
          const identifierComponents =
            details.json.result.address_components.filter(
              a =>
                a.types.includes("political") &&
                !a.types.includes("administrative_area_level_2")
            ).map((a) => a.short_name).reverse()
          identifierComponents.push(camel(details.json.result.name));
          set(`common.destinations.details.${identifierComponents.join(".")}`, details.json.result);
        } else {
          console.log("must be exactly one result to add location");
        }
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
