import { Command } from 'commander';
import { parseStream } from "fast-csv"
import { createReadStream } from "fs";
import winston from "winston";

const LOGGER = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/service.log' })
  ]
});

const program = new Command()
  .option('-d, --dryrun <boolean>', 'run in dry-run mode', 'true')

const dry_run = program.parse().opts().dryrun;

const createUploadRequestFromRow = (row: any, headers: string[]) => {
  return [];
}

const readAndUploadDataFromCSV = async () => {
  LOGGER.info(`[Script configuration overview] Dry_Run=${dry_run}`);

  let requests: any[] = [];

  const stream = createReadStream('resources/sample.csv');

  // The headers of the CSV act as our keys for the tags we attach to the data we upload
  let headers = [] as string[];

  parseStream(stream, { headers: true, ignoreEmpty: true })
    .on('headers', _headers => {
      headers = _headers;
      LOGGER.info(`[Headers parsed] headers=${headers}`);
    })
    .on('error', error => LOGGER.error(`[Error parsing CSV] Error=${error}`))
    .on('data', ((row) => {
      const uploadRequest = createUploadRequestFromRow(row, headers);

      if (dry_run === "true") {
        LOGGER.info(`[Row processed] row=${JSON.stringify(row)}`);
        LOGGER.info(`[Upload Request] ${JSON.stringify(uploadRequest)}`);
      }

      requests.push(uploadRequest);

    }))
    .on('end', async (rowCount: number) => {
      LOGGER.info(`[CSV processing completed] Parsed ${rowCount} rows`);

      if(dry_run === "true") {
        console.log("dry run")
      } else {
        console.log("preform upload")
      }

    });
}

readAndUploadDataFromCSV();