import chalk from 'chalk';

export default class Logging {
    //  Standard Log
    public static log = (args: any) => this.info(args);

    //  Info log (blue)
    public static info = (args: any) => console.log(chalk.blue(`[${new Date().toLocaleDateString()}] [INFO] `), typeof args === 'string' ? chalk.blueBright(args) : args);

    //  Warn log (yellow)
    public static warn = (args: any) => console.log(chalk.yellow(`[${new Date().toLocaleDateString()}] [WARN] `), typeof args === 'string' ? chalk.yellowBright(args) : args);

    //  Error log (red)
    public static error = (args: any) => console.log(chalk.red(`[${new Date().toLocaleDateString()}] [ERROR] `), typeof args === 'string' ? chalk.redBright(args) : args);
}
