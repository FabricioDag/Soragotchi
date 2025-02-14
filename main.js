const { app, BrowserWindow, ipcMain } = require("electron");

const ipc = ipcMain;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 316,
    minWidth: 316,
    height: 389,
    minHeight: 389,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");

  //close app
  ipc.on("closeApp", () => {
    win.close();
  });

  ipc.on("minimizeApp", () => {
    win.minimize();
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
