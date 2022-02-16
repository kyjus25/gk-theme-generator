const fs = require('fs');
const os = require('os');
const { menubar } = require('menubar');
const { Notification, ipcMain } = require('electron');

let inter = null;
  
const browserWindow = {
    resizable: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    },
    width: 250,
    height: 500
}

const mb = menubar({browserWindow});

const generateJSON = (color) => {
    return JSON.stringify({
        "meta": {
            "name": "Generated Theme",
            "scheme": "dark",
        },
        "themeValues": {
            "root": {
                "app__bg0": color,
                // graph colors
                "graph-color-0": `darken(${color}, 10%)`,
                "graph-color-1": `lighten(${color}, 10%)`,
                "graph-color-2": `darken(${color}, 20%)`,
                "graph-color-3": `lighten(${color}, 20%)`,
                "graph-color-4": `darken(${color}, 30%)`,
                "graph-color-5": color,
                "graph-color-6": `lighten(${color}, 30%)`,
                "graph-color-7": `darken(${color}, 40%)`,
                "graph-color-8": `lighten(${color}, 40%)`,
                "graph-color-9": `darken(${color}, 50%)`,
            }
        }
    });
}

mb.on('ready', () => {
    console.log('app is ready');
});

ipcMain.handle('generate', async (event, data) => {
    console.log('generating', data);
    if (inter) { clearInterval(inter); }
    let index = 0;
    if (!data.rotate) {
        index = data.colors.length - 1;
        const color = data.colors[index];
        fs.writeFileSync(`${os.homedir()}/.gitkraken/themes/generated.jsonc`, generateJSON(color));
        return;
    }
    inter = setInterval(() => {
        const color = data.colors[index];
        fs.writeFileSync(`${os.homedir()}/.gitkraken/themes/generated.jsonc`, generateJSON(color));
        // new Notification({ title: 'Success!', body: `Generated theme with ${color}.` }).show();
        index = index + 1 > data.colors.length - 1 ? 0 : index + 1;
    }, data.inter)
    return null;
})