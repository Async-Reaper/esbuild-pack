import { Plugin } from "esbuild";
import { rm, writeFile } from "fs/promises";
import path from "path";

interface IHTMLPlugin {
  template?: string;
  title?: string;
  jsPath?: string[];
  cssPath?: string[];
}

const renderHTML = (options: IHTMLPlugin): string => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="${options.cssPath}">
            <title>${options.title}</title>
        </head>
        <body>
            <div id="root"></div>
            ${options.jsPath?.map((path) => `<script src=${path}></script>`).join(" ")}
        </body>
        </html>
    `;
};

const preparePaths = (outputs: string[]) => {
  return outputs.reduce<Array<string[]>>(
    (acc, path) => {
      const [js, css] = acc;
      const splitedFileName = path.split("/").pop();

      if (splitedFileName?.endsWith(".js")) {
        js.push(splitedFileName);
      } else if (splitedFileName?.endsWith(".css")) {
        css.push(splitedFileName);
      }
      return acc;
    },
    [[], []]
  );
};

export const HTMLPlugin = (options: IHTMLPlugin): Plugin => {
  return {
    name: "HTMLPlugin",
    setup(build) {
      const outdir = build.initialOptions.outdir;
      build.onStart(async () => {
        try {
          if (outdir) {
            await rm(outdir, { recursive: true });
          }
        } catch (error) {
          console.log(`Не удалось очистить папку из-за ${error}`);
        }
      });

      build.onEnd(async (result) => {
        const outputs = result.metafile?.outputs;
        const [jsPath, cssPath] = preparePaths(Object.keys(outputs || {}));
        if (outdir) {
          await writeFile(path.resolve(outdir, "index.html"), options.template || renderHTML({ jsPath, cssPath, ...options }));
        }
      });
    },
  };
};
