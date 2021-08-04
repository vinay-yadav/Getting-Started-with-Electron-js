const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// set ENV
process.env.NODE_ENV = DEVELOPMENT;
const isDev = process.env.NODE_ENV !== PRODUCTION ? true : false;

// set Platform
// console.log(process.platform);
const isMac = process.platform === 'darwin';


let mainWindow;
let aboutWindow;

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: 'Image Shrink',
        width: isDev ? 800 : 500,
        height: 600,
        icon: './assets/icons/Icon_256x256.png',
        resizable: isDev,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    // auto open dev-tools in development 
    if (isDev)
        mainWindow.webContents.openDevTools();

    // mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.loadFile('./app/index.html');
}


const createAboutWindow = () => {
    aboutWindow = new BrowserWindow({
        title: 'About Image Shrink',
        width: 300,
        height: 300,
        icon: './assets/icons/Icon_256x256.png',
        resizable: false,
        backgroundColor: 'white'
    });

    aboutWindow.loadFile('./app/about.html');
}


app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);


    // globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
    // globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools());


    mainWindow.on('ready', () => mainWindow = null);
});


const menu = [
    ...(
        isMac
            ? [
                // { role: 'appMenu' }
                {
                    label: app.name,
                    submenu: [
                        {
                            label: 'About',
                            click: createAboutWindow
                        }
                    ]
                }
            ]
            : []
    ),
    // {
    //     label: 'File',
    //     submenu: [
    //         {
    //             label: 'Quit',
    //             // accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
    //             accelerator: 'CmdOrCtrl+Q',
    //             click: () => app.quit()
    //         }
    //     ]
    // },
    {
        role: 'fileMenu'
    },
    ...(
        !isMac
            ? [
                {
                    label: 'Help',
                    submenu: [
                        {
                            label: 'About',
                            click: createAboutWindow
                        }
                    ]
                }
            ]
            : []
    ),
    ...(
        isDev
            ? [
                {
                    label: 'Developer',
                    submenu: [
                        { role: 'reload' },
                        { role: 'forcereload' },
                        { type: 'separator' },
                        { role: 'toggledevtools' }
                    ]
                }
            ]
            : []
    )
];


app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
});


ipcMain.on('image:minimize', (e, data) => {
    console.log('data', data);
})
