import { Command } from 'commander';
import { parseStream } from "fast-csv"
import { createReadStream } from "fs";
import { MailMeta } from './src/types/mailer-types';
import { DISCORD_INVITE } from './src/utils/constants';
import mail from './src/mailer/mailer';
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

const createMailMetaFromRow = (row: any) => {
  return {
    to: row["email"],
    subject: "Web3Con 2022 Hackathon Discord invite",
    message: `Hi ${row["discord_handle"]}, thank you for joining the Web3Con 2022 hackathon.  Please use the link below to join the hackathon discord server`,
    inviteLinkHTML: `<h2>Discord invite link: </h2><p>${DISCORD_INVITE}</p>`
  } as MailMeta;
}

const mailParticipants = async (mailingList: MailMeta[]) => {
  for (let i = 0; i < mailingList.length; i++) {
    await mail(mailingList[i])
  }
}

const readAndProcessDataFromCSV = async () => {
  LOGGER.info(`[Script configuration overview] Dry_Run=${dry_run}`);

  let mailingList: any[] = [];

  const stream = createReadStream('resources/hackers.csv');

  // The headers of the CSV act as our keys for the tags we attach to the data we upload
  let headers = [] as string[];

  parseStream(stream, { headers: true, ignoreEmpty: true })
    .on('headers', _headers => {
      headers = _headers;
      LOGGER.info(`[Headers parsed] headers=${headers}`);
    })
    .on('error', error => LOGGER.error(`[Error parsing CSV] Error=${error}`))
    .on('data', ((row) => {
      const mailMeta = createMailMetaFromRow(row);

      if (dry_run === "true") {
        LOGGER.info(`[Row processed] row=${JSON.stringify(row)}`);
        LOGGER.info(`[Mail Preview] ${JSON.stringify(mailMeta)}`);
      }

      mailingList.push(mailMeta);

    }))
    .on('end', async (rowCount: number) => {
      LOGGER.info(`[CSV processing completed] Parsed ${rowCount} rows`);

      if (dry_run === "true") {
        console.log("dry run complete - check the service.log to ")
      } else {
        console.log("--- Begin mailing process ---")
        mailParticipants(mailingList);
      }

    });
}

readAndProcessDataFromCSV();