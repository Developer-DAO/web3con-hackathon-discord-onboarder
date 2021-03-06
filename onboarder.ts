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
    subject: "web3con 2022 Hackathon Discord Invite",
    inviteLinkHTML: `<div>
                        <p>Hi ${row["discord_handle"]}, thank you for registering for the web3con 2022 hackathon!  Please use the link below to join the web3con discord server:</p>
                     </div>
                     <div>
                        <a href="${DISCORD_INVITE}">${DISCORD_INVITE}</a>
                     </div>
                     <div>
                        <p>If you're experiencing issues joining the server please reply to this email and we'll assist you to as soon as we possibly can.<p/>
                     </div>
                     <div>
                        <div>
                          <p>Happy hacking!</p>
                        </div>
                        <p>-web3con team<p/>
                     </div>`
  } as MailMeta;
}
const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

const mailParticipants = async (mailingList: MailMeta[]) => {
  for (let i = 0; i < mailingList.length; i++) {
    await mail(mailingList[i]);
    await delay(5000);
  }
}

const readAndProcessDataFromCSV = async () => {
  LOGGER.info(`[Script configuration overview] Dry_Run=${dry_run}`);

  let mailingList: any[] = [];

  const stream = createReadStream('resources/hackers.csv');
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
        LOGGER.info("dry run complete - check the service.log to view the results ")
      } else {
        LOGGER.info("--- Begin Mailing Process ---")
        mailParticipants(mailingList);
      }
    });
}

readAndProcessDataFromCSV();