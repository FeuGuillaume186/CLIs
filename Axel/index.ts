#!/usr/bin/env bun
import { $, spawn } from "bun";
import inquirer from "inquirer";
import ora from "ora";

const spinner = ora();

async function ask(question: string, def = ""): Promise<string> {
  const { answer } = await inquirer.prompt([
    {
      type: "input",
      name: "answer",
      message: question,
      default: def,
    },
  ]);
  return answer.trim();
}

async function checkAxelInstalled() {
  // detect os
  if (process.platform === "win32") {
    spinner.fail("Erreur : Axel n'est pas disponible sur Windows.");
    process.exit(1);
  }

  try {
    await $`axel --version`.quiet();
    return true;
  } catch {
    spinner.fail("Erreur : axel n'est pas installé.");

    const { install } = await inquirer.prompt([
      {
        type: "confirm",
        name: "install",
        message: "Voulez-vous installer axel maintenant ?",
        default: false,
      },
    ]);

    if (install) {
      try {
        spinner.start("Installation de axel...");
        await $`brew install axel`.quiet();
        spinner.succeed("axel a été installé avec succès.");
        return true;
      } catch {
        spinner.fail("Erreur lors de l'installation de axel.");
        process.exit(1);
      }
    }

    return false;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let connections = 2;
  let i = 0;

  while (i < args.length) {
    if (args[i] === "-n") {
      i++;
      if (i < args.length && /^\d+$/.test(args[i])) {
        connections = parseInt(args[i], 10);
      } else {
        console.error("Erreur : Le paramètre de -n doit être un nombre entier.");
        process.exit(1);
      }
    } else {
      console.error(`Erreur : Option inconnue ${args[i]}`);
      process.exit(1);
    }
    i++;
  }

  return { connections };
}

async function getHeaders(url: string): Promise<string> {
  try {
    spinner.start("Récupération des en-têtes...");
    const { stdout } = await $`curl -ILs ${url}`.quiet();
    spinner.succeed("En-têtes récupérés.");
    return stdout.toString();
  } catch {
    spinner.fail("Erreur lors de la récupération des en-têtes.");
    return "";
  }
}

function extractContentType(headers: string): string {
  const match = headers.match(/Content-Type:\s*([^;\r\n]+)/i);
  return match ? match[1].trim() : "";
}

function getExtension(url: string, contentType: string): string {
  if (url.includes(".")) {
    const ext = url.split("?")[0].split(".").pop();
    if (ext && ext.length <= 5) return ext;
  }

  if (contentType) {
    const map: Record<string, string> = {
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/ogg": "ogv",
      "audio/mpeg": "mp3",
      "audio/ogg": "ogg",
      "application/pdf": "pdf",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
      "image/tiff": "tiff",
    };
    if (map[contentType]) return map[contentType];
    if (contentType.includes("/")) return contentType.split("/")[1];
  }

  return "bin";
}

async function main(): Promise<void> {
  await checkAxelInstalled();

  const { connections } = parseArgs();
  let url = await ask("URL du fichier à télécharger :");
  if (!url) {
    spinner.fail("Erreur : L'URL ne peut pas être vide.");
    process.exit(1);
  }

  const headers = await getHeaders(url);
  const contentType = extractContentType(headers);
  const extension = getExtension(url, contentType);
  const defaultOutput = `.${extension}`;

  let output = await ask(`Nom du fichier de sauvegarde (extension par défaut : ${defaultOutput}) :`);
  if (output.lastIndexOf(".") === -1) output += "." + extension;

  try {
    const proc = spawn(["axel", "-a", "-n", connections.toString(), url, "-o", output], {
      stdio: ["inherit", "inherit", "inherit"],
    });

    process.on("SIGINT", () => {
      spinner.clear().fail("Téléchargement annulé.");
      proc.kill();
      process.exit(1);
    });

    console.log();
    await proc.exited;

    if (proc.exitCode === 0) spinner.succeed(`Téléchargement terminé avec succès : ${output}`);
    else spinner.fail("Le téléchargement a échoué.");

    process.exit(0);
  } catch {
    spinner.fail("Erreur: Une erreur s'est produite lors du téléchargement.");
    process.exit(1);
  }
}

main();
