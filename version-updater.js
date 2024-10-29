// version-updater.js
const fs = require('fs')
const path = require('path')

function updatePackageVersion(type = 'patch') {
  const packagePath = path.join(process.cwd(), 'package.json')
  const package = require(packagePath)

  let [major, minor, patch] = package.version.split('.').map(Number)

  switch (type.toLowerCase()) {
    case 'major': // Breaking changes
      major += 1
      minor = 0
      patch = 0
      break
    case 'minor': // New features
      minor += 1
      patch = 0
      break
    case 'patch': // Bug fixes
      patch += 1
      break
    default:
      console.error('Invalid version type. Using patch update.')
      patch += 1
  }

  package.version = `${major}.${minor}.${patch}`
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2))
  console.log(`Version updated to ${package.version}`)
  return package.version
}
// Get version type from command line argument
const versionType = process.argv[2] || 'patch'
updatePackageVersion(versionType)
