import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const database_id = process.env.DATABASE_ID || "DATABASE_ID not set";

function client() {
  return new Client({
    auth: process.env.NOTION_TOKEN,
  });
}

async function read() {
  const response = await client().databases.query({
    database_id,
  });

  console.log("Got response:", response);
}

async function addItem(text: string) {
  try {
    const response = await client().pages.create({
      parent: { database_id },
      properties: {
        title: {
          title: [
            {
              text: {
                content: text,
              },
            },
          ],
        },
      },
    });
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error: any) {
    console.error(error.body);
  }
}

read()
  .then(async () => {
    await addItem("Yurts in Big Sur, California");
    await read();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
