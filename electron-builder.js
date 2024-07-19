const path = require('path')

module.exports = {
  appId: 'sansenshimizu.hayaraku',
  productName: 'Hayaraku',
  directories: {
    output: 'dist',
    buildResources: 'build',
  },
  files: ['build/**/*', 'package.json'],
  extraMetadata: {
    main: 'build/electron/main.js',
  },
  win: {
    target: 'nsis',
    icon: 'Untitled-1.ico',
    // pubilsh:['github']
  },
  nsis: {
    allowToChangeInstallationDirectory: true,
    oneClick: false,
    perMachine: false,
    allowElevation: true,
    installerIcon: 'Untitled-1.ico',
    uninstallerIcon: 'Untitled-1.ico',
    installerHeaderIcon: 'Untitled-1.ico',
    installerSidebar: 'installerSidebar-24.bmp',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Electron React Dashboard',
    deleteAppDataOnUninstall: true,
    differentialPackage: true,
    include: 'installer.nsh',
  },
  mac: {
    category: 'public.app-category.utilities',
  },
  linux: {
    target: ['deb', 'rpm', 'AppImage'],
    category: 'Utility',
  },
  // publish: {
  //   provider: 'github',
  //   owner: 'your-github-username',
  //   repo: 'your-repo-name'
  // }
}
